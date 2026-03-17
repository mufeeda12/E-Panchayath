
from pydantic import BaseModel,EmailStr,Field
from typing import Literal


class userCreate(BaseModel):
    fullname:str
    phone_number: str
    email: EmailStr
    district: str
    pincode: str
    local_body_type: Literal["Panchayat", "Municipality"]
    local_body_name: str
    ward_number: int
    password:  str = Field(min_length=8, max_length=64)

class userLogin(BaseModel):
    email:EmailStr
    password:str

class userResponse(BaseModel):
    id: int
    fullname: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class loginResponse(BaseModel):
    message: str
    user:userResponse
    access_token: str
    token_type: str

