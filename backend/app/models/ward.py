from sqlalchemy import Column,Integer
from geoalchemy2 import Geometry
from app.db.database import Base

class Ward(Base):
    __tablename__ ='ward'

    id=Column(Integer,primary_key=True,index=True)
    wardnumber = Column(Integer,nullable=False,unique=True)
    boundary = Column(
        Geometry("POLYGON",srid=4326,spatial_index=True),
        nullable=False
    )

