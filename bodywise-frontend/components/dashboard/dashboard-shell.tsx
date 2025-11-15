 "use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  RiDashboard3Line,
  RiTeamLine,
  RiStackLine,
  RiBuildingLine,
  RiFileTextLine,
  RiUserHeartLine,
  RiCalendarScheduleLine,
  RiChatSmile3Line,
  RiHeartsLine,
  RiBookOpenLine,
} from "react-icons/ri";
import type { NavItem } from "@/lib/navigation";

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  navItems?: NavItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: RiDashboard3Line,
  team: RiTeamLine,
  performance: RiStackLine,
  institution: RiBuildingLine,
  docs: RiFileTextLine,
  doctor: RiUserHeartLine,
  schedule: RiCalendarScheduleLine,
  chat: RiChatSmile3Line,
  community: RiHeartsLine,
  learn: RiBookOpenLine,
};

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
  breadcrumbs,
  navItems,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5ebe3]">
      <div className="mx-auto flex min-h-screen w-full gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {navItems && navItems.length ? (
          <aside className="hidden w-full max-w-[240px] rounded-3xl border border-[#e6d8ce] bg-white/80 p-6 shadow-[0_30px_90px_-65px_rgba(58,34,24,0.4)] lg:block">
            <div className="mb-6">
              <Link
                href="/"
                className="flex items-center gap-3 text-sm font-semibold text-[#3a2218]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0d5b8] text-xs font-bold uppercase text-[#3a2218]">
                  BW
                </span>
                BodyWise Africa
              </Link>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon ? iconMap[item.icon] : null;
                const matchType = item.match ?? "startswith";
                const isActive =
                  matchType === "exact"
                    ? pathname === item.href
                    : pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      isActive
                        ? "bg-[#523329] text-white shadow-[0_20px_60px_-45px_rgba(58,34,24,0.55)]"
                        : "text-[#6a4a3a] hover:bg-[#f9f0e6]",
                    )}
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-10 pt-4 border-t border-[#f1e3d9]">
              <button className="flex w-full items-center justify-center rounded-full bg-[#f0d5b8]/80 px-4 py-3 text-sm font-semibold text-[#6a4a3a] transition hover:bg-[#e6c8ab]">
                Logout
              </button>
            </div>
          </aside>
        ) : null}
        <div className="flex-1">
          <header className="mb-8 flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-[#fdf9f6] via-[#f5ece4] to-[#fdf9f6] px-5 py-6 shadow-[0_35px_80px_-60px_rgba(58,34,24,0.35)] sm:gap-4 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                {breadcrumbs && breadcrumbs.length ? (
                  <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#a1897c]">
                    {breadcrumbs.map((crumb, index) => (
                      <span key={crumb.label} className="flex items-center gap-2">
                        {crumb.href ? (
                          <Link
                            href={crumb.href}
                            className="transition hover:text-[#6a4a3a]"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-[#6a4a3a]">{crumb.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 ? (
                          <span className="text-[#d6b28f]">/</span>
                        ) : null}
                      </span>
                    ))}
                  </nav>
                ) : null}
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-[#3a2218] sm:text-3xl">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="text-sm text-[#80685b]">{subtitle}</p>
                  ) : null}
                </div>
              </div>
              {actions ? (
                <div className="flex flex-wrap items-center gap-3">{actions}</div>
              ) : null}
            </div>
            {navItems && navItems.length ? (
              <div className="-mx-1 -mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {navItems.map((item) => {
                  const Icon = item.icon ? iconMap[item.icon] : null;
                  const matchType = item.match ?? "startswith";
                  const isActive =
                    matchType === "exact"
                      ? pathname === item.href
                      : pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex min-w-max items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition",
                        isActive
                          ? "bg-[#523329] text-white shadow-[0_20px_60px_-45px_rgba(58,34,24,0.55)]"
                          : "bg-white/60 text-[#6a4a3a] hover:bg-white",
                      )}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </header>
          <main className={cn("space-y-8 pb-16")}>{children}</main>
        </div>
      </div>
    </div>
  );
}


