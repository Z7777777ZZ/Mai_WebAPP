/**
 * Mai 首页：展示唯一的 Mai 会话，并提供进入聊天页和 Studio 的入口。
 */

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type Conversation = {
  name: string;
  preview: string;
  time: string;
};

const conversations: Conversation[] = [
  { name: "Mai", preview: "我来听你说", time: "刚刚" },
];

function ChatGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M9.5 4C5.36 4 2 6.91 2 10.5c0 1.95.99 3.71 2.58 4.9l-.78 2.8c-.08.27.18.52.44.42l3.35-1.32c.6.14 1.24.21 1.91.21.28 0 .55-.02.82-.05C10.12 16.65 10 15.84 10 15c0-3.87 3.58-7 8-7 .23 0 .46.01.68.04C17.47 5.72 13.78 4 9.5 4Z" />
      <path d="M17.5 9C13.91 9 11 11.46 11 14.5s2.91 5.5 6.5 5.5c.53 0 1.05-.06 1.54-.17l2.67 1.05c.21.08.41-.12.35-.33l-.63-2.22c1.32-.98 2.07-2.39 2.07-3.83C23.5 11.46 20.59 9 17.5 9Z" />
    </svg>
  );
}

function ConversationAvatar() {
  return <img alt="Mai 头像" className="h-12 w-12 rounded-[6px] object-cover" src="/mai-avatar.jpg" />;
}

function ConversationRow({ item }: { item: Conversation }) {
  return (
    <Link className="flex items-center py-2.5 pl-3.5 pr-4 active:bg-gray-100" href="/chat">
      <div className="relative mr-3.5 shrink-0">
        <ConversationAvatar />
      </div>
      <div className="min-w-0 flex-1 border-b border-[#ececec] py-1 pb-2">
        <div className="mb-0.5 flex items-baseline justify-between gap-3">
          <h2 className="truncate text-[16.5px] font-normal leading-tight text-[#191919]">{item.name}</h2>
          <span className="shrink-0 text-[12px] font-normal text-[#b2b2b2]">{item.time}</span>
        </div>
        <p className="truncate text-[13.5px] font-normal leading-tight tracking-tight text-[#888]">{item.preview}</p>
      </div>
    </Link>
  );
}

function BottomTabs() {
  return (
    <nav className="grid h-[62px] shrink-0 grid-cols-4 border-t border-[#dfdfdf] bg-[#f7f7f7]/95 px-1 pt-1.5 backdrop-blur-md">
      <button className="flex flex-col items-center" type="button"><ChatGlyph className="h-7 w-7 fill-[#07c160]" /><span className="text-[10px] font-medium text-[#07c160]">微信</span></button>
      <Tab label="通讯录" type="person" />
      <Tab dot label="发现" type="compass" />
      <Tab label="我" type="person" />
    </nav>
  );
}

function Tab({ label, type, dot = false }: { label: string; type: "person" | "compass"; dot?: boolean }) {
  return (
    <button className="flex flex-col items-center" type="button">
      <span className="relative flex h-7 w-7 items-center justify-center">
        {type === "compass" ? (
          <svg className="h-6 w-6 fill-none stroke-[#191919]" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
        ) : (
          <svg className="h-6 w-6 fill-none stroke-[#191919]" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
        {dot ? <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-[#fa5151]" /> : null}
      </span>
      <span className="text-[10px] font-normal text-[#191919]">{label}</span>
    </button>
  );
}

export function InboxScreen() {
  return (
    <div className="mobile-screen flex select-none flex-col bg-white">
      <header className="shrink-0 bg-[#ededed] pb-2">
        <div className="relative flex h-12 items-center justify-center px-4">
          <h1 className="text-[17px] font-medium tracking-wide text-[#111]">Mai</h1>
          <Link aria-label="打开 Mai Studio" className="absolute right-4 top-1/2 -translate-y-1/2" href="/studio">
            <svg className="h-6 w-6 fill-none stroke-[#191919]" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8.5v7M8.5 12h7" strokeLinecap="round" /></svg>
          </Link>
        </div>
        <div className="px-2.5 pt-0.5">
          <button className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-white text-[#929292] shadow-sm" type="button">
            <svg className="h-4 w-4 fill-none stroke-[#9e9e9e]" strokeWidth="2.2" viewBox="0 0 24 24"><path d="m21 21-5.2-5.2A7.5 7.5 0 1 1 15.8 5.2 7.5 7.5 0 0 1 15.8 15.8Z" strokeLinecap="round" /></svg>
            <span className="text-[15px] font-normal">搜索</span>
          </button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto bg-white">{conversations.map((item) => <ConversationRow item={item} key={item.name} />)}</main>
      <BottomTabs />
    </div>
  );
}
