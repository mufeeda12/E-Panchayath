from pydantic import BaseModel

class createComplaint(BaseModel):
    title:str
    description:str
    longitude:float
    latitude:float

