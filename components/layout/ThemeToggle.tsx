"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function ThemeToggle() {
  const { state, dispatch } = useApp();

  const options: Array<{ value: "light" | "dark" | "system"; icon: typeof Sun; label: string }> = [
    { value: "light",  icon: Sun,     label: "Light" },
    { value: "dark",   icon: Moon,    label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div
      className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/80 p-0.5 gap-0.5"
      role="group"
      aria-label="Color theme"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => dispatch({ type: "SET_THEME", payload: value })}
          className={
            state.theme === value
              ? "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm transition-all"
              : "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          }
          aria-pressed={state.theme === value}
          aria-label={`${label} mode`}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
