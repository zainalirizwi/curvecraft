"use client";

import { Plus, AlertTriangle, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { resolveScale } from "@/lib/grading";
import { predictSemester } from "@/lib/predictor";
import { generateId, formatGPA } from "@/lib/utils";
import type { PredictorSubject } from "@/types";
import { PredictorSubjectCard } from "./PredictorSubjectCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionContainer } from "@/components/ui/SectionContainer";

export function RelativeGradePredictor() {
  const { state, dispatch } = useApp();

  const scale = resolveScale(state.selectedScaleId, state.customScales);

  const prediction =
    scale && state.predictorSubjects.length > 0
      ? predictSemester(
          state.predictorSubjects,
          scale,
          state.previousCGPA,
          state.previousEarnedCH
        )
      : null;

  function addSubject() {
    const subject: PredictorSubject = {
      id: generateId(),
      name: "",
      creditHours: 3,
      expectedPercentage: null,
      rankCategory: "average",
      classSize: 40,
      difficulty: "moderate",
      instructorStrictness: "normal",
      gradingType: "relative",
    };
    dispatch({ type: "ADD_PREDICTOR_SUBJECT", payload: subject });
  }

  return (
    <SectionContainer
      title="Grade Predictor"
      description="Estimate your grades before results are out using class standing, difficulty, and other signals."
      actions={
        <button onClick={addSubject} className="btn-primary">
          <Plus size={15} /> Add Subject
        </button>
      }
    >
      {/* Disclaimer */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-950/20">
        <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          <strong>Advisory only.</strong> These predictions are estimates based on a transparent,
          rule-based algorithm — not official results. Relative grading outcomes depend on factors
          outside this tool&apos;s knowledge. Use this as a planning aid, not a definitive forecast.
        </p>
      </div>

      {/* Subject cards */}
      <div className="flex flex-col gap-3">
        {state.predictorSubjects.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<TrendingUp size={36} />}
              title="No subjects added yet"
              description="Add your courses and provide expected scores and class standing to get grade predictions."
              action={
                <button onClick={addSubject} className="btn-primary">
                  <Plus size={15} /> Add Subject
                </button>
              }
            />
          </div>
        ) : (
          state.predictorSubjects.map((subject, idx) => {
            const pred = prediction?.subjectPredictions.find(
              (p) => p.subjectId === subject.id
            );
            return (
              <PredictorSubjectCard
                key={subject.id}
                subject={subject}
                prediction={pred}
                index={idx}
                onChange={(updated) =>
                  dispatch({ type: "UPDATE_PREDICTOR_SUBJECT", payload: updated })
                }
                onRemove={() =>
                  dispatch({ type: "REMOVE_PREDICTOR_SUBJECT", payload: subject.id })
                }
              />
            );
          })
        )}

        {state.predictorSubjects.length > 0 && (
          <button onClick={addSubject} className="btn-secondary self-start">
            <Plus size={14} /> Add Another Subject
          </button>
        )}
      </div>

      {/* Overall prediction */}
      {prediction && (
        <div className="flex flex-col gap-4">
          <div className="divider" />
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Predicted Semester Outcomes
          </p>

          {/* GPA range */}
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500 mb-2">
              Semester GPA Range
            </p>
            <div className="grid grid-cols-3 gap-3">
              <MetricCard
                label="Pessimistic GPA"
                value={formatGPA(prediction.pessimisticGPA)}
                className="border-red-200 dark:border-red-800/50"
              />
              <MetricCard
                label="Likely GPA"
                value={formatGPA(prediction.likelyGPA)}
                accent
              />
              <MetricCard
                label="Optimistic GPA"
                value={formatGPA(prediction.optimisticGPA)}
                className="border-emerald-200 dark:border-emerald-800/50"
              />
            </div>
          </div>

          {/* CGPA range */}
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500 mb-2">
              Cumulative CGPA Range
            </p>
            <div className="grid grid-cols-3 gap-3">
              <MetricCard
                label="Pessimistic CGPA"
                value={formatGPA(prediction.pessimisticCGPA)}
                sub="After this semester"
                className="border-red-200 dark:border-red-800/50"
              />
              <MetricCard
                label="Likely CGPA"
                value={formatGPA(prediction.likelyCGPA)}
                sub="After this semester"
                accent
              />
              <MetricCard
                label="Optimistic CGPA"
                value={formatGPA(prediction.optimisticCGPA)}
                sub="After this semester"
                className="border-emerald-200 dark:border-emerald-800/50"
              />
            </div>
          </div>

          {/* CGPA context */}
          {(state.previousCGPA === 0 && state.previousEarnedCH === 0) && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Enter your previous CGPA and credit hours in the Exact Calculator section for cumulative predictions.
            </p>
          )}
        </div>
      )}
    </SectionContainer>
  );
}
