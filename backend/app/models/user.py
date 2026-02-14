from sqlalchemy import Integer,Column,String
from app.db.database import Base

class User(Base):
    __tablename__="user"
    id = Column(Integer, primary_key=True, index=True)

    firstname = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=False)

    phone_number = Column(String(15), nullable=False, unique=True)
    email = Column(String(100), unique=True, index=True, nullable=False)

    district = Column(String(100), nullable=False)
    pin_code = Column(String(10), nullable=False)

    local_body_type = Column(String(50), nullable=False)
    # Panchayat or Municipality

    local_body_name = Column(String(100), nullable=False)
    ward_number = Column(Integer, nullable=False)

    password = Column(String(255), nullable=False)