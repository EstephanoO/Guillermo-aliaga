import type { SummaryFormat } from "../../db/constants/dashboard";

export interface DailyPoint {
  dateKey: string;
  reach: number;
  interactions: number;
  trend?: number;
}

export interface FacebookPost {
  time: string;
  comments?: number;
  likes?: number;
  shares?: number;
  viewsCount?: number;
}

export interface PanoramaSummary {
  usuariosActivos: number;
  usuariosNuevos: number;
  tiempoInteraccion: number;
  eventos: number;
}

export interface PanoramaPage {
  titulo: string;
  vistas: number;
  usuarios: number;
  eventos: number;
  rebote: number;
}

export interface PanoramaSource {
  fuente: string;
  usuarios: number;
}

export interface PanoramaSessionSource {
  fuente: string;
  sesiones: number;
}

export interface PanoramaDaySeries {
  dayIndex: number;
  dayLabel: string;
  nuevos: number;
  recurrentes: number;
}

export interface PanoramaCity {
  ciudad: string;
  usuarios: number;
}

export interface PanoramaData {
  summary: PanoramaSummary | null;
  pages: PanoramaPage[];
  userSources: PanoramaSource[];
  sessionSources: PanoramaSessionSource[];
  daySeries: PanoramaDaySeries[];
  cities: PanoramaCity[];
}

export interface SummaryCard {
  label: string;
  value: number;
  format: SummaryFormat;
}

export interface PanoramaPageChart extends PanoramaPage {
  tituloCorto: string;
}

export interface PanoramaSourceChart extends PanoramaSource {
  fuenteCorta: string;
}

export interface GrowthSeriesItem {
  id: string;
  label: string;
  value: number;
}

export interface SentimentStackDatum {
  name: string;
  positivo: number;
  neutral: number;
  negativo: number;
  mixto: number;
}
