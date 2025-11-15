import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { institutionNav } from "@/lib/navigation";

const requiredDocs = [
  "Accreditation certificate",
  "Programme curriculum outline",
  "Safeguarding policy",
  "Lead practitioner credentials",
] as const;

export default function InstitutionDocumentsPage() {
  return (
    <DashboardShell
      title="Upload verification documents"
      subtitle="Share updated documents to keep your partnership active and ensure youth safety."
      breadcrumbs={[
        { label: "Institution", href: "/institution" },
        { label: "Verification Docs" },
      ]}
      navItems={institutionNav}
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form className="space-y-6 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="space-y-2">
            <Label htmlFor="institution-name" requiredIndicator>
              Institution name
            </Label>
            <Input id="institution-name" placeholder="Ubuntu Wellness Center" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country" requiredIndicator>
                Country
              </Label>
              <Input id="country" placeholder="South Africa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" requiredIndicator>
                Contact email
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="team@ubuntuwellness.org"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mission">
              Mission and community impact
            </Label>
            <textarea
              id="mission"
              rows={4}
              className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80"
              placeholder="Share how your organisation supports body literacy and mental wellness for African youth."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="docs" requiredIndicator>
              Upload documents
            </Label>
            <input
              id="docs"
              type="file"
              multiple
              className="w-full rounded-2xl border border-dashed border-[#d6b28f] bg-[#fdf9f6] px-4 py-6 text-sm text-[#6a4a3a] focus:outline-none"
            />
            <p className="text-xs text-[#80685b]">
              Accepted formats: PDF, DOCX, PNG. Max size 20MB each.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost">
              Save draft
            </Button>
            <Button type="submit" variant="secondary">
              Submit for verification
            </Button>
          </div>
        </form>

        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Required documents
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-[#6a4a3a]">
            {requiredDocs.map((doc) => (
              <li
                key={doc}
                className="flex items-start gap-3 rounded-2xl bg-[#f9f0e6] px-3 py-2"
              >
                <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-[#a5775a]" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}


