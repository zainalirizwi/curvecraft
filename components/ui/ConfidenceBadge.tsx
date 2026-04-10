"use client";

import type { ConfidenceLabel } from "@/types";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  label: ConfidenceLabel;
  score?: number;
  className?: string;
}

const CONFIG: Record<ConfidenceLabel, { color: string; dot: string }> = {
  High:   { color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60", dot: "bg-emerald-500" },
  Medium: { color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60",     dot: "bg-amber-500" },
  Low:    { color: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60",                 dot: "bg-red-500" },
};

export function ConfidenceBadge({ label, score, className }: ConfidenceBadgeProps) {
  const cfg = CONFIG[label];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        cfg.color,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {label} Confidence{score !== undefined ? ` (${score}%)` : ""}
    </span>
  );
}
