/**
 * Relative Grade Predictor — deterministic, rule-based engine.
 * No machine learning, no randomness, no opaque logic.
 *
 * Every adjustment is documented here and surfaced to the user
 * in the reasoning summary.
 */

import type {
  PredictorSubject,
  SubjectPrediction,
  SemesterPrediction,
  GradingScale,
  ConfidenceLabel,
  RankCategory,
  DifficultyLevel,
  InstructorStrictness,
} from "@/types";
import { clamp } from "./utils";
import { lookupGradeByScore } from "./grading";
import { computeGPAFromPairs, computeCGPAFromPairs } from "./calculator";

// ─── Adjustment Tables ────────────────────────────────────────────────────────

const RANK_ADJUSTMENT: Record<RankCategory, number> = {
  top5:         +8,
  top10:        +6,
  top20:        +4,
  aboveAverage: +2,
  average:       0,
  belowAverage: -4,
};

const DIFFICULTY_ADJUSTMENT: Record<DifficultyLevel, number> = {
  hard:     +3,
  moderate:  0,
  easy:     -2,
};

const STRICTNESS_ADJUSTMENT: Record<InstructorStrictness, number> = {
  lenient: +1,
  normal:   0,
  strict:  -2,
};

function classSizeAdjustment(n: number): number {
  if (n < 20)  return -1;
  if (n <= 50) return  0;
  if (n <= 100) return +1;
  return +2;
}

// ─── Reasoning Builder ────────────────────────────────────────────────────────

function buildReasoning(subject: PredictorSubject): string[] {
  const lines: string[] = [];

  const ra = RANK_ADJUSTMENT[subject.rankCategory];
  if (ra > 0)
    lines.push(
      `Strong estimated class standing (${formatRank(subject.rankCategory)}) raises the likely outcome by ${ra} points.`
    );
  if (ra < 0)
    lines.push(
      `Below-average estimated class standing lowers the likely outcome by ${Math.abs(ra)} points.`
    );

  const da = DIFFICULTY_ADJUSTMENT[subject.difficulty];
  if (da > 0)
    lines.push(
      `Hard course difficulty slightly boosts the adjusted estimate (relative grading curves harder classes).`
    );
  if (da < 0)
    lines.push(`Easy course difficulty slightly reduces the adjusted estimate.`);

  const ia = STRICTNESS_ADJUSTMENT[subject.instructorStrictness];
  if (ia < 0)
    lines.push(`Strict instructor reduces the adjusted estimate by ${Math.abs(ia)} points.`);
  if (ia > 0)
    lines.push(`Lenient instructor adds a slight positive adjustment.`);

  const ca = classSizeAdjustment(subject.classSize);
  if (ca > 0)
    lines.push(
      `Larger class size (${subject.classSize}) increases curve likelihood, adding ${ca} point(s).`
    );
  if (ca < 0)
    lines.push(
      `Small class size (${subject.classSize}) reduces curve predictability, subtracting ${Math.abs(ca)} point.`
    );

  if (subject.gradingType === "relative")
    lines.push(`Relative grading confirmed — adjustments are applied as expected.`);
  if (subject.gradingType === "absolute")
    lines.push(`Absolute grading: class-standing adjustments are less meaningful here.`);
  if (subject.gradingType === "unsure")
    lines.push(`Grading type is uncertain — confidence is reduced accordingly.`);

  if (subject.expectedPercentage === null)
    lines.push(`No expected percentage provided — confidence is significantly reduced.`);

  return lines;
}

function formatRank(rank: RankCategory): string {
  const map: Record<RankCategory, string> = {
    top5:         "Top 5%",
    top10:        "Top 10%",
    top20:        "Top 20%",
    aboveAverage: "Above Average",
    average:      "Average",
    belowAverage: "Below Average",
  };
  return map[rank];
}

// ─── Confidence Score ─────────────────────────────────────────────────────────

