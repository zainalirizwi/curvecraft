"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | ReactNode;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function MetricCard({ label, value, sub, accent, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "card p-4 sm:p-5 flex flex-col gap-1",
        accent && "border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20",
        className
      )}
    >
      <p className="metric-label">{label}</p>
      <p className={cn("metric-value", accent && "text-indigo-700 dark:text-indigo-300")}>
        {value}
      </p>
      {sub && <p className="text-xs text-neutral-400 dark:text-neutral-500">{sub}</p>}
    </div>
  );
}
