// ─── Grading Scale Types ─────────────────────────────────────────────────────

export interface GradeRow {
  id: string;
  grade: string;
  min: number;
  max: number;
  points: number;
}

export interface GradingScale {
  id: string;
  name: string;
  grades: GradeRow[];
  isPreset: boolean;
}

// ─── Calculator Types ─────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
  gradePoints: number;
}

export interface SemesterResult {
  totalCH: number;
  totalQualityPoints: number;
  semesterGPA: number;
  updatedCGPA: number;
}

// ─── Predictor Types ──────────────────────────────────────────────────────────

export type RankCategory =
  | "top5"
  | "top10"
  | "top20"
  | "aboveAverage"
  | "average"
  | "belowAverage";

export type DifficultyLevel = "easy" | "moderate" | "hard";
export type InstructorStrictness = "lenient" | "normal" | "strict";
export type GradingType = "relative" | "absolute" | "unsure";
export type ConfidenceLabel = "Low" | "Medium" | "High";

export interface PredictorSubject {
  id: string;
  name: string;
  creditHours: number;
  expectedPercentage: number | null;
  rankCategory: RankCategory;
  classSize: number;
  difficulty: DifficultyLevel;
  instructorStrictness: InstructorStrictness;
  gradingType: GradingType;
}

export interface SubjectPrediction {
  subjectId: string;
  adjustedScore: number;
  pessimisticGrade: string;
  pessimisticPoints: number;
  likelyGrade: string;
  likelyPoints: number;
  optimisticGrade: string;
  optimisticPoints: number;
  confidence: number;
  confidenceLabel: ConfidenceLabel;
  reasoning: string[];
}

export interface SemesterPrediction {
  subjectPredictions: SubjectPrediction[];
  pessimisticGPA: number;
  likelyGPA: number;
  optimisticGPA: number;
  pessimisticCGPA: number;
  likelyCGPA: number;
  optimisticCGPA: number;
}

// ─── Simulator Types ──────────────────────────────────────────────────────────

export interface ScenarioSubject {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
  gradePoints: number;
}

export interface Scenario {
  id: string;
  name: string;
  subjects: ScenarioSubject[];
  semesterGPA: number;
  updatedCGPA: number;
  notes: string;
}

// ─── App Navigation ───────────────────────────────────────────────────────────

export type Section =
  | "calculator"
  | "grading"
  | "predictor"
  | "simulator"
  | "dashboard"
  | "explanation";

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  previousCGPA: number;
  previousEarnedCH: number;
  subjects: Subject[];
  predictorSubjects: PredictorSubject[];
  selectedScaleId: string;
  customScales: GradingScale[];
  scenarios: Scenario[];
  theme: "light" | "dark" | "system";
  onboardingDismissed: boolean;
  activeSection: Section;
}

// ─── Action Types ─────────────────────────────────────────────────────────────

export type AppAction =
  | { type: "SET_PREVIOUS_CGPA"; payload: number }
  | { type: "SET_PREVIOUS_EARNED_CH"; payload: number }
  | { type: "ADD_SUBJECT"; payload: Subject }
  | { type: "UPDATE_SUBJECT"; payload: Subject }
  | { type: "REMOVE_SUBJECT"; payload: string }
  | { type: "DUPLICATE_SUBJECT"; payload: string }
  | { type: "ADD_PREDICTOR_SUBJECT"; payload: PredictorSubject }
  | { type: "UPDATE_PREDICTOR_SUBJECT"; payload: PredictorSubject }
  | { type: "REMOVE_PREDICTOR_SUBJECT"; payload: string }
  | { type: "SET_SELECTED_SCALE"; payload: string }
  | { type: "ADD_CUSTOM_SCALE"; payload: GradingScale }
  | { type: "UPDATE_CUSTOM_SCALE"; payload: GradingScale }
  | { type: "REMOVE_CUSTOM_SCALE"; payload: string }
  | { type: "ADD_SCENARIO"; payload: Scenario }
  | { type: "UPDATE_SCENARIO"; payload: Scenario }
  | { type: "REMOVE_SCENARIO"; payload: string }
  | { type: "SET_THEME"; payload: "light" | "dark" | "system" }
  | { type: "DISMISS_ONBOARDING" }
  | { type: "SET_ACTIVE_SECTION"; payload: Section }
  | { type: "HYDRATE"; payload: Partial<AppState> };
