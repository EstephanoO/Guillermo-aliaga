"use client";

import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import ThemeToggleButton from "./ThemeToggleButton";
import CandidateHeader, { type CandidateHeaderProps } from "./CandidateHeader";
import { useDashboardTheme } from "../hooks/useDashboardTheme";

type CandidateDashboardPageProps = CandidateHeaderProps & {
  children: ReactNode;
};

export default function CandidateDashboardPage({
  children,
  ...headerProps
}: CandidateDashboardPageProps) {
  const { theme, toggleTheme } = useDashboardTheme();

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-1)" }}
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="order-1 flex-1">
          <CandidateHeader {...headerProps} />
          {children}
        </div>
        <DashboardSidebar summaryCards={[]} />
      </div>
      <ThemeToggleButton theme={theme} onToggle={toggleTheme} />
    </main>
  );
}
