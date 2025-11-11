import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { ActivityList } from "@/components/dashboard/activity-list";
import {
  adminStats,
  adminUsers,
  adminLogs,
} from "@/lib/dashboard-data";
import { adminNav } from "@/lib/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      title="Global Insights"
      subtitle="Monitor BodyWise platform health, community engagement, and partner growth at a glance."
      actions={
        <Link
          href="/admin/institutions"
          className="rounded-full bg-[#523329] px-5 py-3 text-sm font-semibold text-white shadow-[0_25px_70px_-55px_rgba(58,34,24,0.55)] transition hover:bg-[#684233]"
        >
          Review institutions
        </Link>
      }
      breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
      navItems={adminNav}
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
          />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <DataTable
          caption="Recently active community members"
          data={adminUsers}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "location", header: "Location" },
            {
              key: "status",
              header: "Status",
              render: (value) => (
                <span className="inline-flex rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">
                  {value as string}
                </span>
              ),
            },
            { key: "joined", header: "Joined" },
          ]}
        />
        <ActivityList
          heading="Platform health updates"
          items={adminLogs.map((log) => ({
            title: log.event,
            time: log.timestamp,
            status: log.status,
          }))}
        />
      </section>
    </DashboardShell>
  );
}


