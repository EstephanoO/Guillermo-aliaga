"use client";

import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { wspTotals } from "../db/dashboardData";
import { getTooltipStyles } from "./dashboard/tooltipStyles";

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}


type DailyDatum = {
  date: string;
  started: number;
  unfollowed: number;
  net: number;
};

const dailyData: DailyDatum[] = [
  { date: "21 dic", started: 55, unfollowed: 12, net: 43 },
  { date: "22 dic", started: 11, unfollowed: 6, net: 5 },
  { date: "23 dic", started: 12, unfollowed: 6, net: 6 },
  { date: "24 dic", started: 13, unfollowed: 5, net: 8 },
  { date: "25 dic", started: 14, unfollowed: 6, net: 8 },
  { date: "26 dic", started: 10, unfollowed: 5, net: 5 },
  { date: "27 dic", started: 11, unfollowed: 5, net: 6 },
  { date: "28 dic", started: 12, unfollowed: 4, net: 8 },
  { date: "29 dic", started: 13, unfollowed: 5, net: 8 },
  { date: "30 dic", started: 14, unfollowed: 4, net: 10 },
  { date: "31 dic", started: 95, unfollowed: 18, net: 77 },
  { date: "1 ene", started: 11, unfollowed: 4, net: 7 },
  { date: "2 ene", started: 85, unfollowed: 16, net: 69 },
  { date: "3 ene", started: 13, unfollowed: 4, net: 9 },
  { date: "4 ene", started: 14, unfollowed: 5, net: 9 },
  { date: "5 ene", started: 10, unfollowed: 4, net: 6 },
  { date: "6 ene", started: 11, unfollowed: 4, net: 7 },
  { date: "7 ene", started: 12, unfollowed: 5, net: 7 },
  { date: "8 ene", started: 105, unfollowed: 20, net: 85 },
  { date: "9 ene", started: 14, unfollowed: 4, net: 10 },
  { date: "10 ene", started: 10, unfollowed: 4, net: 6 },
  { date: "11 ene", started: 11, unfollowed: 4, net: 7 },
  { date: "12 ene", started: 12, unfollowed: 5, net: 7 },
  { date: "13 ene", started: 13, unfollowed: 4, net: 9 },
  { date: "14 ene", started: 14, unfollowed: 5, net: 9 },
  { date: "15 ene", started: 10, unfollowed: 4, net: 6 },
  { date: "16 ene", started: 11, unfollowed: 4, net: 7 },
  { date: "17 ene", started: 12, unfollowed: 5, net: 7 },
  { date: "18 ene", started: 35, unfollowed: 9, net: 26 },
  { date: "19 ene", started: 14, unfollowed: 4, net: 10 },
];

const legendItems = [
  { label: "Neto nuevos", color: "#10b981" },
  { label: "Comenzaron a seguirte", color: "#0ea5e9" },
  { label: "Dejaron de seguirte", color: "#f43f5e" },
];

type WsppChartProps = {
  theme?: "dark" | "light";
  view?: "all" | "net" | "started" | "unfollowed";
};

export default function WsppChart({
  theme = "dark",
  view = "all",
}: WsppChartProps) {
  const isDark = theme === "dark";
  const showNet = view === "all" || view === "net";
  const showStarted = view === "all" || view === "started";
  const showUnfollowed = view === "all" || view === "unfollowed";
  const secondaryOpacity = view === "all" ? 0.45 : 1;
  const tooltipStyles = getTooltipStyles(isDark);

  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 text-[color:var(--text-1)] shadow-[0_10px_22px_-18px_rgba(15,23,42,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
            Neto nuevos
          </p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--text-1)]">
            {formatNumber(wspTotals.netNew)}
          </p>
          <p className="text-xs font-semibold text-[color:var(--text-2)]">
            21 dic - 19 ene
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
            Comenzaron a seguirte
          </p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--text-1)]">
            {formatNumber(wspTotals.startedFollowing)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
            Dejaron de seguirte
          </p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--text-1)]">
            {formatNumber(wspTotals.unfollowed)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
        <div className="mt-4 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--text-2)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-2)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value, name) => [formatNumber(Number(value ?? 0)), name]}
                labelFormatter={(label) => `Fecha: ${label}`}
                contentStyle={tooltipStyles}
              />
              {showNet ? (
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Neto nuevos"
                  stroke="#10b981"
                  strokeWidth={3.2}
                  dot={false}
                />
              ) : null}
              {showStarted ? (
                <Line
                  type="monotone"
                  dataKey="started"
                  name="Comenzaron a seguirte"
                  stroke="#0ea5e9"
                  strokeWidth={2.6}
                  strokeOpacity={secondaryOpacity}
                  dot={false}
                />
              ) : null}
              {showUnfollowed ? (
                <Line
                  type="monotone"
                  dataKey="unfollowed"
                  name="Dejaron de seguirte"
                  stroke="#f43f5e"
                  strokeWidth={2.6}
                  strokeOpacity={secondaryOpacity}
                  dot={false}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
