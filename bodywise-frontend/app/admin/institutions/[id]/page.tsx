import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { pendingInstitutions } from "@/lib/dashboard-data";
import { adminNav } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

interface InstitutionDetailPageProps {
  params: { id: string };
}

export default function InstitutionDetailPage({
  params,
}: InstitutionDetailPageProps) {
  const institution = pendingInstitutions.find(
    (item) => item.id.toString() === params.id,
  );

  if (!institution) {
    notFound();
  }

  return (
    <DashboardShell
      title={institution.name}
      subtitle="Review the institution’s submission, validate supporting documents, and approve when ready."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Institution Review", href: "/admin/institutions" },
        { label: institution.name },
      ]}
      navItems={adminNav}
      actions={
        <div className="flex gap-3">
          <Button variant="ghost" className="text-[#6a4a3a] hover:text-[#3a2218]">
            Request updates
          </Button>
          <Button variant="secondary">Approve institution</Button>
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
            <span className="rounded-full bg-[#f0d5b8]/70 px-3 py-1 text-[#6a4a3a]">
              Submitted {institution.submitted}
            </span>
            <span className="rounded-full bg-[#f9f0e6] px-3 py-1 text-[#6a4a3a]">
              {institution.country}
            </span>
            <span className="rounded-full bg-[#f9f0e6] px-3 py-1 text-[#6a4a3a]">
              Focus: {institution.focus}
            </span>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#3a2218]">
              Mission summary
            </h2>
            <p className="text-sm text-[#4b3125]">{institution.summary}</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#3a2218]">
              Programmes & offerings
            </h3>
            <ul className="space-y-2 text-sm text-[#6a4a3a]">
              {institution.programs.map((program) => (
                <li key={program} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#a5775a]" />
                  <span>{program}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
            <h3 className="text-sm font-semibold text-[#3a2218]">
              Primary contact
            </h3>
            <dl className="mt-4 space-y-3 text-sm text-[#4b3125]">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                  Name
                </dt>
                <dd>{institution.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                  Email
                </dt>
                <dd>
                  <Link
                    href={`mailto:${institution.contactEmail}`}
                    className="text-[#6a4a3a] underline underline-offset-4"
                  >
                    {institution.contactEmail}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                  Phone
                </dt>
                <dd>{institution.contactPhone}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
            <h3 className="text-sm font-semibold text-[#3a2218]">
              Supporting documents
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#4b3125]">
              {institution.documents.map((doc) => (
                <li
                  key={doc.label}
                  className="flex items-center justify-between rounded-2xl bg-[#f9f0e6] px-4 py-3"
                >
                  <span>{doc.label}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a4a3a]">
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="ghost" className="text-[#6a4a3a] hover:text-[#3a2218]">
          Save for later
        </Button>
        <Button variant="secondary">Approve institution</Button>
      </div>
    </DashboardShell>
  );
}


