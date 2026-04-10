"use client";

import { X, CheckCircle2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function OnboardingPanel() {
  const { state, dispatch, navigate } = useApp();

  if (state.onboardingDismissed) return null;

  const steps = [
    {
      label: "Choose a grading scale",
      desc: "Pick from presets or build your own in the Grading Scale section.",
      action: () => navigate("grading"),
    },
    {
      label: "Enter your previous CGPA & earned credit hours",
      desc: "Found in the Exact Calculator section at the top.",
    },
    {
      label: "Add your current subjects",
      desc: "Use the Exact Calculator if grades are known, or the Predictor if results aren't out yet.",
    },
    {
      label: "Simulate outcomes",
      desc: "Use What-If Simulator to compare best, realistic, and worst scenarios.",
      action: () => navigate("simulator"),
    },
  ];

  return (
    <div className="card p-4 sm:p-5 border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/30 dark:bg-indigo-950/20 animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
            Welcome to GradeForge
          </p>
          <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70 mt-0.5">
            Here&apos;s how to get started in four steps.
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: "DISMISS_ONBOARDING" })}
          className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 flex-shrink-0 transition-colors"
          aria-label="Dismiss onboarding"
        >
          <X size={16} />
        </button>
      </div>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {step.label}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{step.desc}</p>
              {step.action && (
                <button
                  onClick={step.action}
                  className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Go there →
                </button>
              )}
            </div>
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-indigo-300 dark:text-indigo-700" />
          </li>
        ))}
      </ol>

      <button
        onClick={() => dispatch({ type: "DISMISS_ONBOARDING" })}
        className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Dismiss — I know how this works
      </button>
    </div>
  );
}
