"""编排一次 Mai 回复，让 HTTP 路由不直接依赖配置存储和模型供应商。"""

from app.chat.schemas import ChatMessage
from app.llm.service import create_llm_reply
from app.mai_config.store import mai_config_store
from app.shared.settings import get_settings


async def create_chat_reply(messages: list[ChatMessage]) -> str:
    """读取当前 Mai 配置并调用已配置的模型生成最终回复。"""

    mai_config = await mai_config_store.load()
    return await create_llm_reply(messages, mai_config, get_settings())
