"use client";

import { useState } from "react";
import { Plus, Check, Pencil, Trash2, AlertTriangle, Info } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { PRESET_GRADING_SCALES } from "@/constants/gradingScales";
import { getAllScales, resolveScale, validateGradeRows, sortGradesByDescending } from "@/lib/grading";
import { generateId, cn } from "@/lib/utils";
import type { GradingScale, GradeRow } from "@/types";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { EmptyState } from "@/components/ui/EmptyState";

// ─── Grade Row Editor ─────────────────────────────────────────────────────────

function GradeRowEditor({
  row,
  onChange,
  onRemove,
}: {
  row: GradeRow;
  onChange: (r: GradeRow) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 group animate-fade-in">
      <input
        className="input-field w-20 text-sm"
        placeholder="Grade"
        value={row.grade}
        onChange={(e) => onChange({ ...row, grade: e.target.value })}
        aria-label="Grade label"
      />
      <span className="text-neutral-400 text-xs hidden sm:block">Min%</span>
      <input
        className="input-field w-20 text-sm"
        type="number"
        min={0}
        max={100}
        placeholder="0"
        value={row.min}
        onChange={(e) => onChange({ ...row, min: parseFloat(e.target.value) || 0 })}
        aria-label="Minimum percentage"
      />
      <span className="text-neutral-400 text-xs hidden sm:block">Max%</span>
      <input
        className="input-field w-20 text-sm"
        type="number"
        min={0}
        max={100}
        placeholder="100"
        value={row.max}
        onChange={(e) => onChange({ ...row, max: parseFloat(e.target.value) || 0 })}
        aria-label="Maximum percentage"
      />
      <span className="text-neutral-400 text-xs hidden sm:block">Points</span>
      <input
        className="input-field w-20 text-sm"
        type="number"
        min={0}
        max={10}
        step={0.01}
        placeholder="4.00"
        value={row.points}
        onChange={(e) => onChange({ ...row, points: parseFloat(e.target.value) || 0 })}
        aria-label="Grade points"
      />
      <button
        onClick={onRemove}
        className="btn-danger flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        aria-label="Remove grade row"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Scale Editor Modal / Inline ──────────────────────────────────────────────

function ScaleEditor({
  scale,
  onSave,
  onCancel,
}: {
  scale: GradingScale;
  onSave: (s: GradingScale) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<GradingScale>(structuredClone(scale));
  const issues = validateGradeRows(draft.grades);
  const hasError = issues.some((i) => i.type !== "gap");

  function updateRow(id: string, updated: GradeRow) {
    setDraft((d) => ({
      ...d,
      grades: d.grades.map((r) => (r.id === id ? updated : r)),
    }));
  }

  function removeRow(id: string) {
    setDraft((d) => ({ ...d, grades: d.grades.filter((r) => r.id !== id) }));
  }

  function addRow() {
    const newRow: GradeRow = {
      id: generateId(),
      grade: "",
      min: 0,
      max: 0,
      points: 0,
    };
    setDraft((d) => ({ ...d, grades: [...d.grades, newRow] }));
  }

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <label className="label" htmlFor="scale-name-input">Scale Name</label>
          <input
            id="scale-name-input"
            className="input-field"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="e.g. My University Scale"
          />
        </div>
      </div>

      {/* Mobile column labels */}
      <div className="hidden sm:grid grid-cols-[80px_80px_80px_80px_1fr] gap-2 px-0">
        {["Grade", "Min %", "Max %", "Points", ""].map((l) => (
          <span key={l} className="text-xs font-medium text-neutral-500 dark:text-neutral-500">{l}</span>
        ))}
      </div>

      {/* Grade rows */}
      <div className="flex flex-col">
        {sortGradesByDescending(draft.grades).map((row) => (
          <GradeRowEditor
            key={row.id}
            row={row}
            onChange={(r) => updateRow(row.id, r)}
            onRemove={() => removeRow(row.id)}
          />
        ))}
      </div>

      <button onClick={addRow} className="btn-secondary self-start">
        <Plus size={14} /> Add Grade Row
      </button>

      {/* Validation messages */}
      {issues.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-2 text-xs px-3 py-2 rounded-lg",
                issue.type === "gap"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                  : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
              )}
            >
              {issue.type === "gap" ? (
                <Info size={13} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
              )}
              {issue.message}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onSave(draft)}
          disabled={hasError || !draft.name.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={15} /> Save Scale
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Grading Scale Manager ───────────────────────────────────────────────

export function GradingScaleManager() {
  const { state, dispatch } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const allScales = getAllScales(state.customScales);

  function startNew() {
    setCreatingNew(true);
    setEditingId(null);
  }

  function saveNew(scale: GradingScale) {
    dispatch({ type: "ADD_CUSTOM_SCALE", payload: { ...scale, id: generateId(), isPreset: false } });
    setCreatingNew(false);
  }

  function saveEdit(scale: GradingScale) {
    dispatch({ type: "UPDATE_CUSTOM_SCALE", payload: scale });
    setEditingId(null);
  }

  function removeCustom(id: string) {
    if (confirm("Remove this custom grading scale?")) {
      dispatch({ type: "REMOVE_CUSTOM_SCALE", payload: id });
    }
  }

  const selectedScale = resolveScale(state.selectedScaleId, state.customScales);

  return (
    <SectionContainer
      title="Grading Scales"
      description="Select a preset or build a custom scale that matches your institution."
      actions={
        <button onClick={startNew} className="btn-primary">
          <Plus size={15} /> New Scale
        </button>
      }
    >
      {/* Scale selector */}
      <div className="card p-4">
        <label className="label" htmlFor="scale-select">Active Grading Scale</label>
        <div className="relative">
          <select
            id="scale-select"
            className="select-field pr-8"
            value={state.selectedScaleId}
            onChange={(e) => dispatch({ type: "SET_SELECTED_SCALE", payload: e.target.value })}
          >
            <optgroup label="Presets">
              {PRESET_GRADING_SCALES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </optgroup>
            {state.customScales.length > 0 && (
              <optgroup label="Custom Scales">
                {state.customScales.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg viewBox="0 0 12 8" fill="none" className="w-3 h-2">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* Active scale preview */}
        {selectedScale && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500 mb-2">
              Grade Map Preview
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[320px]">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    {["Grade", "Min %", "Max %", "Points"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-neutral-500 dark:text-neutral-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortGradesByDescending(selectedScale.grades).map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="px-3 py-1.5 font-medium text-neutral-800 dark:text-neutral-200">{g.grade}</td>
                      <td className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400">{g.min}</td>
                      <td className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400">{g.max}</td>
                      <td className="px-3 py-1.5 text-indigo-700 dark:text-indigo-300 font-semibold">
                        {g.points.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* New scale creator */}
      {creatingNew && (
        <ScaleEditor
          scale={{
            id: "",
            name: "",
            isPreset: false,
            grades: [
              { id: generateId(), grade: "A",  min: 85, max: 100, points: 4.0 },
              { id: generateId(), grade: "B",  min: 70, max: 84,  points: 3.0 },
              { id: generateId(), grade: "C",  min: 55, max: 69,  points: 2.0 },
              { id: generateId(), grade: "F",  min: 0,  max: 54,  points: 0.0 },
            ],
          }}
          onSave={saveNew}
          onCancel={() => setCreatingNew(false)}
        />
      )}

      {/* Custom scales list */}
      {state.customScales.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Your Custom Scales
          </p>
          {state.customScales.map((scale) =>
            editingId === scale.id ? (
              <ScaleEditor
                key={scale.id}
                scale={scale}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div key={scale.id} className="card p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {scale.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                    {scale.grades.length} grade band{scale.grades.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {state.selectedScaleId === scale.id && (
                  <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    <Check size={12} /> Active
                  </span>
                )}
                <button
                  onClick={() => { setEditingId(scale.id); setCreatingNew(false); }}
                  className="btn-ghost"
                  aria-label="Edit scale"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => removeCustom(scale.id)}
                  className="btn-danger"
                  aria-label="Delete scale"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {state.customScales.length === 0 && !creatingNew && (
        <div className="card">
          <EmptyState
            title="No custom scales yet"
            description="Click New Scale to create a grading scale that matches your institution's system."
            action={
              <button onClick={startNew} className="btn-secondary">
                <Plus size={14} /> Create Custom Scale
              </button>
            }
          />
        </div>
      )}
    </SectionContainer>
  );
}
