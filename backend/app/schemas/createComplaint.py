from pydantic import BaseModel
from app.models.enums import ComplaintStatus
from datetime import datetime
from typing import Optional

class createComplaint(BaseModel):
    title:str
    description:str
    longitude:float
    latitude:float
class UpdateComplaintStatusRequest(BaseModel):
    status: ComplaintStatus
    adminComment: Optional[str] = None
class updateComplaintStatusResponse(BaseModel):
    id:int
    status:ComplaintStatus
    adminComment:Optional[str]=None
    startedAt:Optional[datetime]=None
    resolvedAt:Optional[datetime]=None

    class Config:
        from_attributes = True


