from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import userCreate,userLogin,userResponse,loginResponse
from app.services.user_services import register_user_services,login_user_services
from app.db.database import get_db
from app.core.auth import get_current_user,require_admin
from app.models.user import User
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(prefix="/users",tags=["users"])

@router.post('/register',response_model=userResponse)
def register(user:userCreate,db:Session=Depends(get_db)):
    return register_user_services(user,db)

@router.post('/login',response_model=loginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(),db:Session=Depends(get_db)):
    return login_user_services(form_data,db)
@router.get("/admin-test")
def admin_test(current_user: User = Depends(require_admin)):
    return {"message": "Welcome Admin"}




