from fastapi import APIRouter,Depends,Query,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import require_admin,get_current_user
from app.services.complaint_services import get_all_complaints
from app.services.ward_services import create_ward
from app.models.enums import ComplaintStatus
from app.services.complaint_services import update_complaint_status,get_complaint_by_id,get_complaint_stats,get_complaint_markers
from app.schemas.createComplaint import updateComplaintStatusResponse
router = APIRouter(prefix="/admin",tags=["Admin"])

@router.get("/complaints")
def fetch_all_complaints(
    ward_id: int | None = Query(None),
    status: ComplaintStatus | None = Query(None),
    search: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    return get_all_complaints(
        db=db,
        ward_id=ward_id,
        search=search,
        status=status,
        skip=skip,
        limit=limit
    )
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
@router.get("/complaints/stats")
def complaint_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    stats = get_complaint_stats(db)
    return stats

@router.get("/complaints/{complaint_id}")
def get_complaint(
        complaint_id: int,
        db: Session = Depends(get_db),
        admin=Depends(require_admin)):

    return get_complaint_by_id(
        db=db,
        complaint_id=complaint_id
    )
@router.post("/wards")
def add_ward(
    wardnumber: int,
    boundary: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Only admin can add wards
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    return create_ward(db, wardnumber, boundary)
