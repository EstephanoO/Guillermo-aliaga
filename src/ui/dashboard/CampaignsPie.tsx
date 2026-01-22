"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { getTooltipStyles } from "./tooltipStyles";
import LoadingSkeleton from "./components/LoadingSkeleton";
import EmptyState from "./components/EmptyState";

type CampaignsPieProps = {
  csvUrl: string;
  theme: "dark" | "light";
};

type Row = {
  indicador: string;
  gasto: number;
  interacciones: number;
};

type ParsedRow = Record<string, string>;

const colors = {
  "Me gusta": "#38bdf8",
  "Conversación": "#f97316",
  "Conversión": "#f59e0b",
  Tráfico: "#22c55e",
  Alcance: "#94a3b8",
  Otros: "#a855f7",
};

const formatPEN = (value: number) =>
  `S/ ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;

const safeNum = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const hasDot = trimmed.includes(".");
  const hasComma = trimmed.includes(",");
  let normalized = trimmed;

  if (hasDot && hasComma) {
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = trimmed.replace(",", ".");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseCSV = (csvText: string): ParsedRow[] => {
  const rows: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      current.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      current.push(cell);
      cell = "";
      if (current.some((value) => value.length > 0)) rows.push(current);
      current = [];
      continue;
    }

    cell += char;
  }

  current.push(cell);
  if (current.some((value) => value.length > 0)) rows.push(current);

  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((row) => {
    const record: ParsedRow = {};
    headers.forEach((header, index) => {
      record[header] = (row[index] ?? "").trim();
    });
    return record;
  });
};

const mapIndicador = (raw: string) => {
  const value = (raw || "").trim().toLowerCase();
  if (value === "reach") return "Alcance";
  if (value.includes("messaging_conversation_started")) return "Conversación";
  if (value.includes("offsite_conversion") && value.includes("lead"))
    return "Conversión";
  if (value.includes("landing_page_view")) return "Tráfico";
  if (value.includes("link_click")) return "Tráfico";
  if (value.includes("post_engagement")) return "Me gusta";
  if (value === "actions:like") return "Me gusta";
  if (value.includes("rsvp")) return "Me gusta";
  if (value.includes("video_thruplay")) return "Me gusta";
  return "Otros";
};

export default function CampaignsPie({ csvUrl, theme }: CampaignsPieProps) {
  const [raw, setRaw] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState<"gasto" | "interacciones">(
    "interacciones",
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(csvUrl);
        if (!res.ok) throw new Error(`No se pudo cargar CSV: ${res.status}`);
        const text = await res.text();
        if (mounted) setRaw(parseCSV(text));
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error cargando CSV");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [csvUrl]);

  let data: Row[] = [];

  if (raw.length) {
    const gastoKey = "Importe gastado (PEN)";
    const interaccionesKey = "Resultados";
    const indicadorKey = "Indicador de resultado";
    const agg = new Map<string, { gasto: number; interacciones: number }>();

    raw.forEach((row) => {
      const indicador = mapIndicador(row[indicadorKey]);
      const gasto = safeNum(row[gastoKey] ?? "0");
      const interacciones = safeNum(row[interaccionesKey] ?? "0");
      const prev = agg.get(indicador) ?? { gasto: 0, interacciones: 0 };
      agg.set(indicador, {
        gasto: prev.gasto + gasto,
        interacciones: prev.interacciones + interacciones,
      });
    });

    data = Array.from(agg.entries()).map(([indicador, values]) => ({
      indicador,
      gasto: values.gasto,
      interacciones: values.interacciones,
    }));
  }

  const totalInteracciones = data.reduce(
    (sum, row) => sum + row.interacciones,
    0,
  );
  const totalGasto = data.reduce((sum, row) => sum + row.gasto, 0);
  const indicatorData = data.map((row) => ({
    ...row,
    pctGasto: totalGasto > 0 ? row.gasto / totalGasto : 0,
    pctInteracciones:
      totalInteracciones > 0 ? row.interacciones / totalInteracciones : 0,
  }));
  const isDark = theme === "dark";
  const tooltipStyles = getTooltipStyles(isDark);

  const metricKey = metric === "gasto" ? "gasto" : "interacciones";
  const activeTextColor = "var(--card)";
  const activeBgColor = "var(--text-1)";
  const idleTextColor = "var(--text-2)";

  return (
    <section className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.18)] lg:max-w-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--text-1)]">
              Resumen de pauta
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <LoadingSkeleton lines={5} />
              </div>
              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <LoadingSkeleton lines={5} />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-base font-semibold text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          ) : data.length === 0 ? (
            <EmptyState
              title="No hay datos de campañas"
              action="Revisa el CSV o carga un nuevo archivo para ver el mix."
            />
          ) : (
            <>
              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-2)]">
                    Distribución
                  </p>
                  <div className="flex items-center gap-2">
                    {([
                      { key: "gasto", label: "% gasto" },
                      { key: "interacciones", label: "% interacciones" },
                    ] as const).map((item) => {
                      const isActive = metric === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setMetric(item.key)}
                          className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{
                            borderColor: "var(--border)",
                            backgroundColor: isActive ? activeBgColor : "transparent",
                            color: isActive ? activeTextColor : idleTextColor,
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-2)]">
                      Inversión total
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[color:var(--text-1)]">
                      {formatPEN(14346.11)}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-2)]">
                      Interacciones
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[color:var(--text-1)]">
                      {new Intl.NumberFormat("en-US").format(735920)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={indicatorData}
                        dataKey={metricKey}
                        nameKey="indicador"
                        innerRadius={58}
                        outerRadius={92}
                        paddingAngle={2}
                        stroke="transparent"
                      >
                        {indicatorData.map((entry) => (
                          <Cell
                            key={entry.indicador}
                            fill={colors[entry.indicador as keyof typeof colors]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          new Intl.NumberFormat("en-US").format(Number(value)),
                          name,
                        ]}
                        contentStyle={tooltipStyles}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {indicatorData.map((row) => (
                    <div
                      key={row.indicador}
                      className="flex items-center justify-between text-xs font-semibold text-[color:var(--text-2)]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              colors[row.indicador as keyof typeof colors],
                          }}
                        />
                        <span>{row.indicador}</span>
                      </div>
                      <span className="text-[color:var(--text-1)]">
                        {(
                          (metric === "gasto" ? row.pctGasto : row.pctInteracciones) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
    </section>
  );
}
