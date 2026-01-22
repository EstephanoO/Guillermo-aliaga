import type { CSSProperties } from "react";

const KPI_TONES = {
  sky: {
    badge: "bg-slate-200 text-slate-700",
    dot: "bg-slate-500",
  },
  emerald: {
    badge: "bg-teal-200 text-teal-700",
    dot: "bg-teal-500",
  },
  amber: {
    badge: "bg-amber-200 text-amber-700",
    dot: "bg-amber-500",
  },
  rose: {
    badge: "bg-rose-200 text-rose-700",
    dot: "bg-rose-500",
  },
  violet: {
    badge: "bg-indigo-200 text-indigo-700",
    dot: "bg-indigo-500",
  },
  slate: {
    badge: "bg-slate-200 text-slate-700",
    dot: "bg-slate-500",
  },
} as const;

type KpiTone = keyof typeof KPI_TONES;

type KpiItem = {
  id: string;
  label: string;
  value: number;
  detail: string;
  delta: string;
  tone: KpiTone;
};

const KPI_ITEMS: KpiItem[] = [
  {
    id: "digital",
    label: "Datos digitales",
    value: 1320,
    detail: "Nombre + WhatsApp",
    delta: "+18% vs semana",
    tone: "sky",
  },
  {
    id: "territorial",
    label: "Datos territoriales",
    value: 860,
    detail: "Base de campo",
    delta: "+9% vs semana",
    tone: "emerald",
  },
  {
    id: "total",
    label: "Datos recolectados",
    value: 2180,
    detail: "Digital + Territorial",
    delta: "+12% vs semana",
    tone: "amber",
  },
  {
    id: "contactados",
    label: "Datos contactados",
    value: 120,
    detail: "5% vs recolectados",
    delta: "Foco en calidad",
    tone: "rose",
  },
  {
    id: "confirmados",
    label: "Datos confirmados",
    value: 20,
    detail: "5% vs contactados",
    delta: "Embudo crítico",
    tone: "violet",
  },
  {
    id: "voluntarios",
    label: "Voluntarios reales",
    value: 54,
    detail: "2.5% del total",
    delta: "+6 vs semana",
    tone: "slate",
  },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const cardStyle: CSSProperties = {
  backgroundColor: "var(--card)",
  borderColor: "var(--border)",
};

export default function PrimaryKpis() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {KPI_ITEMS.map((item) => {
        const tone = KPI_TONES[item.tone];
        return (
            <div
              key={item.id}
              className="rounded-xl border p-3 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.3)]"
              style={cardStyle}
            >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {item.label}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${tone.badge}`}
              >
                {item.delta}
              </span>
            </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {formatNumber(item.value)}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {item.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
