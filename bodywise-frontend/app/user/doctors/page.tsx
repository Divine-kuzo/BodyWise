import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { featuredDoctors } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { userNav } from "@/lib/navigation";

export default function UserDoctorsPage() {
  return (
    <DashboardShell
      title="Find your support team"
      subtitle="Explore verified BodyWise professionals and book culturally aligned sessions."
      breadcrumbs={[
        { label: "User", href: "/user" },
        { label: "Doctors" },
      ]}
      navItems={userNav}
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {featuredDoctors.map((doctor) => (
          <div
            key={doctor.name}
            className="flex flex-col gap-4 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                {doctor.experience} experience
              </p>
              <h3 className="text-lg font-semibold text-[#3a2218]">
                {doctor.name}
              </h3>
              <p className="text-sm text-[#6a4a3a]">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#80685b]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f0d5b8]/80 px-3 py-1 text-xs font-semibold text-[#6a4a3a]">
                ★ {doctor.rating}
              </span>
              Trusted feedback from the community
            </div>
            <Button variant="secondary" className="mt-auto">
              Book appointment
            </Button>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}


