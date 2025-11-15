import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { adminUsers } from "@/lib/dashboard-data";
import { adminNav } from "@/lib/navigation";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      title="Community Directory"
      subtitle="Manage member accounts, monitor status changes, and support a safe experience."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Members" },
      ]}
      navItems={adminNav}
    >
      <DataTable
        caption="All members"
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
    </DashboardShell>
  );
}


