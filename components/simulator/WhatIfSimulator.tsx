"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GitCompare, Copy } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { resolveScale, sortGradesByDescending } from "@/lib/grading";
import { computeGPAFromPairs, computeCGPAFromPairs } from "@/lib/calculator";
import { generateId, formatGPA, cn } from "@/lib/utils";
import type { Scenario, ScenarioSubject, GradingScale } from "@/types";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionContainer } from "@/components/ui/SectionContainer";

// ─── Scenario Subject Editor ──────────────────────────────────────────────────

function ScenarioSubjectRow({
  subject,
  scale,
  onChange,
  onRemove,
}: {
  subject: ScenarioSubject;
  scale: GradingScale;
  onChange: (s: ScenarioSubject) => void;
  onRemove: () => void;
}) {
  const grades = sortGradesByDescending(scale.grades);

  return (
    <div className="flex items-center gap-2 py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 group">
      <input
        className="input-field flex-1 min-w-0 text-sm"
        placeholder="Subject name"
        value={subject.name}
        onChange={(e) => onChange({ ...subject, name: e.target.value })}
      />
      <input
        className="input-field w-14 text-sm"
        type="number"
        min={0}
        max={12}
        placeholder="CH"
        value={subject.creditHours || ""}
        onChange={(e) => onChange({ ...subject, creditHours: parseFloat(e.target.value) || 0 })}
        aria-label="Credit hours"
      />
      <div className="relative w-24 flex-shrink-0">
        <select
          className="select-field pr-7 text-sm"
          value={subject.grade}
          onChange={(e) => {
            const row = scale.grades.find((g) => g.grade === e.target.value);
            onChange({ ...subject, grade: e.target.value, gradePoints: row?.points ?? 0 });
          }}
          aria-label="Grade"
        >
          <option value="">Grade</option>
          {grades.map((g) => (
            <option key={g.id} value={g.grade}>{g.grade}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg viewBox="0 0 12 8" fill="none" className="w-2.5 h-1.5">
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <span className="text-xs text-neutral-400 w-10 text-right flex-shrink-0 font-medium">
        {subject.grade ? subject.gradePoints.toFixed(2) : "—"}
      </span>
      <button
        onClick={onRemove}
        className="btn-danger sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        aria-label="Remove subject"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ─── Scenario Card ────────────────────────────────────────────────────────────

function ScenarioCard({
  scenario,
  scale,
  isBaseline,
  baselineGPA,
  baselineCGPA,
  previousCGPA,
  previousEarnedCH,
  onUpdate,
  onRemove,
  onDuplicate,
}: {
  scenario: Scenario;
  scale: GradingScale;
  isBaseline: boolean;
  baselineGPA?: number;
  baselineCGPA?: number;
  previousCGPA: number;
  previousEarnedCH: number;
  onUpdate: (s: Scenario) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const pairs = scenario.subjects.map((s) => ({
    creditHours: s.creditHours,
    gradePoints: s.gradePoints,
  }));
  const gpa  = computeGPAFromPairs(pairs);
  const cgpa = computeCGPAFromPairs(previousCGPA, previousEarnedCH, pairs);

  const gpaΔ  = baselineGPA  !== undefined ? gpa  - baselineGPA  : null;
  const cgpaΔ = baselineCGPA !== undefined ? cgpa - baselineCGPA : null;

  function addSubject() {
    const defaultGrade = scale.grades[0];
    const newSub: ScenarioSubject = {
      id: generateId(),
      name: "",
      creditHours: 3,
      grade: defaultGrade?.grade ?? "",
      gradePoints: defaultGrade?.points ?? 0,
    };
    onUpdate({ ...scenario, subjects: [...scenario.subjects, newSub] });
  }

  function updateSubject(updated: ScenarioSubject) {
    onUpdate({
      ...scenario,
      subjects: scenario.subjects.map((s) => (s.id === updated.id ? updated : s)),
      semesterGPA: gpa,
      updatedCGPA: cgpa,
    });
  }

  function removeSubject(id: string) {
    onUpdate({
      ...scenario,
      subjects: scenario.subjects.filter((s) => s.id !== id),
    });
  }

  function formatDelta(delta: number | null) {
    if (delta === null) return null;
    const sign = delta >= 0 ? "+" : "";
    return (
      <span
        className={cn(
          "text-xs font-medium",
          delta > 0  && "text-emerald-600 dark:text-emerald-400",
          delta < 0  && "text-red-600 dark:text-red-400",
          delta === 0 && "text-neutral-400"
        )}
      >
        {sign}{delta.toFixed(2)}
      </span>
    );
  }

  return (
    <div className={cn("card flex flex-col overflow-hidden", isBaseline && "border-indigo-200 dark:border-indigo-800/60")}>
      {/* Header */}
      <div className={cn(
        "px-4 py-3 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800",
        isBaseline && "bg-indigo-50/50 dark:bg-indigo-950/20"
      )}>
        {isBaseline && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">
            Baseline
          </span>
        )}
        <input
          className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none placeholder-neutral-400"
          value={scenario.name}
          onChange={(e) => onUpdate({ ...scenario, name: e.target.value })}
          placeholder="Scenario name"
          aria-label="Scenario name"
        />
        <div className="flex items-center gap-1">
          <button onClick={onDuplicate} className="btn-ghost" aria-label="Duplicate scenario">
            <Copy size={13} />
          </button>
          {!isBaseline && (
            <button onClick={onRemove} className="btn-danger" aria-label="Remove scenario">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
        <div className="bg-white dark:bg-neutral-900 px-4 py-3">
          <p className="metric-label mb-1">Semester GPA</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{formatGPA(gpa)}</p>
            {!isBaseline && formatDelta(gpaΔ)}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 px-4 py-3">
          <p className="metric-label mb-1">Updated CGPA</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{formatGPA(cgpa)}</p>
            {!isBaseline && formatDelta(cgpaΔ)}
          </div>
        </div>
      </div>

      {/* Subject list */}
      <div className="px-4 py-3 flex flex-col">
        {/* Column header hint */}
        <div className="flex items-center gap-2 mb-1 text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
          <span className="flex-1">Subject</span>
          <span className="w-14">CH</span>
          <span className="w-24">Grade</span>
          <span className="w-10 text-right">Pts</span>
          <span className="w-6" />
        </div>
        {scenario.subjects.map((sub) => (
          <ScenarioSubjectRow
            key={sub.id}
            subject={sub}
            scale={scale}
            onChange={updateSubject}
            onRemove={() => removeSubject(sub.id)}
          />
        ))}
        {scenario.subjects.length === 0 && (
          <p className="text-xs text-neutral-400 py-3 text-center">
            No subjects — add some below.
          </p>
        )}
      </div>

      <div className="px-4 pb-3">
        <button onClick={addSubject} className="btn-ghost text-xs">
          <Plus size={13} /> Add Subject
        </button>
      </div>

      {/* Notes */}
      <div className="px-4 pb-4">
        <input
          className="input-field text-xs"
          placeholder="Notes (optional)"
          value={scenario.notes}
          onChange={(e) => onUpdate({ ...scenario, notes: e.target.value })}
          aria-label="Scenario notes"
        />
      </div>
    </div>
  );
}

// ─── What-If Simulator ────────────────────────────────────────────────────────

export function WhatIfSimulator() {
  const { state, dispatch } = useApp();
  const scale = resolveScale(state.selectedScaleId, state.customScales);

  // Seed from exact calculator subjects if scenarios are empty
  useEffect(() => {
    if (state.scenarios.length === 0 && state.subjects.length > 0 && scale) {
      const baseline: Scenario = {
        id: generateId(),
        name: "Baseline (Current Grades)",
        notes: "",
        subjects: state.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          creditHours: s.creditHours,
          grade: s.grade,
          gradePoints: s.gradePoints,
        })),
        semesterGPA: 0,
        updatedCGPA: 0,
      };
      dispatch({ type: "ADD_SCENARIO", payload: baseline });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addScenario() {
    const defaultGrade = scale?.grades[0];
    const newScenario: Scenario = {
      id: generateId(),
      name: `Scenario ${state.scenarios.length + 1}`,
      notes: "",
      subjects: state.subjects.map((s) => ({
        id: generateId(),
        name: s.name,
        creditHours: s.creditHours,
        grade: defaultGrade?.grade ?? s.grade,
        gradePoints: defaultGrade?.points ?? s.gradePoints,
      })),
      semesterGPA: 0,
      updatedCGPA: 0,
    };
    dispatch({ type: "ADD_SCENARIO", payload: newScenario });
  }

  function addBlankScenario() {
    const newScenario: Scenario = {
      id: generateId(),
      name: `Scenario ${state.scenarios.length + 1}`,
      notes: "",
      subjects: [],
      semesterGPA: 0,
      updatedCGPA: 0,
    };
    dispatch({ type: "ADD_SCENARIO", payload: newScenario });
  }

  function duplicateScenario(id: string) {
    const original = state.scenarios.find((s) => s.id === id);
    if (!original) return;
    dispatch({
      type: "ADD_SCENARIO",
      payload: {
        ...structuredClone(original),
        id: generateId(),
        name: `${original.name} (copy)`,
      },
    });
  }

  if (!scale) {
    return (
      <SectionContainer title="What-If Simulator" description="Configure a grading scale first.">
        <div className="card">
          <EmptyState
            title="No grading scale configured"
            description="Head to Grading Scales to set up or select a scale."
          />
        </div>
      </SectionContainer>
    );
  }

  const baseline = state.scenarios[0];
  const baselinePairs = baseline?.subjects.map((s) => ({
    creditHours: s.creditHours,
    gradePoints: s.gradePoints,
  })) ?? [];
  const baselineGPA  = computeGPAFromPairs(baselinePairs);
  const baselineCGPA = computeCGPAFromPairs(
    state.previousCGPA, state.previousEarnedCH, baselinePairs
  );

  return (
    <SectionContainer
      title="What-If Simulator"
      description="Simulate different semester outcomes and compare them side by side."
      actions={
        <div className="flex gap-2">
          <button onClick={addBlankScenario} className="btn-secondary">
            <Plus size={14} /> Blank
          </button>
          <button onClick={addScenario} className="btn-primary">
            <Plus size={14} /> From Subjects
          </button>
        </div>
      }
    >
      {state.scenarios.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<GitCompare size={36} />}
            title="No scenarios yet"
            description="Create a scenario to simulate what your GPA would look like under different grade outcomes."
            action={
              <div className="flex gap-2">
                <button onClick={addBlankScenario} className="btn-secondary">Blank Scenario</button>
                <button onClick={addScenario} className="btn-primary">From My Subjects</button>
              </div>
            }
          />
        </div>
      ) : (
        <>
          {/* Summary comparison bar — shown when ≥2 scenarios */}
          {state.scenarios.length >= 2 && (
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500 mb-3">
                Scenario Comparison
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-500">Scenario</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-neutral-500">Sem GPA</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-neutral-500">CGPA</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-neutral-500">GPA Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.scenarios.map((sc, i) => {
                      const pairs = sc.subjects.map((s) => ({
                        creditHours: s.creditHours,
                        gradePoints: s.gradePoints,
                      }));
                      const gpa  = computeGPAFromPairs(pairs);
                      const cgpa = computeCGPAFromPairs(
                        state.previousCGPA, state.previousEarnedCH, pairs
                      );
                      const gpaΔ = i === 0 ? null : gpa - baselineGPA;
                      return (
                        <tr
                          key={sc.id}
                          className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0"
                        >
                          <td className="py-2 px-3 text-neutral-800 dark:text-neutral-200 font-medium text-sm max-w-[160px] truncate">
                            {i === 0 && (
                              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mr-1.5 bg-indigo-50 dark:bg-indigo-900/50 px-1 py-0.5 rounded">
                                Base
                              </span>
                            )}
                            {sc.name}
                          </td>
                          <td className="py-2 px-3 text-center font-semibold">{formatGPA(gpa)}</td>
                          <td className="py-2 px-3 text-center font-semibold">{formatGPA(cgpa)}</td>
                          <td className="py-2 px-3 text-center">
                            {gpaΔ !== null ? (
                              <span className={cn(
                                "text-xs font-medium",
                                gpaΔ > 0 && "text-emerald-600 dark:text-emerald-400",
                                gpaΔ < 0 && "text-red-600 dark:text-red-400",
                                gpaΔ === 0 && "text-neutral-400"
                              )}>
                                {gpaΔ >= 0 ? "+" : ""}{gpaΔ.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Scenario cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {state.scenarios.map((scenario, i) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                scale={scale}
                isBaseline={i === 0}
                baselineGPA={i > 0 ? baselineGPA : undefined}
                baselineCGPA={i > 0 ? baselineCGPA : undefined}
                previousCGPA={state.previousCGPA}
                previousEarnedCH={state.previousEarnedCH}
                onUpdate={(s) => dispatch({ type: "UPDATE_SCENARIO", payload: s })}
                onRemove={() => {
                  if (confirm("Remove this scenario?")) {
                    dispatch({ type: "REMOVE_SCENARIO", payload: scenario.id });
                  }
                }}
                onDuplicate={() => duplicateScenario(scenario.id)}
              />
            ))}
          </div>
        </>
      )}
    </SectionContainer>
  );
}
