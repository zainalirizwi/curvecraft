"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 py-12 px-6",
        className
      )}
    >
      {icon && (
        <div className="text-neutral-300 dark:text-neutral-700 mb-1">{icon}</div>
      )}
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
      {description && (
        <p className="text-xs text-neutral-400 dark:text-neutral-600 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
