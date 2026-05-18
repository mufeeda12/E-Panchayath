# app/routers/chatbot.py

from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.chatbot import (
    ChatRequest
)

from app.core.auth import (
    get_current_user
)

from app.services.chatbot_services import (
    chatbot_response
)

router = APIRouter()


@router.post("/chat")
async def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return chatbot_response(
        data.message,
        current_user,
        db
    )