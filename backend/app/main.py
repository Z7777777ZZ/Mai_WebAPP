"""创建 Mai FastAPI 应用，仅负责装配公共接口、管理接口和跨域策略。"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin import router as admin_router
from app.api.public import router as public_router
from app.shared.settings import get_settings


def create_app() -> FastAPI:
    """构建应用工厂，方便后续测试和部署复用。"""

    settings = get_settings()
    app = FastAPI(title="Mai API", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "OPTIONS"],
        allow_headers=["*"],
    )
    # 公共接口供 Web Playground 和未来 iOS 客户端共同使用。
    app.include_router(public_router)
    # 管理接口供 Mai Dev Studio 调试产品配置，不承载开发工具本身。
    app.include_router(admin_router)
    return app


app = create_app()
