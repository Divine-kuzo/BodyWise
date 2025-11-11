"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  sender: "coach" | "user";
  content: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    sender: "coach",
    content: "Hi Amara, how are you feeling about your body awareness practice today?",
    time: "09:05",
  },
  {
    sender: "user",
    content: "Feeling balanced! I tried the breathing ritual you shared.",
    time: "09:06",
  },
  {
    sender: "coach",
    content: "That’s brilliant. Remember to celebrate every small shift.",
    time: "09:06",
  },
];

export function ChatThread() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        content: draft.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-[520px] flex-col overflow-hidden rounded-3xl border border-[#e6d8ce] bg-white shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
      <div className="flex items-center justify-between border-b border-[#f1e3d9] px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold text-[#3a2218]">
            Chat with Coach Laila
          </h2>
          <p className="text-xs text-[#80685b]">
            Typically responds within a few minutes
          </p>
        </div>
        <span className="rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">
          Live
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
        {messages.map((message, index) => (
          <div
            key={`${message.content}-${index}`}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              message.sender === "coach"
                ? "bg-[#523329] text-white"
                : "ml-auto bg-[#f9f0e6] text-[#3a2218]"
            }`}
          >
            <p>{message.content}</p>
            <span
              className={`mt-2 block text-[11px] font-semibold uppercase tracking-[0.2em] ${
                message.sender === "coach" ? "text-white/70" : "text-[#a1897c]"
              }`}
            >
              {message.time}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#f1e3d9] bg-[#fdf9f6] px-6 py-4">
        <label className="sr-only" htmlFor="chat-message">
          Message
        </label>
        <textarea
          id="chat-message"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Share how you’re feeling…"
          className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80"
        />
        <div className="mt-3 flex justify-end">
          <Button type="button" variant="secondary" onClick={handleSend}>
            Send message
          </Button>
        </div>
      </div>
    </div>
  );
}


