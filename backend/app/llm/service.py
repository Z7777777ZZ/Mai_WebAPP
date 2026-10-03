"""向聊天模块提供供应商无关的模型调用入口。"""

from app.chat.schemas import ChatMessage
from app.llm.deepseek import create_deepseek_reply
from app.mai_config.schemas import MaiConfig
from app.shared.settings import Settings


async def create_llm_reply(
    messages: list[ChatMessage],
    mai_config: MaiConfig,
    settings: Settings,
) -> str:
    """根据 Backend 运行配置调用当前模型供应商。"""

    # 当前只接入 DeepSeek；未来增加供应商时由这一层负责选择。
    return await create_deepseek_reply(messages, mai_config, settings)
