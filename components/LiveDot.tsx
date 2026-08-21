"use client";

import { cn } from "@/lib/utils";

interface LiveDotProps {
  color?: "live" | "primary";
  size?: "sm" | "md";
  className?: string;
}

export function LiveDot({ color = "live", size = "md", className, active }: LiveDotProps & { active?: boolean }) {
  const sizeClass = size === "sm" ? "size-1.5" : "size-2";
  const colorClass =
    active === false ? "bg-muted-foreground" : color === "live" ? "bg-green-500" : "bg-brand-500";

  return (
    <span className={cn("relative inline-flex shrink-0", sizeClass, className)}>
      <span
        className={cn(
          "absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
          colorClass
        )}
      />
      <span
        className={cn("relative inline-flex rounded-full", sizeClass, colorClass)}
      />
    </span>
  );
}

export default LiveDot;
