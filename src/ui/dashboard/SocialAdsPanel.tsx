import type { CSSProperties } from "react";
import ChartCard from "./components/ChartCard";

const FOLLOWERS = [
  {
    id: "facebook",
    label: "Facebook",
    total: 31000,
    delta: "+420 últimos 7 días",
  },
  {
    id: "instagram",
    label: "Instagram",
    total: 18500,
    delta: "+260 últimos 7 días",
  },
] as const;

const ADS_RESULTS = [
  { id: "likes", label: "Me gusta", value: 4820 },
  { id: "comentarios", label: "Comentarios", value: 620 },
  { id: "compartidos", label: "Compartidos", value: 940 },
  { id: "vistas", label: "Vistas", value: 18200 },
  { id: "clics", label: "Clics", value: 1280 },
] as const;

const SENTIMENT = [
  { id: "positivo", label: "Positivo", value: 72, color: "bg-emerald-400" },
  { id: "neutral", label: "Neutral", value: 18, color: "bg-amber-400" },
  { id: "negativo", label: "Negativo", value: 10, color: "bg-rose-400" },
] as const;

const TOPICS = [
  "Transporte y movilidad",
  "Seguridad ciudadana",
  "Empleo juvenil",
] as const;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const cardStyle: CSSProperties = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
};

export default function SocialAdsPanel() {
  return (
    <ChartCard title="Redes y pauta" subtitle="Facebook, Instagram y sentimiento">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Seguidores y crecimiento
          </p>
          <div className="mt-3 space-y-3">
            {FOLLOWERS.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
                style={cardStyle}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatNumber(item.total)} seguidores
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600">
                  {item.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Publicidad (Ads)
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Inversión total: S/ 18,959.82
          </p>
          <div className="mt-3 space-y-2">
            {ADS_RESULTS.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
                style={cardStyle}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatNumber(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-3" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            IA - sentimiento
          </p>
          <div className="mt-3 space-y-3">
            {SENTIMENT.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="uppercase tracking-[0.2em]">{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-800">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border px-3 py-2" style={cardStyle}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Top temas
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {TOPICS.map((topic) => (
                <li key={topic} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