function computeConfidence(subject: PredictorSubject): number {
  let score = 100;

  if (subject.gradingType === "unsure") score -= 20;
  if (subject.classSize < 20)          score -= 15;
  if (
    subject.rankCategory === "average" ||
    subject.rankCategory === "belowAverage"
  )
    score -= 10;
  if (subject.expectedPercentage === null) score -= 25;

  return clamp(score, 0, 100);
}

function confidenceToLabel(score: number): ConfidenceLabel {
  if (score <= 40) return "Low";
  if (score <= 70) return "Medium";
  return "High";
}

// ─── Core Predictor ───────────────────────────────────────────────────────────

/**
 * Predict a single subject's grade outcome.
 */
export function predictSubject(
  subject: PredictorSubject,
  scale: GradingScale
): SubjectPrediction {
  const base = subject.expectedPercentage ?? 50; // default to 50 if unknown

  const adjustedRaw =
    base +
    RANK_ADJUSTMENT[subject.rankCategory] +
    DIFFICULTY_ADJUSTMENT[subject.difficulty] +
    STRICTNESS_ADJUSTMENT[subject.instructorStrictness] +
    classSizeAdjustment(subject.classSize);

  const adjustedScore = clamp(adjustedRaw, 0, 100);
  const optimisticScore = clamp(adjustedScore + 3, 0, 100);
  const pessimisticScore = clamp(adjustedScore - 5, 0, 100);

  const likelyRow     = lookupGradeByScore(adjustedScore,   scale);
  const optimisticRow = lookupGradeByScore(optimisticScore, scale);
  const pessimisticRow = lookupGradeByScore(pessimisticScore, scale);

  const fallback = scale.grades.length > 0
    ? scale.grades[scale.grades.length - 1]
    : { grade: "F", points: 0 };

  const likelyGrade     = likelyRow?.grade     ?? fallback.grade;
  const likelyPoints    = likelyRow?.points     ?? fallback.points;
  const optimisticGrade = optimisticRow?.grade  ?? fallback.grade;
  const optimisticPoints = optimisticRow?.points ?? fallback.points;
  const pessimisticGrade = pessimisticRow?.grade ?? fallback.grade;
  const pessimisticPoints = pessimisticRow?.points ?? fallback.points;

  const confidence      = computeConfidence(subject);
  const confidenceLabel = confidenceToLabel(confidence);
  const reasoning       = buildReasoning(subject);

  return {
    subjectId: subject.id,
    adjustedScore,
    pessimisticGrade,
    pessimisticPoints,
    likelyGrade,
    likelyPoints,
    optimisticGrade,
    optimisticPoints,
    confidence,
    confidenceLabel,
    reasoning,
  };
}

/**
 * Predict an entire semester across all subjects.
 */
export function predictSemester(
  subjects: PredictorSubject[],
  scale: GradingScale,
  previousCGPA: number,
  previousEarnedCH: number
): SemesterPrediction {
  const subjectPredictions = subjects.map((s) => predictSubject(s, scale));

  const pessPairs = subjectPredictions.map((p, i) => ({
    creditHours: subjects[i].creditHours,
    gradePoints: p.pessimisticPoints,
  }));
  const likelyPairs = subjectPredictions.map((p, i) => ({
    creditHours: subjects[i].creditHours,
    gradePoints: p.likelyPoints,
  }));
  const optPairs = subjectPredictions.map((p, i) => ({
    creditHours: subjects[i].creditHours,
    gradePoints: p.optimisticPoints,
  }));

  return {
    subjectPredictions,
    pessimisticGPA:  computeGPAFromPairs(pessPairs),
    likelyGPA:       computeGPAFromPairs(likelyPairs),
    optimisticGPA:   computeGPAFromPairs(optPairs),
    pessimisticCGPA: computeCGPAFromPairs(previousCGPA, previousEarnedCH, pessPairs),
    likelyCGPA:      computeCGPAFromPairs(previousCGPA, previousEarnedCH, likelyPairs),
    optimisticCGPA:  computeCGPAFromPairs(previousCGPA, previousEarnedCH, optPairs),
  };
}
