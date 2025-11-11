import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { doctorPatients } from "@/lib/dashboard-data";
import { doctorNav } from "@/lib/navigation";

const carePlanNotes = [
  {
    patient: "Amara O.",
    note: "Exploring healthier routines, scheduled community support circle.",
  },
  {
    patient: "Biko M.",
    note: "Drafting body literacy resources tailored to football club.",
  },
  {
    patient: "Leila S.",
    note: "Integrating breathing exercises with cultural storytelling.",
  },
] as const;

export default function DoctorPatientsPage() {
  return (
    <DashboardShell
      title="Patient journeys"
      subtitle="Track progress, biometric insights, and personalised care plans for each member."
      breadcrumbs={[
        { label: "Doctor", href: "/doctor" },
        { label: "Patients" },
      ]}
      navItems={doctorNav}
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <DataTable
          caption="Care roster"
          data={doctorPatients}
          columns={[
            { key: "name", header: "Name" },
            { key: "progress", header: "Status" },
            { key: "lastSession", header: "Last Session" },
            { key: "nextSession", header: "Next Session" },
          ]}
        />
        <div className="space-y-4 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Care plan highlights
          </h3>
          <ul className="space-y-3 text-sm text-[#6a4a3a]">
            {carePlanNotes.map((item) => (
              <li
                key={item.patient}
                className="rounded-2xl bg-[#f9f0e6] px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                  {item.patient}
                </p>
                <p className="mt-1 text-sm text-[#4b3125]">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}


