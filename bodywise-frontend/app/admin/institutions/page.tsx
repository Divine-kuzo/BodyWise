import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { pendingInstitutions } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { adminNav } from "@/lib/navigation";

export default function AdminInstitutionsPage() {
  return (
    <DashboardShell
      title="Institutional Partnerships"
      subtitle="Review, verify, and approve organisations supporting African youth wellness."
      actions={<Button variant="secondary">Create partner invite</Button>}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Institution Review" },
      ]}
      navItems={adminNav}
    >
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <DataTable
          caption="Pending verification"
          data={pendingInstitutions}
          columns={[
            { key: "name", header: "Institution" },
            { key: "country", header: "Country" },
            { key: "submitted", header: "Submitted" },
            { key: "focus", header: "Focus Area" },
            {
              key: "status",
              header: "Status",
              render: (value) => (
                <span className="inline-flex rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">
                  {value as string}
                </span>
              ),
            },
            {
              key: "id",
              header: "Action",
              render: (_value, row) => {
                const { id } = row as (typeof pendingInstitutions)[number];
                return (
                  <Link
                    href={`/admin/institutions/${id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#523329] px-4 py-2 text-xs font-semibold text-white shadow-[0_20px_60px_-45px_rgba(58,34,24,0.55)] transition hover:bg-[#684233]"
                  >
                    View submission
                  </Link>
                );
              },
            },
          ]}
        />
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Verification checklist
          </h3>
          <ol className="mt-5 space-y-4 text-sm text-[#6a4a3a]">
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-semibold text-[#3a2218]">
                1
              </span>
              Confirm uploaded accreditation documents and references.
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-semibold text-[#3a2218]">
                2
              </span>
              Evaluate proposed programming for cultural relevance and safety.
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-semibold text-[#3a2218]">
                3
              </span>
              Schedule onboarding orientation with lead wellness coordinator.
            </li>
          </ol>
        </div>
      </section>
    </DashboardShell>
  );
}


