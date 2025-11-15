import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChatCard } from "@/components/dashboard/chat-card";
import { ScheduleList } from "@/components/dashboard/schedule-list";
import { userStats, doctorSchedule } from "@/lib/dashboard-data";
import { userNav } from "@/lib/navigation";

const habitChecklist = [
  "Reflect on body gratitude journal (10 mins)",
  "Practice breathing ritual shared by Dr. Mensa",
  "Read this week’s community story",
  "Book follow-up session with Coach Ayo",
] as const;

export default function UserDashboardPage() {
  return (
    <DashboardShell
      title="Hi Amara, here’s your wellness snapshot"
      subtitle="Track your body confidence journey, access support, and stay consistent."
      breadcrumbs={[{ label: "User" }, { label: "Dashboard" }]}
      navItems={userNav}
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {userStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Today’s wellbeing focus
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-[#4b3125]">
            {habitChecklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-[#f9f0e6] px-3 py-2"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border border-[#d7c6ba] text-[#6a4a3a] focus:ring-[#d6b28f]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <ChatCard
          heading="BodyWise coach"
          messages={[
            {
              from: "coach",
              message: "Remember to celebrate the progress you shared in last session!",
              time: "09:12",
            },
            {
              from: "user",
              message: "Thank you, I’ll use the grounding exercise again today.",
              time: "09:14",
            },
          ]}
        />
      </section>

      <ScheduleList heading="Upcoming appointments" items={doctorSchedule} />
    </DashboardShell>
  );
}


