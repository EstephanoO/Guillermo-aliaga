import type { CSSProperties } from "react";
import ChartCard from "./components/ChartCard";

const VOLUNTEER_TYPES = [
  {
    id: "digital",
    label: "Voluntarios digitales",
    value: 22,
    detail: "Comparten y comentan en redes",
    color: "bg-sky-400",
  },
  {
    id: "movilizacion",
    label: "Voluntarios movilización",
    value: 18,
    detail: "Acompañan en campo y activaciones",
    color: "bg-emerald-400",
  },
  {
    id: "casa",
    label: "Voluntarios casa",
    value: 14,
    detail: "Banner en casa / tienda",
    color: "bg-amber-400",
  },
] as const;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const cardStyle: CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
};

export default function VolunteerTypesPanel() {
  const total = VOLUNTEER_TYPES.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title="Voluntarios" subtitle="Clasificación por tipo">
      <div className="grid gap-4 md:grid-cols-3">
        {VOLUNTEER_TYPES.map((item) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={item.id}
              className="rounded-xl border p-3"
              style={cardStyle}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {item.label}
                </p>
                <span className="text-xs font-semibold text-slate-500">
                  {percent}%
                </span>
              </div>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {formatNumber(item.value)}
              </p>
              <p className="text-xs font-semibold text-slate-500">{item.detail}</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-800">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
