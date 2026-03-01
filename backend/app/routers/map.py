from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import get_current_user
from app.services.ward_services import get_all_wards
from app.models.user import User


router=APIRouter( prefix="/map",tags=["map view"])

@router.get("/wards")
def get_wards(
        db: Session =Depends(get_db),
        current_user:User=Depends(get_current_user)):
    return get_all_wards(db)




