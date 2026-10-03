# Mai Backend

Mai 的可独立部署产品后端。Web Playground、Mai Dev Studio 和未来的 SwiftUI
客户端都只能通过 HTTP API 依赖它，Backend 不反向依赖任何客户端或开发工具。

## 边界

- Public API：供 Web Playground 和未来 iOS 客户端调用。
- Admin API：供 Mai Dev Studio 管理 Prompt 等产品配置。
- Dev Studio 的代码地图、`.env` 编辑和 Git 工具不进入 Backend。
- 当前不引入会话持久化；相关数据模型将在独立设计后实现。

## 目录

```text
backend/
├── app/
│   ├── main.py                 # 应用装配与 CORS
│   ├── api/
│   │   ├── public.py           # Public API
│   │   └── admin.py            # Admin API
│   ├── chat/
│   │   ├── schemas.py          # 聊天数据合同
│   │   └── service.py          # 一轮聊天的应用编排
│   ├── mai_config/
│   │   ├── schemas.py          # Mai 产品配置合同
│   │   └── store.py            # JSON 临时存储适配器
│   ├── llm/
│   │   ├── service.py          # 供应商无关的模型入口
│   │   └── deepseek.py         # DeepSeek 集成
│   └── shared/
│       ├── errors.py           # 跨模块业务异常
│       └── settings.py         # Backend 运行环境
└── data/
    └── mai_config.json         # 当前生效的 Mai 产品配置
```

依赖方向：

```text
API → Chat Service → Mai Config Store
                   → DeepSeek Integration

API → Mai Config Store

所有模块 → Shared（仅在需要时）
```

API 层不直接调用 DeepSeek；模型集成层也不知道 HTTP、Web Playground 或 Dev
Studio 的存在。

## API

### Public API

- `GET /api/v1/health`
- `POST /api/v1/chat`

### Admin API

- `GET /api/admin/v1/mai-config`
- `PUT /api/admin/v1/mai-config`

旧的 `/api/chat` 和 `/api/studio/config` 已删除，不提供兼容路由。

## 本地启动

命令由项目所有者在 `mai` Conda 环境中执行：

```bash
cd backend
python -m pip install -r requirements.txt
cp .env.example .env
```

在 `.env` 中填写 `DEEPSEEK_API_KEY`，然后启动：

```bash
fastapi dev app/main.py
```

默认 API 地址为 `http://localhost:8000`，健康检查为
`http://localhost:8000/api/v1/health`。

这是刻意保持简单的单用户 MVP。会话、数据库和记忆系统将在完成独立设计后加入，
不会为了 Dev Studio 提前创建错误的数据结构。
