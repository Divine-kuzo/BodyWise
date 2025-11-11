import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { institutionDoctors } from "@/lib/dashboard-data";
import { OnboardDoctorModal } from "@/components/institution/onboard-doctor-modal";
import { institutionNav } from "@/lib/navigation";

export default function InstitutionDoctorsPage() {
  return (
    <DashboardShell
      title="Practitioner Network"
      subtitle="Manage your institution’s verified practitioners and invite new collaborators."
      actions={<OnboardDoctorModal />}
      breadcrumbs={[
        { label: "Institution", href: "/institution" },
        { label: "Doctors" },
      ]}
      navItems={institutionNav}
    >
      <DataTable
        caption="Current practitioner roster"
        data={institutionDoctors}
        columns={[
          { key: "name", header: "Name" },
          { key: "specialty", header: "Specialty" },
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
            key: "consultations",
            header: "Consultations",
            render: (value) => (
              <span className="text-sm font-semibold text-[#3a2218]">
                {value}
              </span>
            ),
          },
        ]}
      />
    </DashboardShell>
  );
}


