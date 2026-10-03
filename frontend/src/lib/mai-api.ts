/**
 * Mai 前端 API 客户端：集中处理后端地址、配置读写和聊天请求。
 */

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type MaiConfig = {
  opening_messages: string[];
  default_user_reply: string;
  system_prompt: string;
  max_tokens: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { detail?: string }
      | null;
    throw new Error(payload?.detail ?? `请求失败：${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getMaiConfig(): Promise<MaiConfig> {
  return request<MaiConfig>("/api/studio/config", { cache: "no-store" });
}

export function updateMaiConfig(config: MaiConfig): Promise<MaiConfig> {
  return request<MaiConfig>("/api/studio/config", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

export async function sendChat(messages: ChatMessage[]): Promise<ChatMessage> {
  const payload = await request<{ message: ChatMessage }>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
  return payload.message;
}

