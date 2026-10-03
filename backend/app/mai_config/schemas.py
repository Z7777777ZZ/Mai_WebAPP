"""定义可由 Mai Dev Studio 管理的产品配置数据结构。"""

from pydantic import BaseModel, Field


class MaiConfig(BaseModel):
    """当前原型使用的 Mai 开场对白、Prompt 和输出长度。"""

    opening_messages: list[str] = Field(min_length=1, max_length=6)
    default_user_reply: str = Field(min_length=1, max_length=500)
    system_prompt: str = Field(min_length=1, max_length=12_000)
    max_tokens: int = Field(default=80, ge=16, le=256)
