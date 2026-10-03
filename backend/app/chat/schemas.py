"""定义当前聊天原型的公共请求与响应数据结构。"""

from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """一条可发送给模型的用户或 Mai 消息。"""

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4_000)


class ChatRequest(BaseModel):
    """聊天请求；会话持久化设计完成前暂由客户端提交最近消息。"""

    messages: list[ChatMessage] = Field(min_length=1, max_length=50)


class ChatResponse(BaseModel):
    """聊天接口返回的一条完整 Mai 消息。"""

    message: ChatMessage


class HealthResponse(BaseModel):
    """健康检查响应。"""

    status: Literal["ok"] = "ok"
