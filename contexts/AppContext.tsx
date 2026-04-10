"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { AppState, AppAction, Section } from "@/types";
import { DEFAULT_SCALE_ID } from "@/constants/gradingScales";
import { saveState, loadState } from "@/lib/persistence";
import { generateId } from "@/lib/utils";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AppState = {
  previousCGPA: 0,
  previousEarnedCH: 0,
  subjects: [],
  predictorSubjects: [],
  selectedScaleId: DEFAULT_SCALE_ID,
  customScales: [],
  scenarios: [],
  theme: "system",
  onboardingDismissed: false,
  activeSection: "calculator",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PREVIOUS_CGPA":
      return { ...state, previousCGPA: action.payload };

    case "SET_PREVIOUS_EARNED_CH":
      return { ...state, previousEarnedCH: action.payload };

    case "ADD_SUBJECT":
      return { ...state, subjects: [...state.subjects, action.payload] };

    case "UPDATE_SUBJECT":
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case "REMOVE_SUBJECT":
      return {
        ...state,
        subjects: state.subjects.filter((s) => s.id !== action.payload),
      };

    case "DUPLICATE_SUBJECT": {
      const original = state.subjects.find((s) => s.id === action.payload);
      if (!original) return state;
      const duplicate = { ...original, id: generateId(), name: `${original.name} (copy)` };
      const idx = state.subjects.findIndex((s) => s.id === action.payload);
      const newSubjects = [...state.subjects];
      newSubjects.splice(idx + 1, 0, duplicate);
      return { ...state, subjects: newSubjects };
    }

    case "ADD_PREDICTOR_SUBJECT":
      return {
        ...state,
        predictorSubjects: [...state.predictorSubjects, action.payload],
      };

    case "UPDATE_PREDICTOR_SUBJECT":
      return {
        ...state,
        predictorSubjects: state.predictorSubjects.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case "REMOVE_PREDICTOR_SUBJECT":
      return {
        ...state,
        predictorSubjects: state.predictorSubjects.filter(
          (s) => s.id !== action.payload
        ),
      };

    case "SET_SELECTED_SCALE":
      return { ...state, selectedScaleId: action.payload };

    case "ADD_CUSTOM_SCALE":
      return {
        ...state,
        customScales: [...state.customScales, action.payload],
        selectedScaleId: action.payload.id,
      };

    case "UPDATE_CUSTOM_SCALE":
      return {
        ...state,
        customScales: state.customScales.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case "REMOVE_CUSTOM_SCALE": {
      const next = state.customScales.filter((s) => s.id !== action.payload);
      const selectedStillExists =
        next.some((s) => s.id === state.selectedScaleId) ||
        state.selectedScaleId !== action.payload;
      return {
        ...state,
        customScales: next,
        selectedScaleId: selectedStillExists
          ? state.selectedScaleId
          : DEFAULT_SCALE_ID,
      };
    }

    case "ADD_SCENARIO":
      return { ...state, scenarios: [...state.scenarios, action.payload] };

    case "UPDATE_SCENARIO":
      return {
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case "REMOVE_SCENARIO":
      return {
        ...state,
        scenarios: state.scenarios.filter((s) => s.id !== action.payload),
      };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "DISMISS_ONBOARDING":
      return { ...state, onboardingDismissed: true };

    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.payload };

    case "HYDRATE":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (section: Section) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    // Don't persist activeSection (ephemeral UI state)
    const { activeSection: _activeSection, ...persistable } = state;
    saveState(persistable);
  }, [state]);

  // Apply theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") {
      root.classList.add("dark");
    } else if (state.theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [state.theme]);

  const navigate = useCallback((section: Section) => {
    dispatch({ type: "SET_ACTIVE_SECTION", payload: section });
  }, []);

  const value = useMemo(() => ({ state, dispatch, navigate }), [state, navigate]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
