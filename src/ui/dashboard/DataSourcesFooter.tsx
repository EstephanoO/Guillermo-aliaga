import type { CSSProperties } from "react";

const SOURCES = [
  "Facebook scrapeo (guardado en BD)",
  "Reporte de Ads",
  "Excel formularios",
  "WhatsApp etiquetas/manual",
] as const;

const cardStyle: CSSProperties = {
  backgroundColor: "var(--card)",
  borderColor: "var(--border)",
};

export default function DataSourcesFooter() {
  return (
    <div className="rounded-xl border p-3" style={cardStyle}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Fuente de datos
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {SOURCES.map((source) => (
              <li key={source} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border px-3 py-2" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Observación
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Costo scrapeo referencial: S/ 2.00
          </p>
        </div>
      </div>
    </div>
  );
}
