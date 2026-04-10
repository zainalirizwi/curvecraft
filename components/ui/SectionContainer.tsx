"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SectionContainer({
  title,
  description,
  children,
  actions,
  className,
}: SectionContainerProps) {
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="section-title">{title}</h2>
          {description && (
            <p className="section-desc mt-0.5">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
