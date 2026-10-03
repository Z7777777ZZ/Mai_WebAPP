"""封装 DeepSeek Chat Completions 调用并只返回最终文本。"""

from openai import APIError, AsyncOpenAI

from app.chat.schemas import ChatMessage
from app.mai_config.schemas import MaiConfig
from app.shared.errors import LLMNotConfiguredError, LLMRequestError
from app.shared.settings import Settings


async def create_deepseek_reply(
    messages: list[ChatMessage],
    mai_config: MaiConfig,
    settings: Settings,
) -> str:
    """将系统 Prompt 和消息历史交给 DeepSeek，返回一条完整短回复。"""

    if settings.deepseek_api_key is None:
        raise LLMNotConfiguredError("DEEPSEEK_API_KEY 尚未配置")

    client = AsyncOpenAI(
        api_key=settings.deepseek_api_key.get_secret_value(),
        base_url=settings.deepseek_base_url,
    )
    model_messages = [
        {"role": "system", "content": mai_config.system_prompt},
        *[message.model_dump() for message in messages],
    ]

    try:
        completion = await client.chat.completions.create(
            model=settings.deepseek_model,
            messages=model_messages,  # type: ignore[arg-type]
            max_tokens=mai_config.max_tokens,
            stream=False,
            # Mai 只消费最终回复，不请求或展示模型思考过程。
            extra_body={"thinking": {"type": "disabled"}},
        )
    except APIError as exc:
        raise LLMRequestError("DeepSeek API 请求失败") from exc

    content = completion.choices[0].message.content
    if not content or not content.strip():
        raise LLMRequestError("DeepSeek 没有返回文本")

    return content.strip()
