"""Mai 管理 API：供 Dev Studio 管理产品配置，不包含本地开发工具能力。"""

from fastapi import APIRouter

from app.mai_config.schemas import MaiConfig
from app.mai_config.store import mai_config_store


router = APIRouter(prefix="/api/admin/v1", tags=["admin"])


@router.get("/mai-config", response_model=MaiConfig)
async def read_mai_config() -> MaiConfig:
    """读取当前生效的 Mai 开场对白、Prompt 和模型输出参数。"""

    return await mai_config_store.load()


@router.put("/mai-config", response_model=MaiConfig)
async def update_mai_config(config: MaiConfig) -> MaiConfig:
    """保存经过验证的 Mai 产品配置。"""

    return await mai_config_store.save(config)
