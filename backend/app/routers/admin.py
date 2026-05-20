from fastapi import APIRouter,Depends,Query,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import require_admin,get_current_user
from app.services.complaint_services import get_all_complaints, get_ward_analytics
from app.services.ward_services import create_ward,delete_ward_by_number,get_ward_by_number,get_all_wards,update_ward_boundary
from app.models.enums import ComplaintStatus
from app.services.complaint_services import update_complaint_status,get_complaint_by_id,get_complaint_stats,get_complaint_markers,update_complaint_priority
from app.schemas.createComplaint import updateComplaintStatusResponse,UpdateComplaintStatusRequest
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
@router.patch("/complaints/{complaint_id}/priority")
def change_priority(
        complaint_id: int,
        priority: str,
        db:Session=Depends(get_db),
        admin=Depends(require_admin)
):
    return update_complaint_priority(db, complaint_id, priority)

@router.patch(
    "/complaints/{complaint_id}/status",
    response_model=updateComplaintStatusResponse
)
def change_status(
    complaint_id: int,
    data: UpdateComplaintStatusRequest,
    db: Session = Depends(get_db),
    admin = Depends(require_admin),
):

    return update_complaint_status(
        db,
        complaint_id,
        data.status,
        data.adminComment
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
@router.put("/wards/number/{wardnumber}")
def edit_ward_boundary_endpoint(
    wardnumber: int,
    boundary: dict,
    member_name: str | None = Query(None),
    member_phone: str | None = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return update_ward_boundary(db, wardnumber, boundary, member_name, member_phone)

@router.post("/wards")
def add_ward(
    wardnumber: int,
    boundary: dict,
    member_name: str = Query(...),
    member_phone: str = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Only admin can add wards
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    return create_ward(db, wardnumber, boundary,member_name,member_phone)

@router.get("/wards")
def get_all_wards_endpoint(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """
    Get all wards with their boundaries in GeoJSON format.
    Only admin can view all wards.
    """
    return get_all_wards(db)

@router.delete("/wards/number/{wardnumber}")
def delete_ward_by_number_endpoint(
    wardnumber: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """
    Delete a ward by ward number.
    Only admin can delete wards.
    Cannot delete a ward if it has associated complaints.
    
    Args:
        wardnumber: Ward number of the ward to delete
        db: Database session
        admin: Current admin user (from require_admin dependency)
        
    Returns:
        Dictionary with success message and deleted ward info
        
    Status Codes:
        200: Ward deleted successfully
        404: Ward not found
        400: Ward has associated complaints
        403: User is not admin
    """
    return delete_ward_by_number(db, wardnumber)


@router.get("/wards/number/{wardnumber}")
def get_ward_by_number_endpoint(
    wardnumber: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """
    Get a specific ward by ward number with its GeoJSON boundary.
    Only admin can view individual ward details.
    
    Args:
        wardnumber: Ward number of the ward to retrieve
        db: Database session
        admin: Current admin user (from require_admin dependency)
        
    Returns:
        Ward feature with GeoJSON geometry
        
    Status Codes:
        200: Ward found and returned
        404: Ward not found
        403: User is not admin
    """
    return get_ward_by_number(db, wardnumber)


@router.get("/ward-analytics")
def get_ward_analytics_endpoint(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """
    Get ward-wise complaint analytics for the admin dashboard.
    """
    return get_ward_analytics(db)