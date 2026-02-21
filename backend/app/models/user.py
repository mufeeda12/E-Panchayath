from sqlalchemy import Integer,Column,String,Enum
from app.db.database import Base
from sqlalchemy.orm import relationship


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    role = Column(Enum("USER", "ADMIN", name="user_roles"), default="USER")
    local_body_type = Column(
        Enum("Panchayat", "Municipality", name="local_body_types"),
        nullable=False
    )
    local_body_name = Column(String(150), nullable=False)

    phone_number = Column(String(15))
    ward_number = Column(Integer)
    district = Column(String(100))
    pincode = Column(String(10))

    complaints = relationship("Complaint",back_populates="user")