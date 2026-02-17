from fastapi import FastAPI,Depends
from app.db.database import engine
from app.models import user,ward
from app.routers import user as user_router
from app.middleware.cors import add_cors_middleware

app=FastAPI()

#table creation
user.Base.metadata.create_all(engine)
ward.Base.metadata.create_all(engine)
#activate cors
add_cors_middleware(app)

#include routers
app.include_router(user_router.router)

@app.get("/")
def root():
    return {"message": "E-Panchayat Backend Running"}
