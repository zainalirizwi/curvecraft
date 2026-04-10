/**
 * Generate a lightweight unique ID (not cryptographically secure, fine for local IDs)
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Round a number to a fixed number of decimal places, returning 0 if NaN.
 */
export function safeRound(value: number, decimals = 2): number {
  if (!isFinite(value) || isNaN(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format a GPA / CGPA number for display, always showing 2 decimal places.
 */
export function formatGPA(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  return value.toFixed(2);
}

/**
 * Merge class names (simple utility, no clsx dependency needed).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
