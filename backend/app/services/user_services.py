from pyexpat.errors import messages
from sqlalchemy.orm import session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password,verify_password

def register_user_services(user,db:session):
    existing_user=db.query(User).filter(User.email==user.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail='Email already registered')
    new_user = User(
        firstname=user.firstname,
        lastname=user.lastname,
        phone_number=user.phone_number,
        email=user.email,
        pin_code=user.pin_code,
        district=user.district,
        local_body_type=user.local_body_type,
        local_body_name=user.local_body_name,
        ward_number=user.ward_number,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
def login_user_services(user_req,db:session):
    db_user=db.query(User).filter(User.email==user_req.email).first()
    if not db_user:
        raise HTTPException(status_code=400,detail='user is not found')
    if not verify_password(user_req.password,db_user.password):
        raise HTTPException(status_code=400,detail='incorrect password')
    return {"message":"login successful","user":db_user}




