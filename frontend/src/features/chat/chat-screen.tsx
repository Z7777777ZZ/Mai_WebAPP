/**
 * Mai 聊天页：展示可配置的开场对白，并把用户消息发送到 DeepSeek 后端。
 */

"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  type ChatMessage,
  getMaiConfig,
  type MaiConfig,
  sendChat,
} from "@/lib/mai-api";

type DisplayMessage = ChatMessage & { id: string };

const fallbackConfig: MaiConfig = {
  opening_messages: [
    "我通过了你的朋友验证请求，现在我们可以开始聊天了。",
    "有些东西放心里太大了",
    "我来听你说",
  ],
  default_user_reply: "好",
  system_prompt: "",
  max_tokens: 80,
};

function createInitialMessages(config: MaiConfig): DisplayMessage[] {
  return [
    ...createOpeningMessages(config.opening_messages),
    {
      id: "default-user-reply",
      role: "user" as const,
      content: config.default_user_reply,
    },
  ];
}

function createOpeningMessages(openingMessages: string[]): DisplayMessage[] {
  return openingMessages.map((content, index) => ({
    id: `opening-${index}`,
    role: "assistant" as const,
    content,
  }));
}

function Avatar({ mine = false }: { mine?: boolean }) {
  return (
    <img
      alt={mine ? "我的头像" : "Mai 头像"}
      className="h-[41px] w-[41px] shrink-0 rounded-[4px] bg-white object-cover"
      src={mine ? "/user-avatar.jpg" : "/mai-avatar.jpg"}
    />
  );
}

function TextMessage({ children, mine = false }: { children: ReactNode; mine?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine ? <Avatar /> : null}
      <div className={`relative max-w-[70%] whitespace-pre-wrap rounded-[4px] px-3.5 py-[9px] text-[16px] leading-[22px] shadow-[0_1px_1px_rgba(0,0,0,0.03)] ${mine ? "bubble-right bg-[#95ec69]" : "bubble-left bg-white"}`}>{children}</div>
      {mine ? <Avatar mine /> : null}
    </div>
  );
}

export function ChatScreen() {
  const [messages, setMessages] = useState<DisplayMessage[]>(
    createInitialMessages(fallbackConfig),
  );
  const [openingMessages, setOpeningMessages] = useState(
    fallbackConfig.opening_messages,
  );
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 每次进入聊天页读取最新 Studio 配置，让调教结果立即生效。
    getMaiConfig()
      .then((config) => {
        setOpeningMessages(config.opening_messages);
        setMessages(createInitialMessages(config));
      })
      .catch(() => {
        // 后端尚未启动时保留本地默认开场，页面依然可以预览。
      });
  }, []);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waiting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || waiting) return;

    const userMessage: DisplayMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setWaiting(true);

    try {
      const reply = await sendChat(
        nextMessages.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
      );
      setMessages((current) => [
        ...current,
        { ...reply, id: crypto.randomUUID() },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "消息发送失败",
      );
    } finally {
      setWaiting(false);
    }
  }

  function clearHistory() {
    // 清空用户回复和后续对话，但保留 Studio 中配置的 Mai 开场消息。
    setMessages(createOpeningMessages(openingMessages));
    setInput("");
    setError("");
  }

  return (
    <div className="mobile-screen flex select-none flex-col bg-[#ededed]">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e3e3e3] bg-[#ededed]/95 px-3 backdrop-blur-md">
        <Link aria-label="返回" className="flex h-9 w-9 items-center justify-start active:opacity-60" href="/">
          <svg className="h-6 w-6 fill-none stroke-black" strokeWidth="2.2" viewBox="0 0 24 24"><path d="m15.75 19.5-7.5-7.5 7.5-7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="text-[17px] font-medium tracking-wide text-[#181818]">Mai</h1>
        <button aria-label="清空历史消息" className="flex h-9 min-w-9 items-center justify-end text-[14px] text-[#576b95] disabled:opacity-40" disabled={waiting} onClick={clearHistory} type="button">清空</button>
      </header>

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3.5 py-4">
        {messages.map((message) => (
          <TextMessage key={message.id} mine={message.role === "user"}>{message.content}</TextMessage>
        ))}
        {error ? <p className="px-12 text-center text-[12px] leading-5 text-[#d14b42]">{error}</p> : null}
        <div ref={feedEndRef} />
      </main>

      <form className="flex min-h-[58px] shrink-0 items-center gap-2 border-t border-[#dcdcdc] bg-[#f7f7f7] px-2.5 py-2" onSubmit={handleSubmit}>
        <button aria-label="语音模式" className="shrink-0 p-1 active:opacity-60" type="button">
          <svg className="h-[30px] w-[30px] fill-none stroke-[#181818]" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="flex h-[38px] min-w-0 flex-1 items-center rounded-[5px] border border-[#e2e2e2] bg-white px-3"><input aria-label="消息" className="w-full border-none bg-transparent p-0 text-[16px] leading-none text-black outline-none" disabled={waiting} onChange={(event) => setInput(event.target.value)} value={input} /></div>
        <button aria-label="表情符号" className="shrink-0 p-1 active:opacity-60" type="button"><svg className="h-[30px] w-[30px] fill-none stroke-[#181818]" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M15.2 15.2a4.5 4.5 0 0 1-6.4 0M9 9.5h.01M15 9.5h.01" strokeLinecap="round" /></svg></button>
        {input.trim() ? (
          <button className="h-8 shrink-0 rounded-[4px] bg-[#07c160] px-3 text-[14px] text-white disabled:opacity-50" disabled={waiting} type="submit">发送</button>
        ) : (
          <button aria-label="更多功能" className="shrink-0 p-1 active:opacity-60" type="button"><svg className="h-[30px] w-[30px] fill-none stroke-[#181818]" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 9v6m3-3H9" strokeLinecap="round" /></svg></button>
        )}
      </form>
    </div>
  );
}
