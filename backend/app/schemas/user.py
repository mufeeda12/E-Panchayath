
from pydantic import BaseModel,EmailStr,Field
from typing import Literal


class userCreate(BaseModel):
    firstname:str
    lastname:str
    phone_number: str
    email: EmailStr
    district: str
    pin_code: str
    local_body_type: Literal["Panchayat", "Municipality"]
    local_body_name: str
    ward_number: int
    password:  str = Field(min_length=8, max_length=64)

class userLogin(BaseModel):
    email:EmailStr
    password:str

class userResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: EmailStr
    district: str
    pin_code: str
    local_body_type: str
    local_body_name: str
    ward_number: int

    class Config:
        from_attributes = True

class loginResponse(BaseModel):
    message: str
    user:userResponse