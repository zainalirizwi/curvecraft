"use client";

import { useApp } from "@/contexts/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingPanel } from "@/components/ui/OnboardingPanel";
import { ExactCalculator } from "@/components/calculator/ExactCalculator";
import { GradingScaleManager } from "@/components/grading/GradingScaleManager";
import { RelativeGradePredictor } from "@/components/predictor/RelativeGradePredictor";
import { WhatIfSimulator } from "@/components/simulator/WhatIfSimulator";
import { SummaryDashboard } from "@/components/dashboard/SummaryDashboard";
import { ExplanationPanel } from "@/components/explanation/ExplanationPanel";

function ActiveSection() {
  const { state } = useApp();

  switch (state.activeSection) {
    case "calculator":
      return (
        <>
          <OnboardingPanel />
          <ExactCalculator />
        </>
      );
    case "grading":
      return <GradingScaleManager />;
    case "predictor":
      return <RelativeGradePredictor />;
    case "simulator":
      return <WhatIfSimulator />;
    case "dashboard":
      return <SummaryDashboard />;
    case "explanation":
      return <ExplanationPanel />;
    default:
      return <ExactCalculator />;
  }
}

export default function Home() {
  return (
    <AppShell>
      <ActiveSection />
    </AppShell>
  );
}
