import type { CSSProperties } from "react";
import ChartCard from "./components/ChartCard";

const FORMS = [
  {
    id: "form-digital",
    name: "Formulario digital principal",
    leads: 620,
    date: "21 Ene 2026",
    source: "Landing Oficial",
  },
  {
    id: "form-territorial",
    name: "Formulario territorial",
    leads: 410,
    date: "20 Ene 2026",
    source: "Eventos de barrio",
  },
  {
    id: "form-voluntarios",
    name: "Formulario voluntarios",
    leads: 290,
    date: "19 Ene 2026",
    source: "Instagram Bio",
  },
] as const;

const WHATSAPP_STATS = [
  { id: "conversaciones", label: "Conversaciones iniciadas", value: 150 },
  { id: "nuevos", label: "Contactos etiquetados", value: 92 },
  { id: "pendientes", label: "Pendientes de clasificación", value: 36 },
] as const;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const cardStyle: CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
};

export default function DataCapturePanel() {
  return (
    <ChartCard title="WhatsApp y formularios" subtitle="Captura de datos">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Datos por formularios
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Total leads: {formatNumber(FORMS.reduce((sum, item) => sum + item.leads, 0))}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                <tr>
                  <th className="pb-2">Formulario</th>
                  <th className="pb-2">Leads</th>
                  <th className="pb-2">Fecha</th>
                  <th className="pb-2">Fuente</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300">
                {FORMS.map((form) => (
                  <tr key={form.id} className="border-t border-slate-200/60 dark:border-slate-800">
                    <td className="py-2 pr-2 font-semibold text-slate-900 dark:text-slate-100">
                      {form.name}
                    </td>
                    <td className="py-2 pr-2">{formatNumber(form.leads)}</td>
                    <td className="py-2 pr-2">{form.date}</td>
                    <td className="py-2">{form.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Datos por WhatsApp
          </p>
          <div className="mt-4 space-y-3">
            {WHATSAPP_STATS.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
                style={cardStyle}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {stat.label}
                </span>
                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {formatNumber(stat.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
