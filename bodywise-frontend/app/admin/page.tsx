import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { adminNav } from "@/lib/navigation";
import Link from "next/link";

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
      <AdminDashboard />
    </DashboardShell>
  );
}


