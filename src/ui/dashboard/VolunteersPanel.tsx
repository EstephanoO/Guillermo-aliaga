"use client";

import { volunteerGoal, volunteerPie } from "../../db/dashboardData";
import ChartCard from "./components/ChartCard";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function VolunteersPanel() {
  const total = volunteerPie.reduce((sum, item) => sum + item.value, 0);
  const percent = Math.min(100, Math.round((total / volunteerGoal) * 100));

  return (
    <ChartCard title="Voluntarios" subtitle={`Total ${formatNumber(total)}`}>
      <div className="space-y-3">
        {volunteerPie.map((entry) => {
          const entryPercent = total > 0 ? (entry.value / total) * 100 : 0;
          return (
            <div key={entry.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[color:var(--text-2)]">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="uppercase tracking-[0.22em]">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[color:var(--text-1)]">
                  {formatNumber(entry.value)}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${entryPercent}%`, backgroundColor: entry.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[color:var(--text-2)]">
          <span>Meta voluntarios</span>
          <div className="flex items-center gap-2">
            <span>
              {formatNumber(total)} / {formatNumber(volunteerGoal)}
            </span>
            <span className="rounded-full bg-[color:var(--surface-strong)] px-3 py-1 text-[11px] font-semibold text-[color:var(--text-1)]">
              {percent}%
            </span>
          </div>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </ChartCard>
  );
}
