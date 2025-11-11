import { AuthShell } from "@/components/layout/auth-shell";
import { RoleCard } from "@/components/auth/role-card";
import { JOIN_ROLES } from "@/lib/data";
import {
  PiUserCircleDuotone,
  PiBuildingsDuotone,
} from "react-icons/pi";

export const metadata = {
  title: "Join BodyWise | BodyWise Africa",
};

const iconMap = {
  user: <PiUserCircleDuotone className="h-7 w-7" aria-hidden="true" />,
  institution: <PiBuildingsDuotone className="h-7 w-7" aria-hidden="true" />,
} as const;

export default function JoinPage() {
  return (
    <AuthShell
      title="Choose how you want to join"
      subtitle="BodyWise supports both individual journeys and institutions dedicated to creating safer wellness spaces."
      description="Select the path that aligns with your needs to unlock tailored experiences and resources."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {JOIN_ROLES.map((role) => (
          <RoleCard
            key={role.key}
            title={role.title}
            description={role.description}
            perks={role.perks}
            href={role.href}
            cta={role.cta}
            icon={iconMap[role.key as keyof typeof iconMap]}
          />
        ))}
      </div>
    </AuthShell>
  );
}


