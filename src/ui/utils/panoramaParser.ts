import { PANORAMA_SECTION, type PanoramaSection } from "../../db/constants/dashboard";
import type {
  PanoramaData,
  PanoramaDaySeries,
  PanoramaPage,
  PanoramaSessionSource,
  PanoramaSource,
  PanoramaSummary,
} from "../types/dashboard";

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

export const createEmptyPanoramaData = (): PanoramaData => ({
  summary: null,
  pages: [],
  userSources: [],
  sessionSources: [],
  daySeries: [],
  cities: [],
});

const parseSummaryRow = (row: string[]): PanoramaSummary => ({
  usuariosActivos: parseNumber(row[0] ?? "0"),
  usuariosNuevos: parseNumber(row[1] ?? "0"),
  tiempoInteraccion: parseNumber(row[2] ?? "0"),
  eventos: parseNumber(row[3] ?? "0"),
});

const parsePageRow = (row: string[]): PanoramaPage => ({
  titulo: row[0] ?? "",
  vistas: parseNumber(row[1] ?? "0"),
  usuarios: parseNumber(row[2] ?? "0"),
  eventos: parseNumber(row[3] ?? "0"),
  rebote: parseNumber(row[4] ?? "0"),
});

const parseSourceRow = (row: string[]): PanoramaSource => ({
  fuente: row[0] ?? "",
  usuarios: parseNumber(row[1] ?? "0"),
});

const parseSessionSourceRow = (row: string[]): PanoramaSessionSource => ({
  fuente: row[0] ?? "",
  sesiones: parseNumber(row[1] ?? "0"),
});

const parseDayRow = (row: string[]): PanoramaDaySeries | null => {
  const dayIndex = Number(row[0]);
  if (!Number.isFinite(dayIndex)) return null;
  return {
    dayIndex,
    dayLabel: `D${dayIndex}`,
    nuevos: parseNumber(row[1] ?? "0"),
    recurrentes: parseNumber(row[2] ?? "0"),
  };
};

const parsePanoramaSection = (row: string[]): PanoramaSection | null => {
  const first = row[0] ?? "";

  if (first === "Usuarios activos" && row[1] === "Usuarios nuevos") {
    return PANORAMA_SECTION.SUMMARY;
  }
  if (first === "Título de página y clase de pantalla") {
    return PANORAMA_SECTION.PAGES;
  }
  if (first === "Primera fuente/medio del usuario") {
    return PANORAMA_SECTION.USER_SOURCES;
  }
  if (first === "Fuente/medio de la sesión") {
    return PANORAMA_SECTION.SESSION_SOURCES;
  }
  if (first.startsWith("Día")) {
    return PANORAMA_SECTION.DAY;
  }
  if (first === "Plataforma") {
    return PANORAMA_SECTION.PLATFORM;
  }
  if (first === "Ciudad") {
    return PANORAMA_SECTION.CITIES;
  }
  if (first === "Nombre de la audiencia") {
    return PANORAMA_SECTION.AUDIENCE;
  }

  return null;
};

export const parsePanoramaCSV = (csvText: string): PanoramaData => {
  const rows = parseCSVRows(csvText);
  const data = createEmptyPanoramaData();
  let section: PanoramaSection | null = null;

  rows.forEach((rawRow) => {
    const row = rawRow.map((value) => value.trim());
    const first = row[0] ?? "";
    if (!first || first.startsWith("#")) return;
    const sectionCandidate = parsePanoramaSection(row);
    if (sectionCandidate) {
      section = sectionCandidate;
      return;
    }

    if (!section) return;

    if (section === PANORAMA_SECTION.SUMMARY) {
      data.summary = parseSummaryRow(row);
      section = null;
      return;
    }

    if (section === PANORAMA_SECTION.PAGES) {
      if (row.length < 5) return;
      data.pages.push(parsePageRow(row));
      return;
    }

    if (section === PANORAMA_SECTION.USER_SOURCES) {
      if (row.length < 2) return;
      data.userSources.push(parseSourceRow(row));
      return;
    }

    if (section === PANORAMA_SECTION.SESSION_SOURCES) {
      if (row.length < 2) return;
      data.sessionSources.push(parseSessionSourceRow(row));
      return;
    }

    if (section === PANORAMA_SECTION.DAY) {
      if (row.length < 3) return;
      const day = parseDayRow(row);
      if (day) data.daySeries.push(day);
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
