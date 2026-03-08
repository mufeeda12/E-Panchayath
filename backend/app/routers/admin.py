from fastapi import APIRouter,Depends,Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import require_admin
from app.services.complaint_services import get_all_complaints
from app.models.enums import ComplaintStatus

router = APIRouter(prefix="/admin",tags=["Admin"])

@router.get("/complaints")
def fetch_all_complaints(
        ward_id: int=Query(None),
        status: ComplaintStatus=Query(None),
        db:Session=Depends(get_db),
        admin=Depends(require_admin)

):
    return get_all_complaints(db,ward_id,status)

