import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ChatThread } from "@/components/user/chat-thread";
import { userNav } from "@/lib/navigation";

const suggestedPrompts = [
  "I feel anxious about how I look during campus events.",
  "How can I create a body gratitude ritual that honours my culture?",
  "Help me plan questions for my next session with Dr. Mensa.",
] as const;

export default function UserChatPage() {
  return (
    <DashboardShell
      title="Chat with your BodyWise coach"
      subtitle="Ask questions, receive guidance, and feel supported every step of your journey."
      breadcrumbs={[
        { label: "User", href: "/user" },
        { label: "Chat" },
      ]}
      navItems={userNav}
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ChatThread />
        <div className="space-y-6 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Suggested prompts
          </h3>
          <ul className="space-y-3 text-sm text-[#6a4a3a]">
            {suggestedPrompts.map((prompt) => (
              <li
                key={prompt}
                className="rounded-2xl bg-[#f9f0e6] px-4 py-3"
              >
                {prompt}
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-[#523329] p-6 text-white">
            <p className="text-sm font-semibold">
              Need emergency support?
            </p>
            <p className="mt-2 text-xs text-white/70">
              Reach out to your local support line or a trusted adult. BodyWise
              coaches are here for listening and guidance, not crisis response.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}


