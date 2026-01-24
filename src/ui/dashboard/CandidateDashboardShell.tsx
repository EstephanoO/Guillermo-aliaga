"use client";

import type { ReactNode } from "react";
import { useDashboardTheme } from "../hooks/useDashboardTheme";

type CandidateDashboardShellProps = {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
};

export default function CandidateDashboardShell({
  children,
  header,
  sidebar,
}: CandidateDashboardShellProps) {
  useDashboardTheme();

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-1)" }}
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex min-h-screen flex-1 flex-col">
          <header
            className="flex h-16 items-center border-b px-6"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {header}
          </header>
          <div className="min-h-0 flex-1">{children}</div>
        </div>
        <aside
          className="w-full border-t lg:w-[320px] lg:border-l lg:border-t-0"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="h-full p-6">{sidebar}</div>
        </aside>
      </div>
    </main>
  );
}
