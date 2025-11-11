import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { adminLogs } from "@/lib/dashboard-data";
import { adminNav } from "@/lib/navigation";

export default function AdminLogsPage() {
  return (
    <DashboardShell
      title="Application Performance"
      subtitle="Track system events, deployments, and alerts to keep BodyWise reliable."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Performance Logs" },
      ]}
      navItems={adminNav}
    >
      <DataTable
        caption="Recent platform events"
        data={adminLogs}
        columns={[
          { key: "timestamp", header: "Timestamp" },
          { key: "event", header: "Event" },
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
    </DashboardShell>
  );
}


