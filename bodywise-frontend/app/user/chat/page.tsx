import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ChatThread } from "@/components/user/chat-thread";
import { userNav } from "@/lib/navigation";

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
      <ChatThread />
    </DashboardShell>
  );
}


