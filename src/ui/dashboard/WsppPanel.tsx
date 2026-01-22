import { useState } from "react";
import WsppChart from "../chart1";
import { wspOverview, wspTotals } from "../../db/dashboardData";
import ChartCard from "./components/ChartCard";
import FilterBar from "./components/FilterBar";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

type WsppPanelProps = {
  theme: "dark" | "light";
};

export default function WsppPanel({ theme }: WsppPanelProps) {
  const [view, setView] = useState<"all" | "net" | "started" | "unfollowed">(
    "all",
  );

  return (
    <ChartCard
      title="Canal de WSP"
      action={
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
          Ultimos 30 dias
        </span>
      }
    >
      <div className="grid gap-3 sm:grid-cols-4">
        {wspOverview.map((item) => (
          <div
            key={item.label}
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[color:var(--text-1)]">
              {item.prefix ?? ""}
              {formatNumber(item.value)}
              {item.suffix ?? ""}
            </p>
            {item.detail ? (
              <p className="text-[10px] font-semibold text-[color:var(--text-2)]">
                {item.detail}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-2)]">
              Crecimiento neto
            </p>
            <p className="mt-1 text-3xl font-semibold text-[color:var(--text-1)]">
              +{formatNumber(wspTotals.netNew)}
            </p>
            <p className="text-xs font-semibold text-[color:var(--text-2)]">
              30 dias
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs font-semibold text-[color:var(--text-2)]">
            <span>Entraron: {formatNumber(wspTotals.startedFollowing)}</span>
            <span>Salieron: {formatNumber(wspTotals.unfollowed)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-2)]">
            Tendencia diaria
          </p>
          <FilterBar
            value={view}
            options={[
              { id: "all", label: "Todo" },
              { id: "net", label: "Neto" },
              { id: "started", label: "Entraron" },
              { id: "unfollowed", label: "Salieron" },
            ]}
            onChange={setView}
          />
        </div>
        <div className="mt-3">
          <WsppChart theme={theme} view={view} />
        </div>
      </div>
    </ChartCard>
  );
}
