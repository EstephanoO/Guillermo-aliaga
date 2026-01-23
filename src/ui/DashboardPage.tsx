"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import CampaignsPie from "./dashboard/CampaignsPie";
import GuillermoMap, { type MapData } from "./dashboard/GuillermoMap";
import { csvUrl } from "../db/dashboardData";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
const formatPercent = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
const formatRatioPercent = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
const formatSeconds = (value: number) =>
  `${new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 1,
  }).format(value)} s`;

type DailyPoint = {
  dateKey: string;
  reach: number;
  interactions: number;
  trend?: number;
};

type FacebookPost = {
  time: string;
  comments?: number;
  likes?: number;
  shares?: number;
  viewsCount?: number;
};

interface PanoramaSummary {
  usuariosActivos: number;
  usuariosNuevos: number;
  tiempoInteraccion: number;
  eventos: number;
}

interface PanoramaPage {
  titulo: string;
  vistas: number;
  usuarios: number;
  eventos: number;
  rebote: number;
}

interface PanoramaSource {
  fuente: string;
  usuarios: number;
}

interface PanoramaSessionSource {
  fuente: string;
  sesiones: number;
}

interface PanoramaDaySeries {
  dayIndex: number;
  dayLabel: string;
  nuevos: number;
  recurrentes: number;
}

interface PanoramaCity {
  ciudad: string;
  usuarios: number;
}

interface PanoramaData {
  summary: PanoramaSummary | null;
  pages: PanoramaPage[];
  userSources: PanoramaSource[];
  sessionSources: PanoramaSessionSource[];
  daySeries: PanoramaDaySeries[];
  cities: PanoramaCity[];
}

interface SummaryCard {
  label: string;
  value: number;
  format: SummaryFormat;
}

interface PanoramaPageChart extends PanoramaPage {
  tituloCorto: string;
}

interface PanoramaSourceChart extends PanoramaSource {
  fuenteCorta: string;
}

const PANORAMA_SECTION = {
  SUMMARY: "summary",
  PAGES: "pages",
  USER_SOURCES: "user_sources",
  SESSION_SOURCES: "session_sources",
  DAY: "day",
  PLATFORM: "platform",
  CITIES: "cities",
  AUDIENCE: "audience",
} as const;

const SUMMARY_FORMAT = {
  NUMBER: "number",
  SECONDS: "seconds",
} as const;

type PanoramaSection = (typeof PANORAMA_SECTION)[keyof typeof PANORAMA_SECTION];
type SummaryFormat = (typeof SUMMARY_FORMAT)[keyof typeof SUMMARY_FORMAT];

const formatShortDate = (date: Date) =>
  date
    .toLocaleDateString("es-PE", { day: "2-digit", month: "short" })
    .replace(".", "");

