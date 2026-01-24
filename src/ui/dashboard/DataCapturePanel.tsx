import type { CSSProperties } from "react";
import { CONTACTOS_FORMULARIOS, WHATSAPP_STATS } from "../../db/constants/dashboard";
import ChartCard from "./components/ChartCard";

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
            Total leads: {formatNumber(CONTACTOS_FORMULARIOS.reduce((sum, item) => sum + item.leads, 0))}
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
                {CONTACTOS_FORMULARIOS.map((form) => (
                  <tr key={form.id} className="border-t border-slate-200/60 dark:border-slate-800">
                    <td className="py-2 pr-2 font-semibold text-slate-900 dark:text-slate-100">
                      {form.name}
                    </td>
                    <td className="py-2 pr-2">{formatNumber(form.leads)}</td>
                    <td className="py-2 pr-2">{form.dateLabel}</td>
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
