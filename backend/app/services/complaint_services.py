from sqlalchemy.orm import Session
from sqlalchemy import func,case
from fastapi import HTTPException
from app.models.ward import Ward
from app.models.complaint import Complaint
from geoalchemy2.shape import to_shape
from app.models.enums import ComplaintStatus
from datetime import datetime
from app.ml.utils.predict import predict_category, predict_priority, get_category_label
def create_complaint_services(db:Session,title:str,description:str,longitude:float,latitude:float,user_id:int):
    point=func.ST_SetSRID(func.ST_Point(longitude,latitude),4326)
    ward=db.query(Ward).filter(
        func.ST_Contains(Ward.boundary,point)
    ).first()
    if not ward:
        raise HTTPException(status_code=400,detail="location is outside of boundaries")
    text=title+" "+description
    category = predict_category(text)
    priority = int(predict_priority(text))

    complaint= Complaint(
    title=title,
    description=description,
    location=point,
    ward_id=ward.id,
    user_id=user_id,
    category=category,
    priority=priority,
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
        "wardnumber": complaint.ward.wardnumber,
        "category": get_category_label(complaint.category),
        "priority":complaint.priority,
    }
def get_my_issues(db:Session,user_id:int):
    complaint=db.query(Complaint).filter(Complaint.user_id==user_id).all()
    complaints=[]
    for c in complaint:
        complaints.append({
            "id":c.id,
            "title":c.title,
            "description":c.description,
            "status":c.status,
            "wardnumber":c.ward.wardnumber
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
            "wardnumber": c.ward.wardnumber,
            "user_id": c.user_id,
            "image_url": c.image_url,
            "created_at": c.created_at,
            "priority": c.priority,
            "category": get_category_label(c.category),
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
        try:
            from app.utils.notifications import send_resolution_email
            send_resolution_email(complaint.user.fullname, complaint.user.email, complaint.title)
        except Exception as e:
            print(f"Failed to send notification: {e}")
            
    if new_status==ComplaintStatus.IN_PROGRESS:
        complaint.started_at=datetime.utcnow()

    complaint.status=new_status
    if admin_comment:
        complaint.admin_comment=admin_comment


    db.commit()
    db.refresh(complaint)
    return complaint

def update_complaint_priority(db: Session, complaint_id: int, new_priority: str):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="complaint not found")
        
    complaint.priority = new_priority
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
            "wardnumber": c.ward.wardnumber,
            "user_id": c.user_id,
            "image_url": c.image_url,
            "created_at": c.created_at,
            "priority": c.priority,
            "category": get_category_label(c.category),
        })
    return result


def get_complaint_stats(db: Session):
    # Total counts across all complaints
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == ComplaintStatus.PENDING).count()
    in_progress = db.query(Complaint).filter(Complaint.status == ComplaintStatus.IN_PROGRESS).count()
    resolved = db.query(Complaint).filter(Complaint.status == ComplaintStatus.RESOLVED).count()

    # Ward-wise statistics using wardnumber
    ward_stats = (
        db.query(
            Ward.wardnumber,
            func.count(Complaint.id).label("total"),
            func.sum(case((Complaint.status == ComplaintStatus.PENDING, 1), else_=0)).label("pending"),
            func.sum(case((Complaint.status == ComplaintStatus.IN_PROGRESS, 1), else_=0)).label("in_progress"),
            func.sum(case((Complaint.status == ComplaintStatus.RESOLVED, 1), else_=0)).label("resolved"),
        )
        .join(Ward, Complaint.ward_id == Ward.id)
        .group_by(Ward.wardnumber)
        .order_by(Ward.wardnumber)
        .all()
    )

    # Convert results to list of dictionaries
    ward_list = [
        {
            "wardnumber": w.wardnumber,
            "total": w.total,
            "pending": w.pending,
            "in_progress": w.in_progress,
            "resolved": w.resolved
        }
        for w in ward_stats
    ]

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "by_ward": ward_list
    }

def get_ward_analytics(db: Session):
    analytics = (
        db.query(
            Ward.wardnumber.label("ward"),
            func.count(Complaint.id).label("total"),
            func.sum(case((Complaint.status == ComplaintStatus.PENDING, 1), else_=0)).label("pending"),
            func.sum(case((Complaint.status == ComplaintStatus.RESOLVED, 1), else_=0)).label("resolved"),
            func.avg(func.extract('epoch', Complaint.resolved_at - Complaint.created_at)).label("avg_resolution_seconds")
        )
        .join(Ward, Complaint.ward_id == Ward.id)
        .group_by(Ward.wardnumber)
        .order_by(Ward.wardnumber)
        .all()
    )

    result = []
    for ward in analytics:
        avg_seconds = ward.avg_resolution_seconds
        avg_time = None
        avg_days = None
        if avg_seconds is not None:
            avg_days = avg_seconds / 86400
            if avg_days < 1:
                avg_time = f"{avg_days * 24:.1f} Hours"
            else:
                avg_time = f"{avg_days:.1f} Days"

        resolved_ratio = (ward.resolved / ward.total * 100) if ward.total else 0
        if ward.total == 0:
            performance = "No Data"
        elif resolved_ratio >= 90 and (avg_days is None or avg_days <= 3):
            performance = "Excellent"
        elif resolved_ratio >= 75 and (avg_days is None or avg_days <= 7):
            performance = "Good"
        elif resolved_ratio >= 50:
            performance = "Needs Improvement"
        else:
            performance = "Poor"

        result.append({
            "ward": ward.ward,
            "total": ward.total,
            "pending": ward.pending,
            "resolved": ward.resolved,
            "resolved_percent": round(resolved_ratio, 1),
            "avg_time": avg_time or "N/A",
            "performance": performance
        })

    return result

def get_complaint_markers(db:Session,user_id:int | None = None):
    query = db.query(Complaint)

    if user_id:
        query = query.filter(Complaint.user_id == user_id)

    complaints = query.all()
    result = []
    for c in complaints:
        point = to_shape(c.location)
        result.append({
            "id": c.id,
            "title": c.title,
            "latitude": point.y,
            "longitude": point.x,
            "status": c.status,
            "wardnumber": c.ward.wardnumber,
            "user_id": c.user_id
        })
    return result
def get_latest_complaint(db,user_id,category=None):
    query=db.query(Complaint).filter(Complaint.user_id==user_id)
    if category:
        query =query.filter(Complaint.category == category)
        return query.order_by(Complaint.created_at.desc()).first()
def get_pending_complaints_count(db,user_id):
    return db.query(Complaint).filter(Complaint.user_id==user_id,Complaint.status!="RESOLVED").count()











