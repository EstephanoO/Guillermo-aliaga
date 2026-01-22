"use client";

import { useCallback, useState } from "react";
import BasquetMap from "../BasquetMap";

type SomistasPoint = {
  lat?: number;
  lon?: number;
  [key: string]: unknown;
};

type GeoJsonFeature = {
  type: "Feature";
  properties: SomistasPoint;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

type FetchErrorDetails = {
  url: string;
  status: number;
  message: string;
};

const formatError = (details: FetchErrorDetails) =>
  `${details.message} (${details.status}) en ${details.url}`;

export default function SomistasMapClient() {
  const [points, setPoints] = useState<SomistasPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawCount, setRawCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const geojson = points
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon))
    .reduce<GeoJsonFeatureCollection>(
      (collection, point) => {
        collection.features.push({
          type: "Feature",
          properties: point,
          geometry: {
            type: "Point",
            coordinates: [point.lon as number, point.lat as number],
          },
        });
        return collection;
      },
      { type: "FeatureCollection", features: [] },
    );

  const handleDownload = () => {
    const payload = JSON.stringify(geojson, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "somistas.geojson";
    link.click();
    URL.revokeObjectURL(url);
  };

  const geocode = useCallback(async (raw: SomistasPoint[]) => {
    if (!raw.length) {
      return [] as SomistasPoint[];
    }
    const url = "/api/somistas-geocode";
    const geocodedResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raw),
    });
    if (!geocodedResponse.ok) {
      const payload = await geocodedResponse.json().catch(() => ({}));
      throw new Error(
        formatError({
          url,
          status: geocodedResponse.status,
          message: payload.error || "Error geocodificando registros",
        }),
      );
    }
    return (await geocodedResponse.json()) as SomistasPoint[];
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      const payload = new FormData();
      payload.append("file", file);
      const url = "/api/somistas-upload";
      const uploadResponse = await fetch(url, {
        method: "POST",
        body: payload,
      });
      if (!uploadResponse.ok) {
        const payload = await uploadResponse.json().catch(() => ({}));
        throw new Error(
          formatError({
            url,
            status: uploadResponse.status,
            message: payload.error || "Error leyendo Excel",
          }),
        );
      }
      const raw = (await uploadResponse.json()) as SomistasPoint[];
      if (!raw.length) {
        throw new Error("No se encontraron filas en la hoja Somistas");
      }
      return raw;
    },
    [],
  );

  const geocodeInBatches = useCallback(
    async (raw: SomistasPoint[], batchSize = 5) => {
      const total = raw.length;
      setProcessedCount(0);
      const collected: SomistasPoint[] = [];

      for (let index = 0; index < total; index += batchSize) {
        const chunk = raw.slice(index, index + batchSize);
        const geocodedChunk = await geocode(chunk);
        collected.push(...geocodedChunk);
        setPoints((prev) => [...prev, ...geocodedChunk]);
        setProcessedCount(Math.min(total, index + chunk.length));
      }

      return collected;
    },
    [geocode],
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      setError(null);
      setFileName(file.name);
      setPoints([]);
      setRawCount(0);
      setProcessedCount(0);
      const raw = await handleUpload(file);
      setRawCount(raw.length);
      await geocodeInBatches(raw);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando archivo");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  const validCount = geojson.features.length;
  const missingCount = Math.max(0, rawCount - validCount);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-2)]">
            GeoJSON listo: {validCount} puntos
          </p>
          <p className="text-xs text-[color:var(--text-2)]">
            {fileName ? `Archivo: ${fileName}` : "Fuente: archivo subido"}
          </p>
          <p className="text-xs text-[color:var(--text-2)]">
            Registros leidos: {rawCount} | Sin coordenadas: {missingCount}
          </p>
          <p className="text-xs text-[color:var(--text-2)]">
            Procesados: {processedCount} / {rawCount}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-2)] transition hover:border-[color:var(--text-2)]">
            Subir Excel
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-2)] transition hover:border-[color:var(--text-2)]"
          >
            Descargar GeoJSON
          </button>
        </div>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-[color:var(--text-2)]">
          Geocodificando registros... esto puede tardar varios minutos.
        </div>
      ) : null}
      {!loading && rawCount === 0 ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-[color:var(--text-2)]">
          Subi un Excel con la hoja Somistas para iniciar.
        </div>
      ) : null}
      <BasquetMap points={points} />
    </div>
  );
}
