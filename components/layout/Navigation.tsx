"use client";

import {
  Calculator,
  Settings2,
  TrendingUp,
  GitCompare,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { Section } from "@/types";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{ id: Section; label: string; icon: typeof Calculator; shortLabel: string }> = [
  { id: "calculator",  label: "Exact Calculator",   shortLabel: "Calc",      icon: Calculator },
  { id: "grading",     label: "Grading Scales",     shortLabel: "Scales",    icon: Settings2 },
  { id: "predictor",   label: "Grade Predictor",    shortLabel: "Predict",   icon: TrendingUp },
  { id: "simulator",   label: "What-If Simulator",  shortLabel: "Simulate",  icon: GitCompare },
  { id: "dashboard",   label: "Summary Dashboard",  shortLabel: "Summary",   icon: LayoutDashboard },
  { id: "explanation", label: "How It Works",       shortLabel: "Help",      icon: HelpCircle },
];

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

export function DesktopNav() {
  const { state, navigate } = useApp();

  return (
    <nav
      className="hidden lg:flex flex-col gap-1 w-56 flex-shrink-0"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className={cn(
            "nav-link text-left w-full",
            state.activeSection === id && "nav-link-active"
          )}
          aria-current={state.activeSection === id ? "page" : undefined}
        >
          <Icon size={17} className="flex-shrink-0" />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

export function MobileNav() {
  const { state, navigate } = useApp();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 safe-bottom
                 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md
                 border-t border-neutral-200 dark:border-neutral-800
                 flex items-stretch"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ id, shortLabel, icon: Icon }) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]",
            "text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
            "transition-colors duration-150",
            state.activeSection === id &&
              "text-indigo-600 dark:text-indigo-400"
          )}
          aria-current={state.activeSection === id ? "page" : undefined}
          aria-label={shortLabel}
        >
          <Icon
            size={20}
            className={cn(
              "transition-transform duration-150",
              state.activeSection === id && "scale-110"
            )}
          />
          <span className="text-[10px] font-medium leading-none">{shortLabel}</span>
        </button>
      ))}
    </nav>
  );
}
