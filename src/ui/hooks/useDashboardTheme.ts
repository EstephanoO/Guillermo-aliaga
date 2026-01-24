import { useEffect, useState } from "react";
import { DASHBOARD_THEME, type DashboardTheme } from "../../db/constants/dashboard";

export const useDashboardTheme = () => {
  const [theme, setTheme] = useState<DashboardTheme>(DASHBOARD_THEME.DARK);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === DASHBOARD_THEME.DARK) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === DASHBOARD_THEME.DARK
        ? DASHBOARD_THEME.LIGHT
        : DASHBOARD_THEME.DARK,
    );
  };

  return { theme, toggleTheme };
};
