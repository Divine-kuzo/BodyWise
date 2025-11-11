interface ChatMessage {
  from: "coach" | "user";
  message: string;
  time: string;
}

interface ChatCardProps {
  heading: string;
  messages: ReadonlyArray<ChatMessage>;
}

export function ChatCard({ heading, messages }: ChatCardProps) {
  return (
    <div className="rounded-3xl border border-[#e6d8ce] bg-white shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-sm font-semibold text-[#3a2218]">{heading}</h3>
        <button className="rounded-full bg-[#f0d5b8]/80 px-4 py-2 text-xs font-semibold text-[#6a4a3a] transition hover:bg-[#e6c8ab]">
          Open chat
        </button>
      </div>
      <div className="space-y-3 px-6 pb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              message.from === "coach"
                ? "bg-[#523329] text-white ml-auto"
                : "bg-[#f9f0e6] text-[#3a2218]"
            }`}
          >
            <p>{message.message}</p>
            <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              {message.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