const formatDate = (date: Date) =>
  date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const parseNumber = (value: string) => {
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

const parseCSVRows = (csvText: string): string[][] => {
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
  return rows;
};

const parsePanoramaCSV = (csvText: string): PanoramaData => {
  const rows = parseCSVRows(csvText);
  const data: PanoramaData = {
    summary: null,
    pages: [],
    userSources: [],
    sessionSources: [],
    daySeries: [],
    cities: [],
  };
  let section: PanoramaSection | null = null;

  rows.forEach((rawRow) => {
    const row = rawRow.map((value) => value.trim());
    const first = row[0] ?? "";
    if (!first || first.startsWith("#")) return;

    if (first === "Usuarios activos" && row[1] === "Usuarios nuevos") {
      section = PANORAMA_SECTION.SUMMARY;
      return;
    }
    if (first === "Título de página y clase de pantalla") {
      section = PANORAMA_SECTION.PAGES;
      return;
    }
    if (first === "Primera fuente/medio del usuario") {
      section = PANORAMA_SECTION.USER_SOURCES;
      return;
    }
    if (first === "Fuente/medio de la sesión") {
      section = PANORAMA_SECTION.SESSION_SOURCES;
      return;
    }
    if (first.startsWith("Día")) {
      section = PANORAMA_SECTION.DAY;
      return;
    }
    if (first === "Plataforma") {
      section = PANORAMA_SECTION.PLATFORM;
      return;
    }
    if (first === "Ciudad") {
      section = PANORAMA_SECTION.CITIES;
      return;
    }
    if (first === "Nombre de la audiencia") {
      section = PANORAMA_SECTION.AUDIENCE;
      return;
    }

    if (section === PANORAMA_SECTION.SUMMARY) {
      data.summary = {
        usuariosActivos: parseNumber(row[0] ?? "0"),
        usuariosNuevos: parseNumber(row[1] ?? "0"),
        tiempoInteraccion: parseNumber(row[2] ?? "0"),
        eventos: parseNumber(row[3] ?? "0"),
      };
      section = null;
      return;
    }

    if (section === PANORAMA_SECTION.PAGES) {
      if (row.length < 5) return;
      data.pages.push({
        titulo: row[0] ?? "",
        vistas: parseNumber(row[1] ?? "0"),
        usuarios: parseNumber(row[2] ?? "0"),
        eventos: parseNumber(row[3] ?? "0"),
        rebote: parseNumber(row[4] ?? "0"),
      });
      return;
    }

    if (section === PANORAMA_SECTION.USER_SOURCES) {
      if (row.length < 2) return;
      data.userSources.push({
        fuente: row[0] ?? "",
        usuarios: parseNumber(row[1] ?? "0"),
      });
      return;
    }

    if (section === PANORAMA_SECTION.SESSION_SOURCES) {
      if (row.length < 2) return;
      data.sessionSources.push({
        fuente: row[0] ?? "",
        sesiones: parseNumber(row[1] ?? "0"),
      });
      return;
    }

    if (section === PANORAMA_SECTION.DAY) {
      if (row.length < 3) return;
      const dayIndex = Number(row[0]);
      if (!Number.isFinite(dayIndex)) return;
      data.daySeries.push({
        dayIndex,
        dayLabel: `D${dayIndex}`,
        nuevos: parseNumber(row[1] ?? "0"),
        recurrentes: parseNumber(row[2] ?? "0"),
      });
      return;
    }

    if (section === PANORAMA_SECTION.CITIES) {
      if (row.length < 2) return;
      data.cities.push({
        ciudad: row[0] ?? "",
        usuarios: parseNumber(row[1] ?? "0"),
      });
    }
  });

  return data;
};

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
};

const calculateAverageReach = (series: DailyPoint[]) => {
  if (!series.length) return 0;
  const total = series.reduce((sum, item) => sum + item.reach, 0);
  return total / series.length;
};

const calculateTrendSeries = (series: DailyPoint[]) => {
  if (!series.length) return [];
  if (series.length === 1) return [{ ...series[0], trend: series[0].reach }];
  const total = series.reduce(
    (acc, item, index) => {
      acc.sumX += index;
      acc.sumY += item.reach;
      acc.sumXY += index * item.reach;
      acc.sumXX += index * index;
      return acc;
    },
    { sumX: 0, sumY: 0, sumXY: 0, sumXX: 0 },
  );
  const count = series.length;
  const denominator = count * total.sumXX - total.sumX * total.sumX;
  const slope =
    denominator === 0
      ? 0
      : (count * total.sumXY - total.sumX * total.sumY) / denominator;
  const intercept = (total.sumY - slope * total.sumX) / count;
  return series.map((item, index) => ({
    ...item,
    trend: slope * index + intercept,
  }));
};

