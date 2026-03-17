from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import get_current_user
from app.services.ward_services import get_all_wards
from app.models.user import User
from app.services.complaint_services import get_complaint_markers

router=APIRouter( prefix="/map",tags=["map view"])

@router.get("/wards")
def get_wards(
        db: Session =Depends(get_db),
        current_user:User=Depends(get_current_user)):
    return get_all_wards(db)

@router.get("/home")
def home_complaint_map(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role == "ADMIN":
        markers = get_complaint_markers(db)  # all complaints
    else:
        markers = get_complaint_markers(db, user_id=current_user.id)  # user's complaints only

    return markers


