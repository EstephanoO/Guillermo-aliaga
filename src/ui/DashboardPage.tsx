"use client";

import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardMain from "./dashboard/DashboardMain";
import DashboardSidebar from "./dashboard/DashboardSidebar";
import ThemeToggleButton from "./dashboard/ThemeToggleButton";
import {
  DASHBOARD_THEME,
  GROWTH_CUTOFF_DATE,
  SENTIMENT_DATA,
  SUMMARY_FORMAT,
  TOTAL_INTERACTIONS_DISPLAY,
} from "../db/constants/dashboard";
import { csvUrl } from "../db/dashboardData";
import { useDailySeries } from "./hooks/useDailySeries";
import { useDashboardTheme } from "./hooks/useDashboardTheme";
import { useGuillermoMapData } from "./hooks/useGuillermoMapData";
import { usePanoramaData } from "./hooks/usePanoramaData";
import type {
  DailyPoint,
  GrowthSeriesItem,
  PanoramaPageChart,
  PanoramaSourceChart,
  SentimentStackDatum,
  SummaryCard,
} from "./types/dashboard";
import { truncateText } from "./utils/dashboardFormat";
import {
  calculateAverageReach,
  calculateTrendSeries,
} from "./utils/dashboardMath";

export default function DashboardPage() {
  const { theme, toggleTheme } = useDashboardTheme();
  const { dailySeries } = useDailySeries();
  const { panoramaData, panoramaError, panoramaLoading } = usePanoramaData();
  const { mapData, mapError } = useGuillermoMapData();
  const trendStroke =
    theme === DASHBOARD_THEME.DARK ? "#f8fafc" : "#0f172a";

  const reachPeak = dailySeries.reduce<DailyPoint | null>((current, item) => {
    if (!current || item.reach > current.reach) return item;
    return current;
  }, null);
  const trendSeries = calculateTrendSeries(dailySeries);
  const beforeSeries = dailySeries.filter(
    (item) => item.dateKey < GROWTH_CUTOFF_DATE,
  );
  const afterSeries = dailySeries.filter(
    (item) => item.dateKey >= GROWTH_CUTOFF_DATE,
  );
  const beforeAverage = calculateAverageReach(beforeSeries);
  const afterAverage = calculateAverageReach(afterSeries);
  const totalAverage = beforeAverage + afterAverage;
  const growthSeries: GrowthSeriesItem[] = [
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
  const sentimentStack: SentimentStackDatum[] = [
    {
      name: "Sentimiento",
      positivo: SENTIMENT_DATA[0].value,
      neutral: SENTIMENT_DATA[1].value,
      negativo: SENTIMENT_DATA[2].value,
      mixto: SENTIMENT_DATA[3].value,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--text-1)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="order-1 flex-1">
          <DashboardHeader />
          <DashboardMain
            mapData={mapData}
            mapError={mapError}
            trendSeries={trendSeries}
            reachPeak={reachPeak}
            trendStroke={trendStroke}
            theme={theme}
            totalInteractionsDisplay={TOTAL_INTERACTIONS_DISPLAY}
            growthSeries={growthSeries}
            panoramaLoading={panoramaLoading}
            panoramaError={panoramaError}
            topPages={topPages}
            topSources={topSources}
            daySeries={daySeries}
            topCities={topCities}
            sentimentData={[...SENTIMENT_DATA]}
            sentimentStack={sentimentStack}
            csvUrl={csvUrl}
          />
        </div>
        <DashboardSidebar summaryCards={summaryCards} />
      </div>
      <ThemeToggleButton theme={theme} onToggle={toggleTheme} />
    </main>
  );
}
