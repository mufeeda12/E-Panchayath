from sqlalchemy import func
from app.models.ward import Ward
import json

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

