import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ScheduleList } from "@/components/dashboard/schedule-list";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { doctorSchedule } from "@/lib/dashboard-data";
import { doctorNav } from "@/lib/navigation";

export default function DoctorSchedulePage() {
  return (
    <DashboardShell
      title="Manage schedule"
      subtitle="Plan availability, share consultation slots, and sync with BodyWise community needs."
      breadcrumbs={[
        { label: "Doctor", href: "/doctor" },
        { label: "Schedule" },
      ]}
      navItems={doctorNav}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <form className="space-y-5 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" requiredIndicator>
                Date
              </Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" requiredIndicator>
                Time range
              </Label>
              <Input id="time" placeholder="09:00 - 10:30" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-type" requiredIndicator>
              Session type
            </Label>
            <Input id="session-type" placeholder="Therapy session" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes for patient
            </Label>
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80"
              placeholder="Share focus or preparation tips."
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost">
              Reset
            </Button>
            <Button type="submit" variant="secondary">
              Publish slot
            </Button>
          </div>
        </form>
        <ScheduleList heading="Published slots" items={doctorSchedule} />
      </div>
    </DashboardShell>
  );
}


