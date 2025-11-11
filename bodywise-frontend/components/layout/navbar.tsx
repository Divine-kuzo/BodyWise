import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-6 z-50 flex justify-center px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 rounded-full border border-[#e6d8ce]/70 bg-gradient-to-r from-[#fdf9f6]/65 via-[#f5ece4]/90 to-[#fdf9f6]/65 px-8 py-4 text-sm text-[#3a2218] shadow-[0_40px_90px_-70px_rgba(38,23,17,0.3)] backdrop-blur-2xl">
        <Link
          href="#hero"
          className="flex items-center gap-3 text-base font-semibold tracking-tight"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0d5b8] text-sm font-bold uppercase text-[#3a2218]">
            BW
          </span>
          BodyWise Africa
        </Link>
        <div className="flex items-center gap-3 lg:hidden">
          <Link href="#cta" className="text-sm font-semibold text-[#6a4a3a]">
            Menu
          </Link>
        </div>
        <nav className="hidden items-center gap-8 text-[#80685b] lg:flex">
          {NAV_LINKS.filter((link) => link.label !== "Login").map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[#3a2218]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={NAV_LINKS.find((link) => link.label === "Login")?.href ?? "#"}
            className="rounded-full px-5 py-2 text-sm font-semibold text-[#6a4a3a] transition hover:text-[#3a2218]"
          >
            Login
          </Link>
          <Link href="#cta" className={buttonVariants({ variant: "secondary" })}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}


