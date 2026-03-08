from fastapi import APIRouter,Depends,Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import require_admin
from app.services.complaint_services import get_all_complaints
from app.models.enums import ComplaintStatus
from app.services.complaint_services import update_complaint_status
from app.schemas.createComplaint import updateComplaintStatusResponse

router = APIRouter(prefix="/admin",tags=["Admin"])

@router.get("/complaints")
def fetch_all_complaints(
        ward_id: int=Query(None),
        status: ComplaintStatus=Query(None),
        db:Session=Depends(get_db),
        admin=Depends(require_admin)

):
    return get_all_complaints(db,ward_id,status)

@router.patch("/complaints/{complaint_id}/status",response_model=updateComplaintStatusResponse)
def change_status(
        complaint_id: int,
        status: ComplaintStatus,
        db:Session=Depends(get_db),
        admin=Depends(require_admin),
        admin_comment:str|None=None
):
    return  update_complaint_status(
        db,
        complaint_id,
        status,
        admin_comment
    )