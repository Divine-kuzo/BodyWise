import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f0d5b8] focus-visible:ring-offset-[#f9f5f2]";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#f9f5f2] text-[#3a2218] shadow-[0_18px_45px_-20px_rgba(58,34,24,0.8)] hover:scale-[1.02]",
  secondary:
    "bg-[#523329] text-white hover:bg-[#684132] shadow-[0_15px_35px_-18px_rgba(104,65,50,0.9)] hover:scale-[1.02]",
  ghost:
    "bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/10",
};

export const buttonVariants = ({ variant = "primary" }: { variant?: Variant }) =>
  cn(baseStyles, variantStyles[variant]);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";


