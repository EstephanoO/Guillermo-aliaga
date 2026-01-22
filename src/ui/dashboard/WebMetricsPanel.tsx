"use client";

import { responseRate, webPie } from "../../db/dashboardData";
import ChartCard from "./components/ChartCard";
import StackedBarCard from "./components/StackedBarCard";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function WebMetricsPanel() {
  const total = webPie.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title="Web" subtitle={`Total ${formatNumber(total)} contactos`}>
      <StackedBarCard items={webPie} total={total} />
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
        <span>Tasa de respuesta</span>
        <span className="text-base font-semibold text-[color:var(--text-1)]">
          {responseRate}%
        </span>
      </div>
    </ChartCard>
  );
}
