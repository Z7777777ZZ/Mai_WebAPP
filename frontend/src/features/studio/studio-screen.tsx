/**
 * Mai Studio：编辑开场对白、用户默认回复、系统 Prompt 和最大输出长度。
 */

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import {
  getMaiConfig,
  type MaiConfig,
  updateMaiConfig,
} from "@/lib/mai-api";

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

export function StudioScreen() {
  const [config, setConfig] = useState<MaiConfig>(fallbackConfig);
  const [openingText, setOpeningText] = useState(
    fallbackConfig.opening_messages.join("\n"),
  );
  const [status, setStatus] = useState("正在读取配置…");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMaiConfig()
      .then((loaded) => {
        setConfig(loaded);
        setOpeningText(loaded.opening_messages.join("\n"));
        setStatus("已连接后端");
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "无法读取配置");
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("正在保存…");

    const nextConfig: MaiConfig = {
      ...config,
      opening_messages: openingText
        .split("\n")
        .map((message) => message.trim())
        .filter(Boolean),
    };

    try {
      const saved = await updateMaiConfig(nextConfig);
      setConfig(saved);
      setOpeningText(saved.opening_messages.join("\n"));
      setStatus("已保存，重新打开聊天页即可看到开场对白变化");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mobile-screen flex flex-col bg-[#f5f5f5]">
      <header className="flex h-12 shrink-0 items-center border-b border-[#dedede] bg-white px-3">
        <Link className="flex h-9 w-9 items-center" href="/">
          <svg className="h-6 w-6 fill-none stroke-black" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="m15.75 19.5-7.5-7.5 7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[17px] font-medium">Mai Studio</h1>
      </header>

      <form className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5" onSubmit={handleSubmit}>
        <Field label="Mai 的开场消息" hint="每行会显示为一个独立气泡。">
          <textarea className="min-h-32 w-full resize-y rounded-lg border border-[#ddd] bg-white p-3 text-[15px] leading-6 outline-none focus:border-[#07c160]" onChange={(event) => setOpeningText(event.target.value)} value={openingText} />
        </Field>

        <Field label="你的默认回复" hint="用于新会话的最后一条用户消息。">
          <input className="h-11 w-full rounded-lg border border-[#ddd] bg-white px-3 text-[15px] outline-none focus:border-[#07c160]" onChange={(event) => setConfig({ ...config, default_user_reply: event.target.value })} value={config.default_user_reply} />
        </Field>

        <Field label="Mai 的系统提示词" hint="它决定 Mai 如何理解和回应你。">
          <textarea className="min-h-64 w-full resize-y rounded-lg border border-[#ddd] bg-white p-3 text-[15px] leading-6 outline-none focus:border-[#07c160]" onChange={(event) => setConfig({ ...config, system_prompt: event.target.value })} value={config.system_prompt} />
        </Field>

        <Field label="最大输出 Token" hint="建议保持 80；过低可能截断半句话。">
          <input className="h-11 w-full rounded-lg border border-[#ddd] bg-white px-3 text-[15px] outline-none focus:border-[#07c160]" max={256} min={16} onChange={(event) => setConfig({ ...config, max_tokens: Number(event.target.value) })} type="number" value={config.max_tokens} />
        </Field>

        <p className="text-[13px] leading-5 text-[#777]">{status}</p>
        <button className="h-11 w-full rounded-lg bg-[#07c160] text-[16px] font-medium text-white disabled:opacity-50" disabled={saving} type="submit">{saving ? "保存中…" : "保存配置"}</button>
      </form>
    </div>
  );
}

function Field({ children, hint, label }: { children: React.ReactNode; hint: string; label: string }) {
  return (
    <label className="block space-y-2">
      <span className="block text-[15px] font-medium text-[#191919]">{label}</span>
      <span className="block text-[12px] leading-5 text-[#888]">{hint}</span>
      {children}
    </label>
  );
}

