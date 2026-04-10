"use client";

import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { PredictorSubject, SubjectPrediction } from "@/types";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { cn } from "@/lib/utils";

interface PredictorSubjectCardProps {
  subject: PredictorSubject;
  prediction?: SubjectPrediction;
  onChange: (s: PredictorSubject) => void;
  onRemove: () => void;
  index: number;
}

const RANK_OPTIONS: Array<{ value: PredictorSubject["rankCategory"]; label: string }> = [
  { value: "top5",         label: "Top 5%" },
  { value: "top10",        label: "Top 10%" },
  { value: "top20",        label: "Top 20%" },
  { value: "aboveAverage", label: "Above Average" },
  { value: "average",      label: "Average" },
  { value: "belowAverage", label: "Below Average" },
];

const DIFFICULTY_OPTIONS: Array<{ value: PredictorSubject["difficulty"]; label: string }> = [
  { value: "easy",     label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard",     label: "Hard" },
];

const STRICTNESS_OPTIONS: Array<{ value: PredictorSubject["instructorStrictness"]; label: string }> = [
  { value: "lenient", label: "Lenient" },
  { value: "normal",  label: "Normal" },
  { value: "strict",  label: "Strict" },
];

const GRADING_TYPE_OPTIONS: Array<{ value: PredictorSubject["gradingType"]; label: string }> = [
  { value: "relative", label: "Relative" },
  { value: "absolute", label: "Absolute" },
  { value: "unsure",   label: "Unsure" },
];

function SelectField<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="relative">
        <select
          id={id}
          className="select-field pr-7 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg viewBox="0 0 12 8" fill="none" className="w-3 h-2">
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function GradeChip({
  label,
  grade,
  points,
  variant,
}: {
  label: string;
  grade: string;
  points: number;
  variant: "pessimistic" | "likely" | "optimistic";
}) {
  const colors = {
    pessimistic: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
    likely:      "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
    optimistic:  "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
  };

  return (
    <div className={cn("flex flex-col items-center px-3 py-2 rounded-lg border text-center", colors[variant])}>
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-70 mb-0.5">{label}</span>
      <span className="text-lg font-semibold leading-none">{grade}</span>
      <span className="text-[10px] mt-0.5 opacity-60">{points.toFixed(2)} pts</span>
    </div>
  );
}

export function PredictorSubjectCard({
  subject,
  prediction,
  onChange,
  onRemove,
  index,
}: PredictorSubjectCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/60">
        <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <input
          className="flex-1 min-w-0 bg-transparent text-sm font-medium text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none"
          placeholder="Subject / Course name"
          value={subject.name}
          onChange={(e) => onChange({ ...subject, name: e.target.value })}
          aria-label={`Subject ${index + 1} name`}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-ghost"
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button
            onClick={onRemove}
            className="btn-danger"
            aria-label="Remove subject"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 flex flex-col gap-4">
          {/* Input fields grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div>
              <label className="label" htmlFor={`pct-${subject.id}`}>Expected % Score</label>
              <input
                id={`pct-${subject.id}`}
                className="input-field"
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 75"
                value={subject.expectedPercentage ?? ""}
                onChange={(e) =>
                  onChange({
                    ...subject,
                    expectedPercentage: e.target.value === "" ? null : parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="label" htmlFor={`pch-${subject.id}`}>Credit Hours</label>
              <input
                id={`pch-${subject.id}`}
                className="input-field"
                type="number"
                min={0}
                max={12}
                step={1}
                placeholder="3"
                value={subject.creditHours === 0 ? "" : subject.creditHours}
                onChange={(e) =>
                  onChange({ ...subject, creditHours: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <label className="label" htmlFor={`pcs-${subject.id}`}>Class Size</label>
              <input
                id={`pcs-${subject.id}`}
                className="input-field"
                type="number"
                min={1}
                placeholder="e.g. 40"
                value={subject.classSize === 0 ? "" : subject.classSize}
                onChange={(e) =>
                  onChange({ ...subject, classSize: parseInt(e.target.value) || 1 })
                }
              />
            </div>

            <SelectField
              id={`prank-${subject.id}`}
              label="Class Standing"
              value={subject.rankCategory}
              options={RANK_OPTIONS}
              onChange={(v) => onChange({ ...subject, rankCategory: v })}
            />

            <SelectField
              id={`pdiff-${subject.id}`}
              label="Course Difficulty"
              value={subject.difficulty}
              options={DIFFICULTY_OPTIONS}
              onChange={(v) => onChange({ ...subject, difficulty: v })}
            />

            <SelectField
              id={`pstr-${subject.id}`}
              label="Instructor Strictness"
              value={subject.instructorStrictness}
              options={STRICTNESS_OPTIONS}
              onChange={(v) => onChange({ ...subject, instructorStrictness: v })}
            />

            <SelectField
              id={`pgt-${subject.id}`}
              label="Grading Type"
              value={subject.gradingType}
              options={GRADING_TYPE_OPTIONS}
              onChange={(v) => onChange({ ...subject, gradingType: v })}
            />
          </div>

          {/* Prediction result */}
          {prediction && (
            <div className="flex flex-col gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Predicted Outcome
                </p>
                <ConfidenceBadge label={prediction.confidenceLabel} score={prediction.confidence} />
                <span className="text-xs text-neutral-400 dark:text-neutral-600">
                  Adjusted score: {prediction.adjustedScore.toFixed(1)}%
                </span>
              </div>

              <div className="flex gap-2">
                <GradeChip
                  label="Pessimistic"
                  grade={prediction.pessimisticGrade}
                  points={prediction.pessimisticPoints}
                  variant="pessimistic"
                />
                <GradeChip
                  label="Likely"
                  grade={prediction.likelyGrade}
                  points={prediction.likelyPoints}
                  variant="likely"
                />
                <GradeChip
                  label="Optimistic"
                  grade={prediction.optimisticGrade}
                  points={prediction.optimisticPoints}
                  variant="optimistic"
                />
              </div>

              {prediction.reasoning.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {prediction.reasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-neutral-500 dark:text-neutral-500">
                      <span className="mt-1 w-1 h-1 rounded-full bg-neutral-400 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
