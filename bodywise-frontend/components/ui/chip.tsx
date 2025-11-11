"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ active = false, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-[#6a4a3a] text-white shadow-[0_15px_40px_-20px_rgba(58,34,24,0.8)]"
          : "bg-[#e9dfd5] text-[#6a4a3a] hover:bg-[#d9c7ba]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Chip.displayName = "Chip";


