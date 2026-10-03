# Mai Frontend

Mai MVP 的移动端优先 Next.js 前端。页面最大宽度为 420px，不模拟 iPhone
系统状态栏。

## 页面

- `/`：只有一个 Mai 会话的首页。
- `/chat`：连接后端的 Mai 聊天页。
- `/studio`：编辑开场对白、默认用户回复、系统 Prompt 和最大输出 Token。

## 本地启动

命令由项目所有者执行：

```bash
cd frontend
cp .env.local.example .env.local
pnpm dev
```

默认连接 `http://localhost:8000`。如后端地址不同，请修改 `.env.local`
中的 `NEXT_PUBLIC_API_BASE_URL`。
