from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.ward import Ward
from app.models.complaint import Complaint
from geoalchemy2.shape import to_shape
from app.models.enums import ComplaintStatus
from datetime import datetime

def create_complaint_services(db:Session,title:str,description:str,longitude:float,latitude:float,user_id:int):
    point=func.ST_SetSRID(func.ST_Point(longitude,latitude),4326)
    ward=db.query(Ward).filter(
        func.ST_Contains(Ward.boundary,point)
    ).first()
    if not ward:
        raise HTTPException(status_code=400,detail="location is outside of boundaries")

    complaint= Complaint(
    title=title,
    description=description,
    location=point,
    ward_id=ward.id,
    user_id=user_id
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    point_obj = to_shape(complaint.location)
    return {
        "id": complaint.id,
        "title": complaint.title,
        "description": complaint.description,
        "latitude": point_obj.y,
        "longitude": point_obj.x,
        "status": complaint.status,
        "ward_id": complaint.ward_id
    }
def get_my_issues(db:Session,user_id:int):
    complaint=db.query(Complaint).filter(Complaint.user_id==user_id).all()
    complaints=[]
    for c in complaint:
        complaints.append({
            "id":c.id,
            "title":c.title,
            "description":c.description,
            "status":c.status
        })
    return complaints
def get_all_complaints(
    db: Session,
    ward_id: int | None = None,
    status: ComplaintStatus | None = None,
    skip: int = 0,
    limit: int = 10,
    search: str | None = None
):

    query = db.query(Complaint)

    if ward_id:
        query = query.filter(Complaint.ward_id == ward_id)

    if status:
        query = query.filter(Complaint.status == status)

    if search:
        query = query.filter(
            Complaint.title.ilike(f"%{search}%")
        )

    complaints = (
        query.order_by(Complaint.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []

    for c in complaints:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "ward_id": c.ward_id,
            "user_id": c.user_id,
            "image_url": c.image_url,
            "created_at": c.created_at,
        })

    return result
def update_complaint_status(db:Session,
                            complaint_id:int,
                            new_status:ComplaintStatus,
                            admin_comment:str|None=None
                            ):
    complaint=db.query(Complaint).filter(Complaint.id==complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404,detail="complaint not found")
    print("CURRENT STATUS:", complaint.status)
    print("NEW STATUS:", new_status)

    if complaint.status==ComplaintStatus.RESOLVED:
        raise HTTPException(status_code=400,detail="complaint already resolved")
    if complaint.status==ComplaintStatus.PENDING and new_status!=ComplaintStatus.IN_PROGRESS:
        raise HTTPException(status_code=400,detail="Pending complaints must move to In_Progress")
    if complaint.status==ComplaintStatus.IN_PROGRESS and new_status!=ComplaintStatus.RESOLVED:
        raise HTTPException(status_code=400,detail="In_progress complaints must move to Resolved")

    if new_status==ComplaintStatus.RESOLVED:
        complaint.resolved_at=datetime.utcnow()
    if new_status==ComplaintStatus.IN_PROGRESS:
        complaint.started_at=datetime.utcnow()

    complaint.status=new_status
    if admin_comment:
        complaint.admin_comment=admin_comment


    db.commit()
    db.refresh(complaint)
    return complaint
def get_complaint_by_id(db:Session,complaint_id:int):
    c=db.query(Complaint).filter(Complaint.id==complaint_id).first()
    if not c:
        raise HTTPException(status_code=404,detail="complaint not found")
    result=[]

    result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "ward_id": c.ward_id,
            "user_id": c.user_id,
            "image_url": c.image_url,
            "created_at": c.created_at,
        })
    return result












