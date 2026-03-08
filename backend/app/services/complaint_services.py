from sqlalchemy.orm import session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.ward import Ward
from app.models.complaint import Complaint
from geoalchemy2.shape import to_shape
from app.models.enums import ComplaintStatus

def create_complaint_services(db:session,title:str,description:str,longitude:float,latitude:float,user_id:int):
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
def get_my_issues(db:session,user_id:int):
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
def get_all_complaints(db:session,
                       ward_id:int,
                       status: ComplaintStatus =None
                       ):
    query=db.query(Complaint)
    if ward_id:
        query=query.filter(Complaint.ward_id==ward_id)
    if status:
        query=query.filter(Complaint.status==status)
    complaints=query.order_by(Complaint.created_at.desc()).all()
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










