/**
 * Pure math functions for GPA / CGPA calculation.
 * No UI dependencies. All functions return 0 on degenerate input.
 */

import type { Subject, SemesterResult } from "@/types";
import { safeRound } from "./utils";

/**
 * Compute semester GPA from a list of subjects.
 *
 * Formula: GPA = Σ(CH_i × GP_i) / Σ(CH_i)
 */
export function computeSemesterGPA(subjects: Subject[]): number {
  const totalCH = subjects.reduce((acc, s) => acc + s.creditHours, 0);
  if (totalCH === 0) return 0;

  const totalQP = subjects.reduce(
    (acc, s) => acc + s.creditHours * s.gradePoints,
    0
  );

  return totalQP / totalCH;
}

/**
 * Compute total quality points for a semester.
 */
export function computeTotalQualityPoints(subjects: Subject[]): number {
  return subjects.reduce((acc, s) => acc + s.creditHours * s.gradePoints, 0);
}

/**
 * Compute total credit hours for a list of subjects.
 */
export function computeTotalCH(subjects: Subject[]): number {
  return subjects.reduce((acc, s) => acc + s.creditHours, 0);
}

/**
 * Compute updated cumulative CGPA.
 *
 * Formula: CGPA = (prevCGPA × prevCH + currentQP) / (prevCH + currentCH)
 */
export function computeCumulativeCGPA(
  previousCGPA: number,
  previousEarnedCH: number,
  currentSubjects: Subject[]
): number {
  const currentCH = computeTotalCH(currentSubjects);
  const currentQP = computeTotalQualityPoints(currentSubjects);
  const denominator = previousEarnedCH + currentCH;

  if (denominator === 0) return 0;

  const numerator = previousCGPA * previousEarnedCH + currentQP;
  return numerator / denominator;
}

/**
 * Compute full semester result: all key metrics in one call.
 */
export function computeSemesterResult(
  previousCGPA: number,
  previousEarnedCH: number,
  subjects: Subject[]
): SemesterResult {
  const totalCH = computeTotalCH(subjects);
  const totalQualityPoints = safeRound(computeTotalQualityPoints(subjects), 4);
  const semesterGPA = computeSemesterGPA(subjects);
  const updatedCGPA = computeCumulativeCGPA(
    previousCGPA,
    previousEarnedCH,
    subjects
  );

  return {
    totalCH,
    totalQualityPoints,
    semesterGPA,
    updatedCGPA,
  };
}

/**
 * Compute GPA from a flat list of (creditHours, gradePoints) pairs.
 * Used by the predictor and simulator for scenario calculations.
 */
export function computeGPAFromPairs(
  pairs: Array<{ creditHours: number; gradePoints: number }>
): number {
  const totalCH = pairs.reduce((acc, p) => acc + p.creditHours, 0);
  if (totalCH === 0) return 0;
  const totalQP = pairs.reduce(
    (acc, p) => acc + p.creditHours * p.gradePoints,
    0
  );
  return totalQP / totalCH;
}

/**
 * Compute updated CGPA from pairs (used by predictor / simulator).
 */
export function computeCGPAFromPairs(
  previousCGPA: number,
  previousEarnedCH: number,
  pairs: Array<{ creditHours: number; gradePoints: number }>
): number {
  const currentCH = pairs.reduce((acc, p) => acc + p.creditHours, 0);
  const currentQP = pairs.reduce(
    (acc, p) => acc + p.creditHours * p.gradePoints,
    0
  );
  const denominator = previousEarnedCH + currentCH;
  if (denominator === 0) return 0;
  return (previousCGPA * previousEarnedCH + currentQP) / denominator;
}
