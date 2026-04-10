/**
 * localStorage persistence helpers.
 * All reads are wrapped in try/catch — a corrupt store should never crash the app.
 */

import type { AppState } from "@/types";

const STORAGE_KEY = "curvecraft_state_v1";

export function saveState(state: Partial<AppState>): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
