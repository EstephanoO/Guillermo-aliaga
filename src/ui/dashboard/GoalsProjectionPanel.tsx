import type { CSSProperties } from "react";
import ChartCard from "./components/ChartCard";

const SCENARIOS = [
  { id: "min", label: "Meta mínima", value: 121000 },
  { id: "media", label: "Meta promedio", value: 172000 },
  { id: "max", label: "Meta máxima", value: 302000 },
] as const;

const CONTACTS_PER_VOTE = 45;
const CONTACTS_CURRENT = 2180;
const CONTACTS_TARGET = Math.round(SCENARIOS[0].value / CONTACTS_PER_VOTE);
const CONTACTS_GAP = Math.max(CONTACTS_TARGET - CONTACTS_CURRENT, 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const cardStyle: CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
};

export default function GoalsProjectionPanel() {
  return (
    <ChartCard
      title="Meta electoral y proyección"
      subtitle="Escenarios de votos"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Objetivo general
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {formatNumber(100000)} votos
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Proyección de base para campaña nacional
          </p>
          <div className="mt-4 space-y-2">
            {SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
                style={cardStyle}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {scenario.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatNumber(scenario.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Relación votos / contactos
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            1 contacto validado = {CONTACTS_PER_VOTE} votos proyectados
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Para alcanzar la meta mínima se estiman{" "}
            {formatNumber(CONTACTS_TARGET)}
            contactos calificados.
          </p>
          <div className="mt-4 rounded-lg border px-3 py-2" style={cardStyle}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Brecha actual
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(CONTACTS_GAP)} contactos faltantes
            </p>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
