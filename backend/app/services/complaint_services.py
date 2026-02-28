from sqlalchemy.orm import session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.ward import Ward
from app.models.complaint import Complaint
from geoalchemy2.shape import to_shape

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




