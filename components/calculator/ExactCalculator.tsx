"use client";

import { Plus, BookOpen } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { resolveScale } from "@/lib/grading";
import {
  computeSemesterResult,
} from "@/lib/calculator";
import { generateId, formatGPA, safeRound } from "@/lib/utils";
import type { Subject } from "@/types";
import { SubjectRow } from "./SubjectRow";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionContainer } from "@/components/ui/SectionContainer";

export function ExactCalculator() {
  const { state, dispatch } = useApp();

  const scale = resolveScale(state.selectedScaleId, state.customScales);
  const defaultGrade = scale ? (scale.grades[0] ?? null) : null;

  const result = scale
    ? computeSemesterResult(
        state.previousCGPA,
        state.previousEarnedCH,
        state.subjects
      )
    : null;

  function addSubject() {
    if (!scale) return;
    const subject: Subject = {
      id: generateId(),
      name: "",
      creditHours: 3,
      grade: defaultGrade?.grade ?? "",
      gradePoints: defaultGrade?.points ?? 0,
    };
    dispatch({ type: "ADD_SUBJECT", payload: subject });
  }

  return (
    <SectionContainer
      title="Exact Calculator"
      description="Enter your current semester subjects with known grades."
      actions={
        <button onClick={addSubject} className="btn-primary">
          <Plus size={15} /> Add Subject
        </button>
      }
    >
      {/* Previous Academic Record */}
      <div className="card p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500 mb-3">
          Previous Academic Record
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="prev-cgpa">
              Previous Cumulative CGPA
            </label>
            <input
              id="prev-cgpa"
              className="input-field"
              type="number"
              min={0}
              max={4}
              step={0.01}
              placeholder="e.g. 3.45"
              value={state.previousCGPA === 0 ? "" : state.previousCGPA}
              onChange={(e) =>
                dispatch({
                  type: "SET_PREVIOUS_CGPA",
                  payload: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="prev-ch">
              Total Earned Credit Hours
            </label>
            <input
              id="prev-ch"
              className="input-field"
              type="number"
              min={0}
              step={1}
              placeholder="e.g. 72"
              value={state.previousEarnedCH === 0 ? "" : state.previousEarnedCH}
              onChange={(e) =>
                dispatch({
                  type: "SET_PREVIOUS_EARNED_CH",
                  payload: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
        {!scale && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
            No grading scale selected. Please configure one in the Grading Scales section.
          </p>
        )}
      </div>

      {/* Subject List */}
      <div className="flex flex-col gap-2">
        {state.subjects.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<BookOpen size={36} />}
              title="No subjects added yet"
              description="Click Add Subject to start entering your current semester courses."
              action={
                <button onClick={addSubject} className="btn-primary">
                  <Plus size={15} /> Add Subject
                </button>
              }
            />
          </div>
        ) : (
          state.subjects.map((subject, idx) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              scale={scale ?? { id: "", name: "", grades: [], isPreset: false }}
              index={idx}
              onChange={(updated) =>
                dispatch({ type: "UPDATE_SUBJECT", payload: updated })
              }
              onRemove={() =>
                dispatch({ type: "REMOVE_SUBJECT", payload: subject.id })
              }
              onDuplicate={() =>
                dispatch({ type: "DUPLICATE_SUBJECT", payload: subject.id })
              }
            />
          ))
        )}

        {state.subjects.length > 0 && (
          <button
            onClick={addSubject}
            className="btn-secondary mt-1 self-start"
          >
            <Plus size={14} /> Add Subject
          </button>
        )}
      </div>

      {/* Results */}
      {result && state.subjects.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Results
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Semester GPA"
              value={formatGPA(result.semesterGPA)}
              accent
            />
            <MetricCard
              label="Updated CGPA"
              value={formatGPA(result.updatedCGPA)}
              accent
            />
            <MetricCard
              label="Total Credit Hours"
              value={String(result.totalCH)}
              sub="This semester"
            />
            <MetricCard
              label="Quality Points"
              value={safeRound(result.totalQualityPoints, 2).toFixed(2)}
              sub="This semester"
            />
          </div>

          {/* Subject breakdown */}
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
                    Subject
                  </th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
                    CH
                  </th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
                    Grade
                  </th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
                    Points
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
                    QP
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.subjects.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-neutral-800 dark:text-neutral-200 max-w-[200px] truncate">
                      {s.name || <span className="text-neutral-400 italic">Unnamed</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center text-neutral-600 dark:text-neutral-400">
                      {s.creditHours}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {s.grade || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-neutral-600 dark:text-neutral-400">
                      {s.grade ? s.gradePoints.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-neutral-700 dark:text-neutral-300 font-medium">
                      {s.grade
                        ? (s.creditHours * s.gradePoints).toFixed(2)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-50 dark:bg-neutral-800/40">
                  <td className="px-4 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Total
                  </td>
                  <td className="px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {result.totalCH}
                  </td>
                  <td />
                  <td />
                  <td className="px-4 py-2.5 text-right text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {safeRound(result.totalQualityPoints, 2).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
