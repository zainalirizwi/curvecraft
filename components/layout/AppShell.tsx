"use client";

import type { ReactNode } from "react";
import { DesktopNav, MobileNav } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useApp } from "@/contexts/AppContext";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* ─── Top Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2.5 min-w-0 flex-shrink-0 group"
            aria-label="CurveCraft — Go to summary dashboard"
          >
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400 transition-colors">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-4 h-4 text-white"
                aria-hidden="true"
              >
                <path
                  d="M3 14 C5 10, 8 6, 10 8 C12 10, 14 4, 17 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                CurveCraft
              </span>
              <span className="hidden sm:inline text-xs text-neutral-400 dark:text-neutral-600 ml-1.5">
                by Zain Ali Rizvi
              </span>
            </div>
          </button>

          {/* Right slot */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── Main Layout ─────────────────────────────────────────────── */}
      <div className="flex-1 flex max-w-screen-xl mx-auto w-full px-4 sm:px-6 gap-8 py-6 pb-24 lg:pb-8">
        {/* Sidebar (desktop only) */}
        <DesktopNav />

        {/* Page content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6" id="main-content">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
