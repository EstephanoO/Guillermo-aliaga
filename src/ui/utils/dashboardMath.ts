import type { DailyPoint } from "../types/dashboard";

export const calculateAverageReach = (series: DailyPoint[]) => {
  if (!series.length) return 0;
  const total = series.reduce((sum, item) => sum + item.reach, 0);
  return total / series.length;
};

export const calculateTrendSeries = (series: DailyPoint[]) => {
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
