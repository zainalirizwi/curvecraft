"use client";

import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingPanel } from "@/components/ui/OnboardingPanel";
import { ExactCalculator } from "@/components/calculator/ExactCalculator";

interface UniversityConfig {
  scaleId: string;
  fullName: string;
  shortName: string;
}

interface Props {
  scaleId: string;
  university: UniversityConfig;
}

export function UniversityLandingClient({ scaleId, university }: Props) {
  const { dispatch } = useApp();

  // On mount: auto-select the university's grading scale and go to calculator
  useEffect(() => {
    dispatch({ type: "SET_SELECTED_SCALE", payload: scaleId });
    dispatch({ type: "SET_ACTIVE_SECTION", payload: "calculator" });
  }, [dispatch, scaleId]);

  return (
    <AppShell>
      {/* University context banner */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/40 dark:bg-indigo-950/20 px-4 py-3 flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
        <p className="text-sm text-indigo-800 dark:text-indigo-200">
          <span className="font-semibold">{university.shortName}</span> grading scale
          pre-selected.{" "}
          <span className="text-indigo-600/80 dark:text-indigo-300/80 text-xs">
            ({university.fullName})
          </span>
        </p>
      </div>

      <OnboardingPanel />
      <ExactCalculator />
    </AppShell>
  );
}
