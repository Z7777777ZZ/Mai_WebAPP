# Mai WebApp

Mai 的 Backend、Web Playground 与 Dev Studio 工作区。最终产品客户端将使用
SwiftUI 开发，当前 Web 主要用于打磨和验证可独立部署的 Backend。

本阶段用 WebApp 验证四件事：

1. 可被 Web 与未来 iOS 共同调用的独立 Backend；
2. 自然、克制、接近即时通讯软件的聊天体验；
3. 可持续调整和回滚的 Prompt 系统；
4. 可观察、可修正、可逐步演化的长期记忆系统。

## 工作区边界

```text
Mai_Webapp/
├── frontend/   # Web Playground 与 Mai Dev Studio
├── backend/    # 可独立抽离部署的 Mai 产品服务
└── README.md   # 项目范围与架构约定
```

前端不直接调用任何模型服务。所有模型密钥、Prompt、记忆检索和对话编排均位于
Backend。Backend 不读取或依赖 frontend；删除整个 frontend 后，Backend 仍应能够
独立安装、测试、部署和运行。

## MVP 规划结构

目录按功能组织，但只在功能开始开发时创建，避免提前产生大量空目录。

```text
Mai_Webapp/
├── frontend/
│   ├── public/                 # 静态资源
│   ├── src/
│   │   ├── app/                # Next.js 路由与页面入口
│   │   │   ├── chat/           # 当前移动端聊天原型
│   │   │   └── dev/            # Dev Studio（第二阶段建设）
│   │   ├── features/
│   │   │   ├── playground/     # 移动端聊天与产品体验验证
│   │   │   └── devtools/       # Prompt、Trace、架构和环境工具
│   │   ├── components/
│   │   │   └── ui/             # 无业务含义的基础 UI
│   │   ├── lib/                 # Backend API 客户端与通用代码
│   │   ├── styles/              # 全局样式与设计变量
│   │   └── types/               # 前端共享类型
│   ├── tests/                   # 前端测试
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI 应用入口，只负责装配
│   │   ├── api/                 # Public API 与 Admin API
│   │   ├── chat/                # 聊天合同与应用编排
│   │   ├── mai_config/          # 当前产品配置
│   │   ├── llm/                 # 模型供应商集成
│   │   └── shared/              # 运行配置与公共异常
│   ├── migrations/              # PostgreSQL 数据库迁移
│   ├── tests/                   # 后端测试
│   └── README.md
│
└── README.md
```

## 结构原则

- **模块化单体**：MVP 只有一个后端服务和一个数据库，不拆微服务。
- **功能内聚**：每个后端模块自行拥有路由、服务、数据结构和数据访问代码。
- **依赖单向**：页面依赖 feature，feature 依赖通用 UI 与 API；通用层不得反向依赖业务模块。
- **核心自研**：Prompt、上下文组装、记忆与关系状态不交给 Agent 框架管理。
- **显式行为**：所有写入记忆、召回记忆和发布 Prompt 的操作都应可追踪。
- **按需建目录**：没有真实代码之前不创建抽象层，也不保留空的 `utils`、`helpers` 或 `services` 大杂烩。

## 第一阶段功能边界

### 用户聊天页

- 单一用户、单一 Mai；
- 文本消息；
- 非流式完整响应；
- 不展示模型思考过程；
- 消息历史持久化将在单独完成会话设计后实现；
- 移动端优先布局。

### Mai Studio

- 编辑 Prompt 草稿；
- 发布和回滚 Prompt 版本；
- 选择模型与基础参数；
- 查看每轮实际发送给模型的上下文；
- 查看召回和写入的记忆；
- 手动修正、停用或删除记忆。

### 暂不包含

- 角色库和多角色；
- 朋友圈；
- 语音和视频；
- 支付；
- 多 Agent；
- 独立向量数据库；
- Redis、消息队列与微服务。

## 命令执行约定

依赖安装、环境创建、数据库启动、迁移和开发服务器启动均由项目所有者手动执行。协作过程中不会未经明确要求自动运行 `pnpm`、`npm`、`conda`、`pip`、Docker 或应用启动命令。
