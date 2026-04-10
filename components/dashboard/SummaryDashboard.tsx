"use client";

import { useApp } from "@/contexts/AppContext";
import { resolveScale } from "@/lib/grading";
import { computeSemesterResult } from "@/lib/calculator";
import { predictSemester } from "@/lib/predictor";
import { formatGPA, cn } from "@/lib/utils";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionContainer } from "@/components/ui/SectionContainer";

function RangeBar({
  pessimistic,
  likely,
  optimistic,
  max = 4,
}: {
  pessimistic: number;
  likely: number;
  optimistic: number;
  max?: number;
}) {
  const p = Math.min((pessimistic / max) * 100, 100);
  const l = Math.min((likely / max) * 100, 100);
  const o = Math.min((optimistic / max) * 100, 100);

  return (
    <div className="relative h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-visible mt-2 mb-1">
      {/* Range fill */}
      <div
        className="absolute top-0 h-2 rounded-full bg-gradient-to-r from-red-300 via-indigo-400 to-emerald-300 dark:from-red-700 dark:via-indigo-500 dark:to-emerald-600 opacity-40"
        style={{ left: `${p}%`, width: `${o - p}%` }}
      />
      {/* Pessimistic dot */}
      <span
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900 shadow"
        style={{ left: `${p}%`, transform: "translate(-50%, -50%)" }}
        aria-label={`Pessimistic: ${formatGPA(pessimistic)}`}
      />
      {/* Likely dot */}
      <span
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-neutral-900 shadow-md"
        style={{ left: `${l}%`, transform: "translate(-50%, -50%)" }}
        aria-label={`Likely: ${formatGPA(likely)}`}
      />
      {/* Optimistic dot */}
      <span
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 shadow"
        style={{ left: `${o}%`, transform: "translate(-50%, -50%)" }}
        aria-label={`Optimistic: ${formatGPA(optimistic)}`}
      />
    </div>
  );
}

function RangeRow({
  label,
  pessimistic,
  likely,
  optimistic,
  max,
}: {
  label: string;
  pessimistic: number;
  likely: number;
  optimistic: number;
  max?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{label}</span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-red-600 dark:text-red-400">{formatGPA(pessimistic)}</span>
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">{formatGPA(likely)}</span>
          <span className="text-emerald-600 dark:text-emerald-400">{formatGPA(optimistic)}</span>
        </div>
      </div>
      <RangeBar pessimistic={pessimistic} likely={likely} optimistic={optimistic} max={max} />
      <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
        <span>Pessimistic</span>
        <span>Likely</span>
        <span>Optimistic</span>
      </div>
    </div>
  );
}

export function SummaryDashboard() {
  const { state, navigate } = useApp();
  const scale = resolveScale(state.selectedScaleId, state.customScales);

  const exactResult =
    state.subjects.length > 0
      ? computeSemesterResult(
          state.previousCGPA,
          state.previousEarnedCH,
          state.subjects
        )
      : null;

  const prediction =
    scale && state.predictorSubjects.length > 0
      ? predictSemester(
          state.predictorSubjects,
          scale,
          state.previousCGPA,
          state.previousEarnedCH
        )
      : null;

  const hasAnyData =
    exactResult !== null ||
    prediction !== null ||
    state.previousCGPA > 0;

  return (
    <SectionContainer
      title="Summary Dashboard"
      description="Your complete academic picture at a glance."
    >
      {/* Context banner */}
      <div className="card p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Active scale: <strong className="text-neutral-800 dark:text-neutral-200">{scale?.name ?? "None"}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-400" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Previous CGPA:{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">
              {state.previousCGPA > 0 ? formatGPA(state.previousCGPA) : "—"}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-400" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Earned CH:{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">
              {state.previousEarnedCH > 0 ? state.previousEarnedCH : "—"}
            </strong>
          </span>
        </div>
      </div>

      {!hasAnyData && (
        <div className="card p-8 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-1">Nothing to show yet.</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            Start by entering your data in the{" "}
            <button
              onClick={() => navigate("calculator")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Exact Calculator
            </button>
            {" "}or{" "}
            <button
              onClick={() => navigate("predictor")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Grade Predictor
            </button>
            .
          </p>
        </div>
      )}

      {/* Exact results */}
      {exactResult && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Exact Calculation
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Semester GPA"
              value={formatGPA(exactResult.semesterGPA)}
              sub={`${state.subjects.length} subject${state.subjects.length !== 1 ? "s" : ""}`}
              accent
            />
            <MetricCard
              label="Updated CGPA"
              value={formatGPA(exactResult.updatedCGPA)}
              accent
            />
            <MetricCard
              label="Current Semester CH"
              value={String(exactResult.totalCH)}
            />
            <MetricCard
              label="Total Earned CH"
              value={String(state.previousEarnedCH + exactResult.totalCH)}
              sub="After this semester"
            />
          </div>
        </div>
      )}

      {/* Prediction range */}
      {prediction && (
        <div className="card p-4 sm:p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Predicted Outcomes (Grade Predictor)
          </p>

          <div className="flex flex-col gap-5">
            <RangeRow
              label="Semester GPA"
              pessimistic={prediction.pessimisticGPA}
              likely={prediction.likelyGPA}
              optimistic={prediction.optimisticGPA}
            />
            <RangeRow
              label="Cumulative CGPA"
              pessimistic={prediction.pessimisticCGPA}
              likely={prediction.likelyCGPA}
              optimistic={prediction.optimisticCGPA}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-1 border-t border-neutral-200 dark:border-neutral-800">
            {[
              { color: "bg-red-500",     label: "Pessimistic" },
              { color: "bg-indigo-600",  label: "Likely" },
              { color: "bg-emerald-500", label: "Optimistic" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span className={cn("w-2 h-2 rounded-full", color)} />
                {label}
              </div>
            ))}
          </div>

          {/* Subject confidence summary */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
              Prediction Confidence by Subject
            </p>
            {prediction.subjectPredictions.map((p, i) => (
              <div key={p.subjectId} className="flex items-center gap-3">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 w-32 truncate flex-shrink-0">
                  {state.predictorSubjects[i]?.name || `Subject ${i + 1}`}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      p.confidenceLabel === "High"   && "bg-emerald-500",
                      p.confidenceLabel === "Medium"  && "bg-amber-500",
                      p.confidenceLabel === "Low"     && "bg-red-500"
                    )}
                    style={{ width: `${p.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-500 w-16 text-right">
                  {p.confidenceLabel} ({p.confidence}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What-if summary */}
      {state.scenarios.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            What-If Scenarios
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.scenarios.map((sc) => {
              const pairs = sc.subjects.map((s) => ({
                creditHours: s.creditHours,
                gradePoints: s.gradePoints,
              }));
              const gpa = computeSemesterResult(
                state.previousCGPA,
                state.previousEarnedCH,
                sc.subjects.map((s) => ({
                  id: s.id,
                  name: s.name,
                  creditHours: s.creditHours,
                  grade: s.grade,
                  gradePoints: s.gradePoints,
                }))
              );
              return (
                <MetricCard
                  key={sc.id}
                  label={sc.name}
                  value={formatGPA(gpa.semesterGPA)}
                  sub={`CGPA: ${formatGPA(gpa.updatedCGPA)}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
