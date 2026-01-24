import {
  DASHBOARD_THEME,
  type DashboardTheme,
} from "../../db/constants/dashboard";

interface ThemeToggleButtonProps {
  theme: DashboardTheme;
  onToggle: () => void;
}

export default function ThemeToggleButton({
  theme,
  onToggle,
}: ThemeToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-6 right-6 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] p-3 text-[color:var(--text-2)] shadow-[0_20px_40px_-26px_rgba(15,23,42,0.25)] transition hover:border-[color:var(--text-2)] dark:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)]"
      aria-label={
        theme === DASHBOARD_THEME.DARK
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      aria-pressed={theme === DASHBOARD_THEME.DARK}
    >
      {theme === DASHBOARD_THEME.DARK ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M12 4.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 1 1 0 1.5h-.5A.75.75 0 0 1 12 4.75Zm0 14a.75.75 0 0 1 .75-.75h.5a.75.75 0 1 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm7.25-6a.75.75 0 0 1 .75-.75v-.5a.75.75 0 1 1 1.5 0v.5a.75.75 0 0 1-.75.75Zm-14 0a.75.75 0 0 1 .75-.75v-.5a.75.75 0 1 1 1.5 0v.5a.75.75 0 0 1-.75.75Zm10.8-5.55a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06ZM6.24 15.76a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06Zm11.17 1.41a.75.75 0 0 1-1.06 0l-.35-.35a.75.75 0 1 1 1.06-1.06l.35.35a.75.75 0 0 1 0 1.06ZM7.65 7.65a.75.75 0 0 1-1.06 0l-.35-.35a.75.75 0 0 1 1.06-1.06l.35.35a.75.75 0 0 1 0 1.06ZM12 7.25A4.75 4.75 0 1 1 7.25 12 4.76 4.76 0 0 1 12 7.25Z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M14.5 2.5a9.5 9.5 0 1 0 7 16.09.75.75 0 0 0-.78-1.23 8 8 0 0 1-10.82-10.82.75.75 0 0 0-1.23-.78A9.48 9.48 0 0 0 14.5 2.5Z" />
        </svg>
      )}
    </button>
  );
}
