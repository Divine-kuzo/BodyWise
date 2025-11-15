import Link from "next/link";
import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const insights = [
  { heading: "50K+", text: "African youth empowered with personalized wellness journeys." },
  { heading: "200+", text: "Verified wellness professionals ready to support you." },
  { heading: "98%", text: "Community satisfaction from culturally-relevant care." },
];

export function AuthShell({
  title,
  subtitle,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#f5ebe3]">
      <div className="mx-auto flex min-h-screen w-full flex-col justify-center px-3 py-14 sm:px-4 lg:px-10">
        <div className="grid gap-8 rounded-[36px] bg-white/70 p-5 shadow-[0_45px_120px_-60px_rgba(58,34,24,0.35)] backdrop-blur-xl md:grid-cols-[1.15fr_0.85fr] md:p-8 lg:gap-10 lg:p-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5c3b2f] via-[#523329] to-[#3b2218] p-10 text-white">
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d6b28f]/20 blur-[120px]" />
            <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-[#f0d5b8]/10 blur-[140px]" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="space-y-7">
                <Link
                  href="/"
                  className="inline-flex w-max items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold tracking-wide text-white/80 transition hover:bg-white/25"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold uppercase text-white">
                    BW
                  </span>
                  BodyWise Africa
                </Link>
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                    Transform the body confidence journey for African youth.
                  </h2>
                  <p className="text-sm text-white/75 sm:text-base">
                    Access AI-powered assessments, mental health experts, and
                    culturally rooted education built for Africa&apos;s next generation.
                  </p>
                </div>
              </div>
              <div className="space-y-6 rounded-2xl bg-white/10 p-6 backdrop-blur">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f0d5b8]">
                  Why join BodyWise?
                </h3>
                <div className="space-y-4">
                  {insights.map((item) => (
                    <div key={item.heading} className="space-y-1">
                      <p className="text-xl font-semibold text-white">
                        {item.heading}
                      </p>
                      <p className="text-sm text-white/70">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white px-6 py-8 shadow-[0_35px_90px_-70px_rgba(58,34,24,0.45)] sm:px-10 sm:py-12">
            <div className="space-y-5">
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[#3a2218] sm:text-3xl">
                  {title}
                </h1>
                <p className="text-sm text-[#80685b] sm:text-base">
                  {subtitle}
                </p>
                {description ? (
                  <p className="text-sm text-[#a1897c]">{description}</p>
                ) : null}
              </div>
              <div className="space-y-6">{children}</div>
              {footer ? <div className="pt-4 text-sm text-[#6a4a3a]">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


