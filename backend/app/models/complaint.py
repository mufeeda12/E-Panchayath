from sqlalchemy import Column,Integer,String,Text,DateTime,ForeignKey,Enum
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.db.database import Base
from sqlalchemy.orm import relationship
from app.models.enums import ComplaintStatus
class Complaint(Base):
    __tablename__ = 'complaint'
    id=Column(Integer,primary_key=True, index=True)
    title=Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(Geometry("point", srid=4326),nullable=False)
    ward_id=Column(Integer,ForeignKey("ward.id"),nullable=False)
    user_id=Column(Integer,ForeignKey("user.id"),nullable=False)
    status = Column(
        Enum(ComplaintStatus),
        default=ComplaintStatus.PENDING,
        nullable=False
    )
    image_url = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    started_at =Column(DateTime(timezone=True),nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    admin_comment = Column(Text, nullable=True)

    user= relationship("User",back_populates="complaints")
    ward =relationship("Ward",back_populates="complaints")
