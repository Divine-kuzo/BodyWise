import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityList } from "@/components/dashboard/activity-list";
import { institutionStats } from "@/lib/dashboard-data";
import { institutionNav } from "@/lib/navigation";

const institutionUpdates = [
  {
    title: "New cohort kickoff: Body Confidence 101",
    time: "Jun 2, 09:00",
    description: "48 students from Lagos campus onboarded for June cycle.",
  },
  {
    title: "Wellness circle feedback summary",
    time: "Jun 1, 17:40",
    description: "Participants report 92% satisfaction with cultural relevance.",
  },
  {
    title: "Resource pack refreshed",
    time: "May 30, 12:10",
    description: "Added safe body practices video translated to Yoruba and Swahili.",
  },
] as const;

export default function InstitutionDashboardPage() {
  return (
    <DashboardShell
      title="Institutional Overview"
      subtitle="Track programme momentum, practitioner engagement, and impact across your community."
      breadcrumbs={[{ label: "Institution" }, { label: "Dashboard" }]}
      navItems={institutionNav}
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {institutionStats.map((stat) => (
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
            Programme highlights
          </h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#523329] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Community reach
              </p>
              <p className="mt-2 text-3xl font-semibold">12 campuses</p>
              <p className="mt-3 text-sm text-white/80">
                Students across Ghana, Nigeria, and Kenya receiving culturally
                aware body literacy guidance.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f9f0e6] p-6 text-[#4b3125]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                Upcoming focus
              </p>
              <ul className="mt-3 space-y-3 text-sm">
                <li>• Launch hybrid healing circles with local counsellors.</li>
                <li>• Equip faculty champions with updated safe-practice decks.</li>
                <li>• Share monthly progress snapshots with BodyWise HQ.</li>
              </ul>
            </div>
          </div>
        </div>
        <ActivityList heading="Recent updates" items={institutionUpdates} />
      </section>
    </DashboardShell>
  );
}


