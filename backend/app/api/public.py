"""Mai 公共 API：供 Web Playground 与未来 iOS 客户端调用。"""

from fastapi import APIRouter, HTTPException, status

from app.chat.schemas import ChatMessage, ChatRequest, ChatResponse, HealthResponse
from app.chat.service import create_chat_reply
from app.shared.errors import LLMNotConfiguredError, LLMRequestError


router = APIRouter(prefix="/api/v1", tags=["public"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """供客户端、部署平台和本地开发检查服务是否存活。"""

    return HealthResponse()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """接收当前原型的消息历史，并返回 Mai 的一条最终回复。"""

    try:
        reply = await create_chat_reply(request.messages)
    except LLMNotConfiguredError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except LLMRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    return ChatResponse(message=ChatMessage(role="assistant", content=reply))
