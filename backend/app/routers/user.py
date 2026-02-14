from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import userCreate,userLogin,userResponse,loginResponse
from app.services.user_services import register_user_services,login_user_services
from app.db.database import get_db

router = APIRouter(prefix="/users",tags=["users"])

@router.post('/register',response_model=userResponse)
def register(user:userCreate,db:Session=Depends(get_db)):
    return register_user_services(user,db)

@router.post('/login',response_model=loginResponse)
def login(user_req:userLogin,db:Session=Depends(get_db)):
    return login_user_services(user_req,db)




