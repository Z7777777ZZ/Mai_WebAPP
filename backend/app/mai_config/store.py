"""使用 JSON 文件持久化 Mai 产品配置，作为数据库接入前的临时适配器。"""

import asyncio
import json
from pathlib import Path

from app.mai_config.schemas import MaiConfig


DEFAULT_CONFIG = MaiConfig(
    opening_messages=[
        "我通过了你的朋友验证请求，现在我们可以开始聊天了。",
        "有些东西放心里太大了",
        "我来听你说",
    ],
    default_user_reply="好",
    system_prompt=(
        "你是 Mai，一个长期陪伴用户的私人情感伙伴。"
        "你不是客服、老师或心理咨询模板。先理解情绪，再自然回应。"
        "像真实朋友发消息：每次通常只说一到两句短句，不列清单，不写标题，"
        "不复述用户整段话，不急着给建议，不声称自己是真人。"
        "除非用户明确要求详细解释，否则回复控制在 35 个中文字符以内。"
    ),
    max_tokens=80,
)


class MaiConfigStore:
    """串行读写配置文件，避免同时保存时产生不完整 JSON。"""

    def __init__(self) -> None:
        backend_root = Path(__file__).resolve().parents[2]
        self._path = backend_root / "data" / "mai_config.json"
        self._lock = asyncio.Lock()

    async def load(self) -> MaiConfig:
        """读取已保存配置；首次运行时自动创建默认配置。"""

        async with self._lock:
            if not self._path.exists():
                await self._write(DEFAULT_CONFIG)
                return DEFAULT_CONFIG.model_copy(deep=True)

            payload = json.loads(self._path.read_text(encoding="utf-8"))
            return MaiConfig.model_validate(payload)

    async def save(self, config: MaiConfig) -> MaiConfig:
        """保存并返回经过验证的配置。"""

        async with self._lock:
            await self._write(config)
            return config

    async def _write(self, config: MaiConfig) -> None:
        """原子替换配置文件，减少写入中断造成的数据损坏。"""

        self._path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "_description": "Mai 产品配置，由 Backend 保存并由 Dev Studio 管理。",
            **config.model_dump(),
        }
        temporary_path = self._path.with_suffix(".tmp")
        temporary_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        temporary_path.replace(self._path)


mai_config_store = MaiConfigStore()
