import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  title: string;
  description: string;
  perks: ReadonlyArray<string>;
  href: string;
  cta: string;
  icon: ReactNode;
}

export function RoleCard({
  title,
  description,
  perks,
  href,
  cta,
  icon,
}: RoleCardProps) {
  return (
    <div className="flex h-full flex-col gap-6 rounded-3xl border border-[#e6d8ce] bg-white/80 p-6 shadow-[0_30px_80px_-70px_rgba(58,34,24,0.45)] transition hover:-translate-y-1 hover:shadow-[0_40px_90px_-60px_rgba(58,34,24,0.4)]">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0d5b8]/80 text-[#6a4a3a]">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#3a2218]">{title}</h3>
        <p className="text-sm text-[#80685b]">{description}</p>
      </div>
      <ul className="space-y-3 text-sm text-[#6a4a3a]">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex items-start gap-2 rounded-2xl bg-[#f9f0e6] px-3 py-2"
          >
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#a5775a]" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link
          href={href}
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-[#523329] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_-45px_rgba(58,34,24,0.65)] transition hover:bg-[#684233]",
          )}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}


