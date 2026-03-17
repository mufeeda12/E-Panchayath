from fastapi import FastAPI,Depends
from app.db.database import engine,Base
from app.models import user,ward,complaint
from app.routers import user as user_router
from app.routers import complaint as complaint_router
from app.middleware.cors import add_cors_middleware
from app.routers import map as map_router
from app.routers import admin as admin_router

app=FastAPI()

#table creation
Base.metadata.create_all(engine)
#activate cors
add_cors_middleware(app)
#include routers
app.include_router(user_router.router)
app.include_router(complaint_router.router)
app.include_router(map_router.router)
app.include_router(admin_router.router)
@app.get("/")
def root():
    return {"message": "E-Panchayat Backend Running"}
