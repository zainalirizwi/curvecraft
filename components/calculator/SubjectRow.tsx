"use client";

import { Trash2, Copy } from "lucide-react";
import type { Subject, GradingScale } from "@/types";
import { sortGradesByDescending } from "@/lib/grading";

interface SubjectRowProps {
  subject: Subject;
  scale: GradingScale;
  index: number;
  onChange: (updated: Subject) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function SubjectRow({
  subject,
  scale,
  index,
  onChange,
  onRemove,
  onDuplicate,
}: SubjectRowProps) {
  const sortedGrades = sortGradesByDescending(scale.grades);

  function handleGradeChange(gradeLabel: string) {
    const gradeRow = scale.grades.find((g) => g.grade === gradeLabel);
    onChange({
      ...subject,
      grade: gradeLabel,
      gradePoints: gradeRow?.points ?? 0,
    });
  }

  return (
    <div
      className="card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-slide-up group"
      aria-label={`Subject ${index + 1}`}
    >
      {/* Row number — subtle indicator */}
      <span
        className="hidden sm:flex w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-400 items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        {index + 1}
      </span>

      {/* Subject name */}
      <div className="flex-1 min-w-0">
        <label className="label sr-only" htmlFor={`name-${subject.id}`}>
          Subject name
        </label>
        <input
          id={`name-${subject.id}`}
          className="input-field"
          type="text"
          placeholder="Subject / Course name"
          value={subject.name}
          onChange={(e) => onChange({ ...subject, name: e.target.value })}
          autoComplete="off"
        />
      </div>

      {/* Credit hours */}
      <div className="w-full sm:w-24 flex-shrink-0">
        <label className="label" htmlFor={`ch-${subject.id}`}>
          Credit Hrs
        </label>
        <input
          id={`ch-${subject.id}`}
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

      {/* Grade selector */}
      <div className="w-full sm:w-28 flex-shrink-0">
        <label className="label" htmlFor={`grade-${subject.id}`}>
          Grade
        </label>
        <div className="relative">
          <select
            id={`grade-${subject.id}`}
            className="select-field pr-7"
            value={subject.grade}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            <option value="">— Grade —</option>
            {sortedGrades.map((g) => (
              <option key={g.id} value={g.grade}>
                {g.grade}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg viewBox="0 0 12 8" fill="none" className="w-3 h-2">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* Grade points (read-only, auto-populated) */}
      <div className="w-full sm:w-24 flex-shrink-0">
        <label className="label" htmlFor={`gp-${subject.id}`}>
          Points
        </label>
        <input
          id={`gp-${subject.id}`}
          className="input-field bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-500 cursor-default"
          type="text"
          value={subject.grade ? subject.gradePoints.toFixed(2) : "—"}
          readOnly
          tabIndex={-1}
          aria-label={`Grade points for subject ${index + 1}`}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
        <button
          onClick={onDuplicate}
          className="btn-ghost"
          aria-label="Duplicate subject"
          title="Duplicate"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={onRemove}
          className="btn-danger"
          aria-label="Remove subject"
          title="Remove"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
