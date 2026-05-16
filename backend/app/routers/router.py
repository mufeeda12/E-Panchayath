form fastapi import APIRouter

router = APIRouter()
@router.post("/chatbot"):
async def chatbot(query:str):
    response=chatbot_response(query)
    return response

