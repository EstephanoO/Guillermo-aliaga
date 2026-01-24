export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export const formatPercent = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);

export const formatRatioPercent = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);

export const formatSeconds = (value: number) =>
  `${new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 1,
  }).format(value)} s`;

export const formatShortDate = (date: Date) =>
  date
    .toLocaleDateString("es-PE", { day: "2-digit", month: "short" })
    .replace(".", "");

export const formatDate = (date: Date) =>
  date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
};
