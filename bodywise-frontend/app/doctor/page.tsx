import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ScheduleList } from "@/components/dashboard/schedule-list";
import { DataTable } from "@/components/dashboard/data-table";
import {
  doctorStats,
  doctorSchedule,
  doctorPatients,
} from "@/lib/dashboard-data";
import { doctorNav } from "@/lib/navigation";

export default function DoctorDashboardPage() {
  return (
    <DashboardShell
      title="Today’s overview"
      subtitle="Stay prepared for scheduled sessions, monitor patient progress, and celebrate impact."
      breadcrumbs={[{ label: "Doctor" }, { label: "Dashboard" }]}
      navItems={doctorNav}
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {doctorStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <DataTable
          caption="Active patient focus"
          data={doctorPatients}
          columns={[
            { key: "name", header: "Patient" },
            { key: "progress", header: "Progress" },
            { key: "lastSession", header: "Last Session" },
            { key: "nextSession", header: "Next Session" },
          ]}
        />
        <ScheduleList heading="Upcoming sessions" items={doctorSchedule} />
      </section>
    </DashboardShell>
  );
}


