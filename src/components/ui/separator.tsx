import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => (
  <div
    role="separator"
    className={cn(
      "bg-[var(--app-border)]",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
    {...props}
  />
);
