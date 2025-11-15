import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { ActivityList } from "@/components/dashboard/activity-list";
import { SystemMonitor } from "@/components/admin/system-monitor";
import {
  adminStats,
  adminUsers,
  adminLogs,
  adminSystemPerformance,
  adminUserGrowthData,
} from "@/lib/dashboard-data";
import { adminNav } from "@/lib/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      title="System Administration"
      subtitle="Monitor platform health, user analytics, and manage institutional partnerships."
      actions={
        <div className="flex gap-3">
          <Link
            href="/admin/institutions"
            className="rounded-full bg-[#523329] px-5 py-3 text-sm font-semibold text-white shadow-[0_25px_70px_-55px_rgba(58,34,24,0.55)] transition hover:bg-[#684233]"
          >
            Review Institutions
          </Link>
          <Link
            href="/admin/system-admins"
            className="rounded-full border-2 border-[#523329] px-5 py-3 text-sm font-semibold text-[#523329] transition hover:bg-[#523329] hover:text-white"
          >
            Manage Admins
          </Link>
        </div>
      }
      breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
      navItems={adminNav}
    >
      {/* Key Metrics */}
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

      {/* System Resource Monitor */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <SystemMonitor />
      </section>

      {/* User Growth Analytics */}
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <h3 className="mb-6 text-lg font-semibold text-[#3a2218]">
          User Growth by Category (Last 6 Months)
        </h3>
        <div className="space-y-6">
          {adminUserGrowthData.map((category) => (
            <div key={category.category}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#3a2218]">
                  {category.category}
                </span>
                <span className="text-sm font-bold text-[#523329]">
                  {category.total} total
                </span>
              </div>
              <div className="relative h-8 overflow-hidden rounded-full bg-[#f9f0e6]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#523329] to-[#684233] transition-all"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[#80685b]">
                <span className="font-semibold text-green-600">
                  +{category.growth}
                </span>{" "}
                new users this month
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity & Logs */}
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <DataTable
          caption="Recently active community members"
          data={adminUsers.slice(0, 5)}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            {
              key: "status",
              header: "Status",
              render: (value) => (
                <span className="inline-flex rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">
                  {value as string}
                </span>
              ),
            },
          ]}
        />
        <ActivityList
          heading="Platform health updates"
          items={adminLogs.slice(0, 8).map((log) => ({
            title: log.event,
            time: log.timestamp,
            status: log.status,
          }))}
        />
      </section>
    </DashboardShell>
  );
}


