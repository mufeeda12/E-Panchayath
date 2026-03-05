from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.schemas.createComplaint import createComplaint
from app.services.complaint_services import create_complaint_services,get_my_issues

router = APIRouter(prefix="/complaint",tags=["Complaints"])

@router.post("/")
def create_complaint(
        complaint:createComplaint,db:Session=Depends(get_db),current_user=Depends(get_current_user)
):

    return create_complaint_services(
        db=db,
        title=complaint.title,
        description=complaint.description,
        longitude=complaint.longitude,
        latitude=complaint.latitude,
        user_id=current_user.id
    )

@router.get("/my_issues/")
def get_my_complaints(db:Session=Depends(get_db),current_user=Depends(get_current_user)):
    return get_my_issues(db,current_user.id)