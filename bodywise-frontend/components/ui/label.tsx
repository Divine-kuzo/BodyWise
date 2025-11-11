import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
}

export function Label({
  className,
  children,
  requiredIndicator,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-semibold text-[#4b3125] tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
      {requiredIndicator ? (
        <span className="ml-1 text-[#a15445]">*</span>
      ) : null}
    </label>
  );
}