export default function DashboardPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [dailySeries, setDailySeries] = useState<DailyPoint[]>([]);
  const [panoramaData, setPanoramaData] = useState<PanoramaData>({
    summary: null,
    pages: [],
    userSources: [],
    sessionSources: [],
    daySeries: [],
    cities: [],
  });
  const [panoramaError, setPanoramaError] = useState<string | null>(null);
  const [panoramaLoading, setPanoramaLoading] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const trendStroke = theme === "dark" ? "#f8fafc" : "#0f172a";

  const handleToggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPanoramaLoading(true);
        setPanoramaError(null);
        const res = await fetch(encodeURI("/Informe_panorámico.csv"));
        if (!res.ok) throw new Error("No se pudo cargar el informe panorámico");
        const text = await res.text();
        const parsed = parsePanoramaCSV(text);
        if (mounted) setPanoramaData(parsed);
      } catch (err) {
        if (mounted) {
          setPanoramaError(
            err instanceof Error ? err.message : "Error cargando informe",
          );
          setPanoramaData({
            summary: null,
            pages: [],
            userSources: [],
            sessionSources: [],
            daySeries: [],
            cities: [],
          });
        }
      } finally {
        if (mounted) setPanoramaLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(
          "/dataset_facebook-posts-scraper_2026-01-21_18-02-27-654.json",
        );
        if (!res.ok) throw new Error("Dataset no disponible");
        const posts = (await res.json()) as FacebookPost[];
        const dailyMap = new Map<string, DailyPoint>();
        posts.forEach((post) => {
          const date = new Date(post.time);
          if (Number.isNaN(date.getTime())) return;
          const key = date.toISOString().slice(0, 10);
          const reach = post.viewsCount ?? 0;
          const interactions =
            (post.likes ?? 0) + (post.comments ?? 0) + (post.shares ?? 0);
          const existing = dailyMap.get(key) ?? {
            dateKey: key,
            reach: 0,
            interactions: 0,
          };
          existing.reach += reach;
          existing.interactions += interactions;
          dailyMap.set(key, existing);
        });
        const sortedSeries = Array.from(dailyMap.values())
          .filter((item) => item.dateKey >= "2025-01-01")
          .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
        if (mounted) setDailySeries(sortedSeries);
      } catch {
        if (mounted) setDailySeries([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadMap = async () => {
      try {
        const datasets = [
          "departamentos",
          "registros_actividades",
          "registros_votantes",
          "registros_paneles",
        ] as const;
        const [departamentos, actividades, votantes, paneles] =
          await Promise.all(
            datasets.map(async (name) => {
              const response = await fetch(`/mapa-guillermo/${name}.geojson`);
              if (!response.ok) {
                throw new Error("No se pudo cargar los datos del mapa.");
              }
              return (await response.json()) as MapData["departamentos"];
            }),
          );
        if (!mounted) return;
        setMapData({ departamentos, actividades, votantes, paneles });
      } catch (err) {
        if (!mounted) return;
        setMapError(err instanceof Error ? err.message : "Error cargando mapa");
      }
    };

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  const reachPeak = dailySeries.reduce<DailyPoint | null>((current, item) => {
    if (!current || item.reach > current.reach) return item;
    return current;
  }, null);
  const trendSeries = calculateTrendSeries(dailySeries);
  const totalInteractionsDisplay = 23251;
  const cutoffDate = "2025-11-24";
  const beforeSeries = dailySeries.filter((item) => item.dateKey < cutoffDate);
  const afterSeries = dailySeries.filter((item) => item.dateKey >= cutoffDate);
  const beforeAverage = calculateAverageReach(beforeSeries);
  const afterAverage = calculateAverageReach(afterSeries);
  const totalAverage = beforeAverage + afterAverage;
  const growthSeries = [
    {
      id: "before",
      label: "Antes 24 Nov",
      value: totalAverage > 0 ? (beforeAverage / totalAverage) * 100 : 0,
    },
    {
      id: "after",
      label: "Después 24 Nov",
      value: totalAverage > 0 ? (afterAverage / totalAverage) * 100 : 0,
    },
  ];

  const datosTotal = 4071;
  const datos = { digital: 4071, territorial: 0 };
  const contactados = { digital: 4071, territorial: 0 };
  const voluntarios = [
    { id: "digital", label: "Digital", value: 50 },
    { id: "movimiento", label: "Movimiento", value: 50 },
    { id: "casa", label: "Casa", value: 50 },
  ];
  const voluntariosTotal = 150;
  const whatsappFollowers = 1206;
  const followersBefore = 11236;
  const followersNow = 31232;
  const temasClave = [
    {
      label:
        "Apoyo político y consignas partidarias (Somos Perú / a paso de vencedores)",
      value: 38,
    },
    {
      label: "Presencia territorial y respaldo regional (Loreto / Iquitos)",
      value: 15,
    },
    { label: "Felicitaciones, motivación y ánimo al candidato", value: 12 },
  ];
  const sentimentData = [
    { id: "positivo", label: "Positivo", value: 72, color: "#22c55e" },
    { id: "neutral", label: "Neutral", value: 18, color: "#38bdf8" },
    { id: "negativo", label: "Negativo", value: 8, color: "#f97316" },
    { id: "mixto", label: "Mixto", value: 2, color: "#a855f7" },
  ];
  const sentimentStack = [
    {
      name: "Sentimiento",
      positivo: sentimentData[0].value,
      neutral: sentimentData[1].value,
      negativo: sentimentData[2].value,
      mixto: sentimentData[3].value,
    },
  ];

  const summaryCards: SummaryCard[] = panoramaData.summary
    ? [
        {
          label: "Usuarios activos",
          value: panoramaData.summary.usuariosActivos,
          format: SUMMARY_FORMAT.NUMBER,
        },
        {
          label: "Usuarios nuevos",
          value: panoramaData.summary.usuariosNuevos,
          format: SUMMARY_FORMAT.NUMBER,
        },
        {
          label: "Tiempo medio de interacción",
          value: panoramaData.summary.tiempoInteraccion,
          format: SUMMARY_FORMAT.SECONDS,
        },
        {
          label: "Eventos",
          value: panoramaData.summary.eventos,
          format: SUMMARY_FORMAT.NUMBER,
        },
      ]
    : [];
  const topPages: PanoramaPageChart[] = panoramaData.pages
    .slice()
    .sort((a, b) => b.vistas - a.vistas)
    .slice(0, 6)
    .map((page) => ({
      ...page,
      tituloCorto: truncateText(page.titulo, 42),
    }));
  const topSources: PanoramaSourceChart[] = panoramaData.userSources
    .slice()
    .sort((a, b) => b.usuarios - a.usuarios)
    .slice(0, 6)
    .map((source) => ({
      ...source,
      fuenteCorta: truncateText(source.fuente, 26),
    }));
  const daySeries = panoramaData.daySeries
    .slice()
    .sort((a, b) => a.dayIndex - b.dayIndex);
  const topCities = panoramaData.cities
    .slice()
    .sort((a, b) => b.usuarios - a.usuarios)
    .slice(0, 6);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--text-1)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="order-1 flex-1">
          <DashboardHeader />
          <div className="w-full px-4 pb-12 pt-6 md:px-6">
            <div className="mb-6">
              <GuillermoMap data={mapData} error={mapError} />
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div
                className="w-full rounded-xl border border-l-4 p-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderLeftColor: "#2563eb",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "var(--text-1)" }}
                    >
                      Evolución de alcance
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Línea diaria de alcance e interacciones orgánicas
                    </p>
                    <p
                      className="mt-2 text-xs font-semibold"
                      style={{ color: "var(--text-2)" }}
                    >
                      Total interacciones orgánicas{" "}
                      {formatNumber(totalInteractionsDisplay)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-[0.22em]">
                  <span
                    className="flex items-center gap-2"
                    style={{ color: "var(--text-2)" }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: "#2563eb" }}
                    />
                    Alcance
                  </span>
                  <span
                    className="flex items-center gap-2"
                    style={{ color: "var(--text-2)" }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: "#f97316" }}
                    />
                    Interacciones
                  </span>
                  <span
                    className="flex items-center gap-2"
                    style={{ color: "var(--text-2)" }}
                  >
                    <span
                      className="h-0 w-6 border-t-2 border-dashed"
                      style={{ borderColor: trendStroke }}
                    />
                    Tendencia
                  </span>
                </div>
                <div className="mt-3 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendSeries}
                      margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="reachFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity={0.45}
                          />
                          <stop
                            offset="100%"
                            stopColor="#2563eb"
                            stopOpacity={0.04}
                          />
                        </linearGradient>
                        <linearGradient
                          id="interactionFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#f97316"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f97316"
                            stopOpacity={0.04}
                          />
                        </linearGradient>
                        <filter
                          id="trendGlow"
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%"
                        >
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(37, 99, 235, 0.18)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="dateKey"
                        tickFormatter={(value) =>
                          formatShortDate(new Date(value))
                        }
                        tick={{ fontSize: 11, fill: "#5b6472" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#5b6472" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ stroke: "#2f6fb8", strokeOpacity: 0.2 }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "#d0d4dc",
                          background: "#ffffff",
                        }}
                        formatter={(value) => formatNumber(Number(value ?? 0))}
                        labelFormatter={(label) => formatDate(new Date(label))}
                      />
                      <Area
                        type="monotone"
                        dataKey="reach"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="url(#reachFill)"
                        name="Alcance"
                      />
                      <Area
                        type="monotone"
                        dataKey="interactions"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        fill="url(#interactionFill)"
                        name="Interacciones"
                      />
                      <Line
                        type="monotone"
                        dataKey="trend"
                        stroke={trendStroke}
                        strokeWidth={2.2}
                        strokeOpacity={0.95}
                        dot={false}
                        strokeDasharray="4 4"
                        name="Tendencia de alcance"
                        filter={
                          theme === "dark" ? "url(#trendGlow)" : undefined
                        }
                      />
                      {reachPeak ? (
                        <ReferenceDot
                          x={reachPeak.dateKey}
                          y={reachPeak.reach}
                          r={5}
                          fill="#2563eb"
                          stroke="#1d4ed8"
                          label={{
                            value: "Pico",
                            position: "top",
                            fill: "#1d4ed8",
                            fontSize: 11,
                          }}
                        />
                      ) : null}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div
                className="w-full rounded-xl border border-l-4 p-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderLeftColor: "#38bdf8",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "var(--text-1)" }}
                    >
                      Promedio de alcance por publicación
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Antes vs después del 24 de noviembre
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--text-2)" }}
                    >
                      Base: porcentaje del promedio total de alcance
                    </p>
                  </div>
                  <span
                    className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--text-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    24 Nov
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  <span style={{ color: "var(--text-2)" }}>
                    Antes{" "}
                    <span style={{ color: "var(--text-1)" }}>
                      {formatPercent(growthSeries[0].value)}
                    </span>
                  </span>
                  <span style={{ color: "var(--text-2)" }}>
                    Después{" "}
                    <span style={{ color: "var(--text-1)" }}>
                      {formatPercent(growthSeries[1].value)}
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={growthSeries}
                      layout="vertical"
                      margin={{ left: 12, right: 12, top: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="growthBefore"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#38bdf8"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#38bdf8"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                        <linearGradient
                          id="growthAfter"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#22c55e"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#22c55e"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(15, 23, 42, 0.08)"
                        vertical={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "#5b6472" }}
                        tickFormatter={(value) => formatPercent(Number(value))}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#5b6472" }}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(148, 163, 184, 0.18)" }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "#d0d4dc",
                          background: "#ffffff",
                        }}
                        formatter={(value) => formatPercent(Number(value ?? 0))}
                      />
                      <Bar
                        dataKey="value"
                        radius={[8, 12, 12, 8]}
                        maxBarSize={36}
                      >
                        {growthSeries.map((entry) => (
                          <Cell
                            key={entry.id}
                            fill={
                              entry.id === "before"
                                ? "url(#growthBefore)"
                                : "url(#growthAfter)"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <section
                className="w-full rounded-xl border border-l-4 p-3"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderLeftColor: "#0ea5e9",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "var(--text-1)" }}
                    >
                      Informe panorámico
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Resumen de analítica del sitio y comportamiento reciente
                    </p>
                  </div>
                  <span
                    className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--text-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    GA4
                  </span>
                </div>
                {panoramaLoading ? (
                  <p
                    className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-2)" }}
                  >
                    Cargando informe panorámico...
                  </p>
                ) : panoramaError ? (
                  <p
                    className="mt-4 text-sm font-semibold"
                    style={{ color: "var(--text-1)" }}
                  >
                    {panoramaError}
                  </p>
                ) : topPages.length === 0 ? (
                  <p
                    className="mt-4 text-sm"
                    style={{ color: "var(--text-2)" }}
                  >
                    Sin datos disponibles en el informe panorámico.
                  </p>
                ) : (
                  <>
                    <div
                      className="mt-2 rounded-xl border p-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="text-[11px] font-semibold uppercase tracking-[0.24em]"
                          style={{ color: "var(--text-1)" }}
                        >
                          Top páginas por vistas
                        </p>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: "var(--text-2)" }}
                        >
                          {formatNumber(
                            topPages.reduce(
                              (sum, item) => sum + item.vistas,
                              0,
                            ),
                          )}{" "}
                          vistas
                        </span>
                      </div>
                      <div className="mt-2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={topPages}
                            layout="vertical"
                            margin={{ left: 6, right: 16 }}
                          >
                            <defs>
                              <linearGradient
                                id="pageViewsFill"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#38bdf8"
                                  stopOpacity={0.9}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#2563eb"
                                  stopOpacity={0.25}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              stroke="rgba(148, 163, 184, 0.2)"
                              horizontal={false}
                            />
                            <XAxis
                              type="number"
                              tick={{ fontSize: 10, fill: "#5b6472" }}
                              tickFormatter={(value) =>
                                formatNumber(Number(value))
                              }
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              type="category"
                              dataKey="tituloCorto"
                              width={160}
                              tick={{ fontSize: 10, fill: "#5b6472" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              cursor={{ fill: "rgba(148, 163, 184, 0.18)" }}
                              contentStyle={{
                                borderRadius: 12,
                                borderColor: "#d0d4dc",
                                background: "#ffffff",
                              }}
                              formatter={(value, _name, props) => {
                                const record = props.payload as
                                  | PanoramaPageChart
                                  | undefined;
                                return [
                                  `${formatNumber(Number(value))} vistas | ${formatRatioPercent(
                                    record?.rebote ?? 0,
                                  )} rebote`,
                                  record?.titulo ?? "",
                                ];
                              }}
                            />
                            <Bar
                              dataKey="vistas"
                              fill="url(#pageViewsFill)"
                              radius={[6, 10, 10, 6]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </section>
              <div className="grid gap-4">
                <section
                  className="w-full rounded-xl border border-l-4 p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderLeftColor: "#22c55e",
                  }}
                >
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "var(--text-1)" }}
                    >
                      Origen de usuarios activos
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Top fuentes de adquisición (usuarios activos)
                    </p>
                  </div>
                  {topSources.length ? (
                    <div className="mt-3 h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topSources}
                          layout="vertical"
                          margin={{ left: 4, right: 16 }}
                        >
                          <defs>
                            <linearGradient
                              id="sourceFill"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22c55e"
                                stopOpacity={0.9}
                              />
                              <stop
                                offset="100%"
                                stopColor="#16a34a"
                                stopOpacity={0.25}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            stroke="rgba(148, 163, 184, 0.2)"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            tick={{ fontSize: 10, fill: "#5b6472" }}
                            tickFormatter={(value) =>
                              formatNumber(Number(value))
                            }
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="fuenteCorta"
                            width={150}
                            tick={{ fontSize: 10, fill: "#5b6472" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(148, 163, 184, 0.18)" }}
                            contentStyle={{
                              borderRadius: 12,
                              borderColor: "#d0d4dc",
                              background: "#ffffff",
                            }}
                            formatter={(value, _name, props) => {
                              const record = props.payload as
                                | PanoramaSourceChart
                                | undefined;
                              return [
                                formatNumber(Number(value ?? 0)),
                                record?.fuente ?? "",
                              ];
                            }}
                          />
                          <Bar
                            dataKey="usuarios"
                            fill="url(#sourceFill)"
                            radius={[6, 10, 10, 6]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p
                      className="mt-3 text-xs"
                      style={{ color: "var(--text-2)" }}
                    >
                      Sin datos de fuentes en el informe panorámico.
                    </p>
                  )}
                </section>
                <section
                  className="w-full rounded-xl border border-l-4 p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderLeftColor: "#f97316",
                  }}
                >
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "var(--text-1)" }}
                    >
                      Nuevos vs recurrentes
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Distribución diaria de usuarios por cohorte
                    </p>
                  </div>
                  {daySeries.length ? (
                    <div className="mt-3 h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={daySeries}
                          margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="newUsersFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#f97316"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="100%"
                                stopColor="#f97316"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="returningUsersFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#2563eb"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563eb"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            stroke="rgba(148, 163, 184, 0.2)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="dayLabel"
                            interval={2}
                            tick={{ fontSize: 10, fill: "#5b6472" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: "#5b6472" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{
                              stroke: "rgba(148, 163, 184, 0.5)",
                              strokeOpacity: 0.2,
                            }}
                            contentStyle={{
                              borderRadius: 12,
                              borderColor: "#d0d4dc",
                              background: "#ffffff",
                            }}
                            formatter={(value, name) => [
                              formatNumber(Number(value ?? 0)),
                              name === "nuevos" ? "Nuevos" : "Recurrentes",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="nuevos"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="url(#newUsersFill)"
                            name="Nuevos"
                          />
                          <Area
                            type="monotone"
                            dataKey="recurrentes"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fill="url(#returningUsersFill)"
                            name="Recurrentes"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p
                      className="mt-3 text-xs"
                      style={{ color: "var(--text-2)" }}
                    >
                      Sin datos diarios para nuevos y recurrentes.
                    </p>
                  )}
                </section>
              </div>
            </div>
            <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <CampaignsPie csvUrl={csvUrl} theme={theme} />
              <section
                className="w-full rounded-xl border border-l-4 p-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderLeftColor: "#6366f1",
                }}
              >
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.28em]"
                    style={{ color: "var(--text-1)" }}
                  >
                    Ciudades destacadas
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-2)" }}>
                    Usuarios activos por ciudad
                  </p>
                </div>
                {topCities.length ? (
                  <div className="mt-3 space-y-2 text-xs font-semibold">
                    {topCities.map((city) => (
                      <div
                        key={city.ciudad}
                        className="flex items-center justify-between"
                        style={{ color: "var(--text-1)" }}
                      >
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--text-2)" }}
                        >
                          {city.ciudad}
                        </span>
                        <span>{formatNumber(city.usuarios)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="mt-3 text-xs"
                    style={{ color: "var(--text-2)" }}
                  >
                    Sin ciudades disponibles en el informe panorámico.
                  </p>
                )}
              </section>
            </div>
            <div className="mt-6">
              <section
                className="w-full rounded-xl border border-l-4 p-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderLeftColor: "#2563eb",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.28em]"
                      style={{ color: "var(--text-1)" }}
                    >
                      Sentimiento de comentarios
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sentimentStack}
                        layout="vertical"
                        margin={{ left: 0, right: 16 }}
                      >
                        <XAxis hide type="number" />
                        <YAxis hide type="category" dataKey="name" />
                        <Tooltip
                          formatter={(value, name) => [`${value}%`, name]}
                          contentStyle={{
                            borderRadius: 12,
                            borderColor: "#d0d4dc",
                            background: "#ffffff",
                          }}
                        />
                        <Bar
                          dataKey="positivo"
                          stackId="sent"
                          fill={sentimentData[0].color}
                        />
                        <Bar
                          dataKey="neutral"
                          stackId="sent"
                          fill={sentimentData[1].color}
                        />
                        <Bar
                          dataKey="negativo"
                          stackId="sent"
                          fill={sentimentData[2].color}
                        />
                        <Bar
                          dataKey="mixto"
                          stackId="sent"
                          fill={sentimentData[3].color}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    className="grid grid-cols-2 gap-2 text-xs font-semibold"
                    style={{ color: "var(--text-1)" }}
                  >
                    {sentimentData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span
                            className="uppercase tracking-[0.18em]"
                            style={{ color: "var(--text-2)" }}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <aside
          className="order-2 w-full border-t px-4 py-5 lg:w-[320px] lg:border-l lg:border-t-0 lg:py-6"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="space-y-4">
            <section className="space-y-4">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: "var(--text-1)" }}
              >
                Operación
              </p>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.24em]"
                    style={{ color: "var(--text-1)" }}
                  >
                    Datos
                  </p>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--text-2)" }}
                  >
                    Total {formatNumber(datosTotal)}
                  </span>
                </div>
                <div
                  className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  <span>Digital</span>
                  <span className="text-right">Territorial</span>
                </div>
                <div
                  className="mt-2 grid grid-cols-2 gap-3 text-xl font-semibold"
                  style={{ color: "var(--text-1)" }}
                >
                  <span>{formatNumber(datos.digital)}</span>
                  <span className="text-right">
                    {formatNumber(datos.territorial)}
                  </span>
                </div>
                <div className="mt-3 h-px w-full bg-slate-200/70 dark:bg-slate-800" />
                <p
                  className="mt-3 text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-1)" }}
                >
                  Contactados
                </p>
                <div
                  className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  <span>Digital</span>
                  <span className="text-right">Territorial</span>
                </div>
                <div
                  className="mt-2 grid grid-cols-2 gap-3 text-xl font-semibold"
                  style={{ color: "var(--text-1)" }}
                >
                  <span>{formatNumber(contactados.digital)}</span>
                  <span className="text-right">
                    {formatNumber(contactados.territorial)}
                  </span>
                </div>
              </div>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-1)" }}
                >
                  Voluntarios
                </p>
                <div className="mt-3 grid grid-cols-[1fr_1.2fr] gap-4">
                  <div>
                    <p
                      className="text-3xl font-semibold"
                      style={{ color: "var(--text-1)" }}
                    >
                      {formatNumber(voluntariosTotal)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {voluntarios.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs font-semibold"
                        style={{ color: "var(--text-1)" }}
                      >
                        <span className="uppercase tracking-[0.18em]">
                          {item.label}
                        </span>
                        <span>{formatNumber(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: "var(--text-1)" }}
              >
                Crecimiento
              </p>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-1)" }}
                >
                  Seguidores
                </p>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                      style={{ color: "var(--text-2)" }}
                    >
                      Canal WhatsApp
                    </span>
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "var(--text-1)" }}
                    >
                      {formatNumber(whatsappFollowers)}
                    </span>
                  </div>
                  <div className="mt-3 h-px w-full bg-slate-200/70 dark:bg-slate-800" />
                  <p
                    className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--text-2)" }}
                  >
                    Seguidores Facebook
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                      style={{ color: "var(--text-2)" }}
                    >
                      Antes
                    </p>
                    <p
                      className="text-[10px] text-right font-semibold uppercase tracking-[0.22em]"
                      style={{ color: "var(--text-2)" }}
                    >
                      Después
                    </p>
                    <p
                      className="text-2xl font-semibold"
                      style={{ color: "var(--text-1)" }}
                    >
                      {formatNumber(followersBefore)}
                    </p>
                    <p
                      className="text-2xl font-semibold text-right"
                      style={{ color: "var(--text-1)" }}
                    >
                      {formatNumber(followersNow)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: "var(--text-1)" }}
              >
                Insights
              </p>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-1)" }}
                >
                  Usuarios y eventos
                </p>
                {summaryCards.length ? (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {summaryCards.map((item) => (
                      <div key={item.label}>
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: "var(--text-2)" }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="mt-2 text-lg font-semibold"
                          style={{ color: "var(--text-1)" }}
                        >
                          {item.format === SUMMARY_FORMAT.SECONDS
                            ? formatSeconds(item.value)
                            : formatNumber(item.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="mt-3 text-sm"
                    style={{ color: "var(--text-2)" }}
                  >
                    Sin datos del informe panoramico.
                  </p>
                )}
              </div>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-1)" }}
                >
                  Temas clave
                </p>
                <div
                  className="mt-3 space-y-2 text-xs"
                  style={{ color: "var(--text-1)" }}
                >
                  {temasClave.map((tema) => (
                    <div
                      key={tema.label}
                      className="flex items-start justify-between gap-3"
                    >
                      <span
                        className="text-[11px] leading-relaxed"
                        style={{ color: "var(--text-2)" }}
                      >
                        {tema.label}
                      </span>
                      <span className="text-sm font-semibold">
                        {tema.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-1)" }}
                >
                  Tendencia de comentarios
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--text-1)" }}>
                  Predomina tono positivo y de apoyo, con picos en publicaciones
                  de campaña territorial y eventos en vivo.
                </p>
              </div>
              <div
                className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.24em]"
                    style={{ color: "var(--text-1)" }}
                  >
                    Resumen IA
                  </p>
                  <span
                    className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--text-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    Insight
                  </span>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-1)" }}
                >
                  Mayormente positivo y de apoyo al candidato, con mensajes de
                  respaldo, felicitaciones y consignas, destacando presencia en
                  Loreto/Iquitos. Existe una minoría crítica/negativa con
                  ataques y acusaciones, pero el tono general es de movilización
                  política y unidad.
                </p>
              </div>
            </section>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={handleToggleTheme}
        className="fixed bottom-6 right-6 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] p-3 text-[color:var(--text-2)] shadow-[0_20px_40px_-26px_rgba(15,23,42,0.25)] transition hover:border-[color:var(--text-2)] dark:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)]"
        aria-label={
          theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
        }
        aria-pressed={theme === "dark"}
      >
        {theme === "dark" ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
          >
            <path d="M12 4.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 1 1 0 1.5h-.5A.75.75 0 0 1 12 4.75Zm0 14a.75.75 0 0 1 .75-.75h.5a.75.75 0 1 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm7.25-6a.75.75 0 0 1 .75-.75v-.5a.75.75 0 1 1 1.5 0v.5a.75.75 0 0 1-.75.75Zm-14 0a.75.75 0 0 1 .75-.75v-.5a.75.75 0 1 1 1.5 0v.5a.75.75 0 0 1-.75.75Zm10.8-5.55a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06ZM6.24 15.76a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06Zm11.17 1.41a.75.75 0 0 1-1.06 0l-.35-.35a.75.75 0 1 1 1.06-1.06l.35.35a.75.75 0 0 1 0 1.06ZM7.65 7.65a.75.75 0 0 1-1.06 0l-.35-.35a.75.75 0 0 1 1.06-1.06l.35.35a.75.75 0 0 1 0 1.06ZM12 7.25A4.75 4.75 0 1 1 7.25 12 4.76 4.76 0 0 1 12 7.25Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
          >
            <path d="M14.5 2.5a9.5 9.5 0 1 0 7 16.09.75.75 0 0 0-.78-1.23 8 8 0 0 1-10.82-10.82.75.75 0 0 0-1.23-.78A9.48 9.48 0 0 0 14.5 2.5Z" />
          </svg>
        )}
      </button>
    </main>
  );
}
