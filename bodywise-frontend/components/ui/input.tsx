import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <input
          type={type}
          className={cn(
            "w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] transition focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[#a15445]">{error}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";


