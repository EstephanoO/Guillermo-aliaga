import type { CSSProperties } from "react";
import ChartCard from "./components/ChartCard";

const FUNNEL_STEPS = [
  { id: "recolectados", label: "Datos recolectados", value: 2180 },
  { id: "contactados", label: "Datos contactados", value: 120 },
  { id: "confirmados", label: "Datos confirmados", value: 20 },
  { id: "voluntarios", label: "Voluntarios activos", value: 54 },
] as const;

const NOTES = [
  "Dato digital: nombre + WhatsApp validado.",
  "Dato territorial: captado en campo con zona registrada.",
  "Confirmación: interacción válida en las últimas 72 hs.",
  "Actualización diaria antes de las 09:30.",
] as const;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const cardStyle: CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
};

export default function DataFunnelPanel() {
  const total = FUNNEL_STEPS[0]?.value ?? 0;

  return (
    <ChartCard
      title="Embudo de datos"
      subtitle="De recolección a voluntariado real"
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {FUNNEL_STEPS.map((step) => {
            const percent = total > 0 ? Math.round((step.value / total) * 100) : 0;
            const width = total > 0 ? Math.max(16, (step.value / total) * 100) : 0;
            return (
              <div
                key={step.id}
                className="rounded-xl border p-3"
                style={cardStyle}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {step.label}
                  </p>
                  <span className="text-xs font-semibold text-slate-500">
                    {percent}% del total
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {formatNumber(step.value)}
                  </p>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-slate-200/70 dark:bg-slate-800">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Notas / reglas
          </p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {NOTES.map((note) => (
              <li key={note} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChartCard>
  );
}
