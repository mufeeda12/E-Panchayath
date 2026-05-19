from sqlalchemy import func
from app.models.ward import Ward
import json
from sqlalchemy.orm import Session
from fastapi import HTTPException

def create_ward(db: Session, wardnumber: int, boundary: dict,member_name: str,
    member_phone: str):

    existing = db.query(Ward).filter(Ward.wardnumber == wardnumber).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ward already exists")

    # Convert GeoJSON to geometry
    geom = func.ST_SetSRID(func.ST_GeomFromGeoJSON(str(boundary)), 4326)

    ward = Ward(
        wardnumber=wardnumber,
        boundary=geom,
        member_name=member_name,
        member_phone=member_phone
    )

    db.add(ward)
    db.commit()
    db.refresh(ward)
    return {
        "id": ward.id,
        "wardnumber": ward.wardnumber,
        "member_name": ward.member_name,
        "member_phone": ward.member_phone
    }

def update_ward_boundary(db: Session, wardnumber: int, boundary: dict, member_name: str | None = None, member_phone: str | None = None):
    ward = db.query(Ward).filter(Ward.wardnumber == wardnumber).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    geom = func.ST_SetSRID(func.ST_GeomFromGeoJSON(str(boundary)), 4326)
    ward.boundary = geom
    if member_name is not None:
        ward.member_name = member_name
    if member_phone is not None:
        ward.member_phone = member_phone

    db.commit()
    db.refresh(ward)

    return {
        "id": ward.id,
        "wardnumber": ward.wardnumber,
        "member_name": ward.member_name,
        "member_phone": ward.member_phone
    }

def get_all_wards(db):
    wards=db.query(
        Ward.id,
        Ward.wardnumber,
        Ward.member_name,
        Ward.member_phone,
        func.ST_AsGeoJSON(Ward.boundary).label("boundary")
    ).order_by(Ward.wardnumber).all()
    features=[]

    for ward in wards:
        features.append({
        "type":"Feature",
        "properties":{
            "id":ward.id,
            "wardnumber":ward.wardnumber,
            "member_name": ward.member_name,
            "member_phone": ward.member_phone,
        },
        "geometry":json.loads(ward.boundary)
        })


    return {
        "type":"FeatureCollection",
        "features":features,

    }


def delete_ward_by_number(db: Session, wardnumber: int):
    """
    Delete a ward by ward number from the database.
    
    Args:
        db: Database session
        wardnumber: Ward number to delete
        
    Returns:
        Dictionary with success message and deleted ward info
        
    Raises:
        HTTPException: If ward not found or if ward has associated complaints
    """
    # Check if ward exists
    ward = db.query(Ward).filter(Ward.wardnumber == wardnumber).first()
    if not ward:
        raise HTTPException(status_code=404, detail=f"Ward {wardnumber} not found")
    
    # Check if ward has any complaints
    if ward.complaints:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete ward {wardnumber}. It has {len(ward.complaints)} associated complaints. Please resolve or delete complaints first."
        )
    
    # Delete the ward
    db.delete(ward)
    db.commit()
    
    return {
        "success": True,
        "message": f"Ward {wardnumber} deleted successfully",
        "ward_id": ward.id,
        "ward_number": wardnumber
    }


def get_ward_by_number(db: Session, wardnumber: int):
    """
    Get a specific ward by ward number with its GeoJSON boundary.
    
    Args:
        db: Database session
        wardnumber: Ward number to retrieve
        
    Returns:
        Ward details with GeoJSON geometry
        
    Raises:
        HTTPException: If ward not found
    """
    ward = db.query(
        Ward.id,
        Ward.wardnumber,
        Ward.member_name,
        Ward.member_phone,
        func.ST_AsGeoJSON(Ward.boundary).label("boundary")
    ).filter(Ward.wardnumber == wardnumber).first()
    
    if not ward:
        raise HTTPException(status_code=404, detail=f"Ward {wardnumber} not found")
    
    return {
        "type": "Feature",
        "properties": {
            "id": ward.id,
            "wardnumber": ward.wardnumber,
            "member_name": ward.member_name,
            "member_phone": ward.member_phone,
        },
        "geometry": json.loads(ward.boundary)
    }