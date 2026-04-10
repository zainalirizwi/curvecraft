/**
 * Grading scale utilities: lookup, validation, sorting, overlap detection.
 * No UI dependencies.
 */

import type { GradeRow, GradingScale } from "@/types";
import { PRESET_GRADING_SCALES } from "@/constants/gradingScales";

// ─── Lookup ───────────────────────────────────────────────────────────────────

/**
 * Find the grade row matching a given percentage score.
 * Returns null if no match found.
 */
export function lookupGradeByScore(
  score: number,
  scale: GradingScale
): GradeRow | null {
  const sorted = sortGradesByDescending(scale.grades);
  for (const row of sorted) {
    if (score >= row.min && score <= row.max) {
      return row;
    }
  }
  return null;
}

/**
 * Find the grade row by exact grade label.
 */
export function lookupGradeByLabel(
  label: string,
  scale: GradingScale
): GradeRow | null {
  return scale.grades.find((g) => g.grade === label) ?? null;
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

/**
 * Sort grade rows by descending minimum threshold (highest first).
 */
export function sortGradesByDescending(grades: GradeRow[]): GradeRow[] {
  return [...grades].sort((a, b) => b.min - a.min);
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationIssue {
  type: "overlap" | "gap" | "invalid_range" | "empty";
  message: string;
}

/**
 * Validate a set of grade rows, returning a list of issues.
 */
export function validateGradeRows(grades: GradeRow[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (grades.length === 0) {
    issues.push({ type: "empty", message: "Scale must have at least one grade." });
    return issues;
  }

  for (const row of grades) {
    if (row.min > row.max) {
      issues.push({
        type: "invalid_range",
        message: `Grade "${row.grade}": min (${row.min}) cannot exceed max (${row.max}).`,
      });
    }
    if (row.points < 0) {
      issues.push({
        type: "invalid_range",
        message: `Grade "${row.grade}": points cannot be negative.`,
      });
    }
  }

  // Check for overlapping ranges
  const sorted = sortGradesByDescending(grades);
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    if (next.max >= curr.min) {
      issues.push({
        type: "overlap",
        message: `Grades "${curr.grade}" and "${next.grade}" have overlapping ranges.`,
      });
    }
    // Gap detection (informational, not blocking)
    if (next.max < curr.min - 1) {
      issues.push({
        type: "gap",
        message: `Gap detected between "${next.grade}" (max ${next.max}) and "${curr.grade}" (min ${curr.min}).`,
      });
    }
  }

  return issues;
}

// ─── Scale Resolution ─────────────────────────────────────────────────────────

/**
 * Resolve a grading scale by ID from presets + custom scales.
 */
export function resolveScale(
  scaleId: string,
  customScales: GradingScale[]
): GradingScale | null {
  const preset = PRESET_GRADING_SCALES.find((s) => s.id === scaleId);
  if (preset) return preset;
  return customScales.find((s) => s.id === scaleId) ?? null;
}

/**
 * Get all available scales (presets + custom).
 */
export function getAllScales(customScales: GradingScale[]): GradingScale[] {
  return [...PRESET_GRADING_SCALES, ...customScales];
}
