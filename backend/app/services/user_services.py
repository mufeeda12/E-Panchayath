from pyexpat.errors import messages
from sqlalchemy.orm import session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password,verify_password
from app.core.auth import create_access_token

def register_user_services(user,db:session):
    existing_user=db.query(User).filter(User.email==user.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail='Email already registered')
    new_user = User(
        fullname=user.fullname,
        phone_number=user.phone_number,
        email=user.email,
        pincode=user.pincode,
        district=user.district,
        local_body_type=user.local_body_type,
        local_body_name=user.local_body_name,
        ward_number=user.ward_number,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
def login_user_services(user_req,db:session):
    db_user=db.query(User).filter(User.email==user_req.username).first()
    if not db_user:
        raise HTTPException(status_code=400,detail='user is not found')
    if not verify_password(user_req.password,db_user.hashed_password):
        raise HTTPException(status_code=400,detail='incorrect password')
    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "message":"login successfull",
        "user":db_user,
        "access_token": access_token,
        "token_type": "bearer"
    }




