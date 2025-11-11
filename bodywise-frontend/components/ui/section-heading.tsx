import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "text-center max-w-3xl mx-auto",
        align === "left" && "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-block rounded-full bg-[#e9dfd5] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6a4a3a]">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-[#3a2218] sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="text-base text-[#80685b] sm:text-lg">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}


