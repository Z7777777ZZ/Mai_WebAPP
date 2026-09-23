# Backend

Mai WebApp 的 FastAPI 后端，也是产品核心所在。

后端负责：

- 对话消息与 SSE 流式输出；
- Prompt 模板、版本、发布和回滚；
- 上下文选择与组装；
- 长期记忆提取、检索、合并和修正；
- 模型供应商适配；
- 每轮对话的完整 Trace；
- 数据持久化和权限边界。

计划采用：

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- PostgreSQL
- pgvector（在语义检索真正需要时启用）

后端采用模块化单体。`chat` 负责流程编排，但不直接实现模型供应商和记忆存储细节；`prompts`、`memory` 与 `llm` 通过清晰接口参与一次对话。

环境创建、依赖安装和服务启动由项目所有者执行。在正式初始化前，本目录只保留边界说明。

