from sqlalchemy import func
from app.models.ward import Ward
import json
from sqlalchemy.orm import Session
from fastapi import HTTPException

def create_ward(db: Session, wardnumber: int, boundary: dict):

    existing = db.query(Ward).filter(Ward.wardnumber == wardnumber).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ward already exists")

    # Convert GeoJSON to geometry
    geom = func.ST_SetSRID(func.ST_GeomFromGeoJSON(str(boundary)), 4326)

    ward = Ward(
        wardnumber=wardnumber,
        boundary=geom
    )

    db.add(ward)
    db.commit()
    db.refresh(ward)

    return {
        "id": ward.id,
        "wardnumber": ward.wardnumber
    }
def get_all_wards(db):
    wards=db.query(
        Ward.id,
        Ward.wardnumber,
        func.ST_AsGeoJSON(Ward.boundary).label("boundary")
    ).all()
    features=[]

    for ward in wards:
        features.append({
        "type":"Feature",
        "properties":{
            "id":ward.id,
            "ward_number":ward.wardnumber,
        },
        "geometry":json.loads(ward.boundary)
        })


    return {
        "type":"FeatureCollection",
        "features":features,

    }

