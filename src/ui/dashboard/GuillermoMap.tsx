"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { Map as MapLibreMap, Source, Layer, type MapRef } from "@vis.gl/react-maplibre";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { FilterSpecification, StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

type GeoJsonFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;

type GeoJsonData = GeoJsonFeatureCollection;

export type MapData = {
  departamentos: GeoJsonData;
  actividades: GeoJsonData;
  votantes: GeoJsonData;
  paneles: GeoJsonData;
};

type GuillermoMapProps = {
  data: MapData | null;
  error?: string | null;
};

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "rgba(0, 0, 0, 0)",
      },
    },
  ],
};

const LAYER_COLORS = {
  departamentosLine: "#64748b",
  departamentosFill: "#e2e8f0",
  actividades: "#38bdf8",
  votantesDigital: "#2563eb",
  votantesTerritorial: "#22c55e",
  panelesAvenidas: "#f59e0b",
  panelesCasas: "#ef4444",
};

type LayerKey =
  | "actividades"
  | "votantes-digital"
  | "votantes-territorial"
  | "paneles-avenidas"
  | "paneles-casas";

const LEGEND_ITEMS: Array<{
  key: LayerKey;
  label: string;
  color: string;
  shape: "dot" | "pill";
}> = [
  { key: "actividades", label: "Actividades", color: LAYER_COLORS.actividades, shape: "dot" },
  {
    key: "votantes-digital",
    label: "Votantes digitales",
    color: LAYER_COLORS.votantesDigital,
    shape: "dot",
  },
  {
    key: "votantes-territorial",
    label: "Votantes territoriales",
    color: LAYER_COLORS.votantesTerritorial,
    shape: "dot",
  },
  {
    key: "paneles-avenidas",
    label: "Paneles en avenidas",
    color: LAYER_COLORS.panelesAvenidas,
    shape: "pill",
  },
  {
    key: "paneles-casas",
    label: "Paneles en casas",
    color: LAYER_COLORS.panelesCasas,
    shape: "pill",
  },
];

const VOTANTES_DIGITAL_FILTER = ["==", ["get", "id"], 1] as FilterSpecification;
const VOTANTES_TERRITORIAL_FILTER = ["any", ["==", ["get", "id"], 2], ["!", ["has", "id"]]] as FilterSpecification;
const PANELES_AVENIDAS_FILTER = ["==", ["get", "id"], 1] as FilterSpecification;
const PANELES_CASAS_FILTER = ["==", ["get", "id"], 2] as FilterSpecification;

const expandBounds = (
  bounds: { southWest: [number, number]; northEast: [number, number] },
  padding = 0.8,
) => {
  const [minLng, minLat] = bounds.southWest;
  const [maxLng, maxLat] = bounds.northEast;
  const lngPadding = Math.max(0.6, (maxLng - minLng) * padding * 0.1);
  const latPadding = Math.max(0.6, (maxLat - minLat) * padding * 0.1);
  return [
    [minLng - lngPadding, minLat - latPadding],
    [maxLng + lngPadding, maxLat + latPadding],
  ] as [[number, number], [number, number]];
};

const getBounds = (collection: GeoJsonFeatureCollection) => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const visit = (coords: unknown) => {
    if (!Array.isArray(coords)) return;
    if (coords.length === 2 && coords.every((value) => typeof value === "number")) {
      const [lng, lat] = coords as [number, number];
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
      return;
    }
    coords.forEach((value) => {
      visit(value);
    });
  };

  const visitGeometry = (geometry: Geometry) => {
    if (geometry.type === "GeometryCollection") {
      geometry.geometries.forEach(visitGeometry);
      return;
    }
    visit(geometry.coordinates);
  };

  collection.features.forEach((feature) => {
    visitGeometry(feature.geometry);
  });

  if (!Number.isFinite(minLng) || !Number.isFinite(minLat)) {
    return {
      southWest: [-77.03, -12.04] as [number, number],
      northEast: [-76.93, -11.88] as [number, number],
    };
  }

  return {
    southWest: [minLng, minLat] as [number, number],
    northEast: [maxLng, maxLat] as [number, number],
  };
};

const getGeometryBounds = (geometry: Geometry) => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const visit = (coords: unknown) => {
    if (!Array.isArray(coords)) return;
    if (coords.length === 2 && coords.every((value) => typeof value === "number")) {
      const [lng, lat] = coords as [number, number];
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
      return;
    }
    coords.forEach((value) => {
      visit(value);
    });
  };

  const visitGeometry = (item: Geometry) => {
    if (item.type === "GeometryCollection") {
      item.geometries.forEach(visitGeometry);
      return;
    }
    visit(item.coordinates);
  };

  visitGeometry(geometry);

  return {
    southWest: [minLng, minLat] as [number, number],
    northEast: [maxLng, maxLat] as [number, number],
  };
};

const getFeatureId = (value: GeoJsonProperties | null | undefined) => {
  if (!value || typeof value.id !== "number") return null;
  return value.id;
};

const getAverageCenter = (collection: GeoJsonFeatureCollection, matchId?: number | null) => {
  let totalLng = 0;
  let totalLat = 0;
  let count = 0;

  collection.features.forEach((feature) => {
    if (feature.geometry.type !== "Point") return;
    const id = getFeatureId(feature.properties);
    if (matchId !== undefined && id !== matchId) return;
    if (!Array.isArray(feature.geometry.coordinates)) return;
    const [lng, lat] = feature.geometry.coordinates as [number, number];
    totalLng += lng;
    totalLat += lat;
    count += 1;
  });

  if (!count) return null;
  return [totalLng / count, totalLat / count] as [number, number];
};

const getLayerCenter = (data: MapData, layer: LayerKey) => {
  if (layer === "actividades") return getAverageCenter(data.actividades);
  if (layer === "votantes-digital") return getAverageCenter(data.votantes, 1);
  if (layer === "votantes-territorial") return getAverageCenter(data.votantes, 2);
  if (layer === "paneles-avenidas") return getAverageCenter(data.paneles, 1);
  if (layer === "paneles-casas") return getAverageCenter(data.paneles, 2);
  return null;
};

export default function GuillermoMap({ data, error = null }: GuillermoMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerKey | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!data || !mapReady || !mapRef.current) return;
    const baseBounds = getBounds(data.departamentos);
    const expandedBounds = expandBounds(baseBounds);
    mapRef.current.getMap().setMaxBounds(expandedBounds);
    mapRef.current.fitBounds([baseBounds.southWest, baseBounds.northEast], {
      padding: 28,
      duration: 0,
    });
  }, [data, mapReady]);

  const getVisibility = (key: LayerKey) =>
    activeLayer && activeLayer !== key ? "none" : "visible";

  useEffect(() => {
    const handleChange = () => {
      const isActive = document.fullscreenElement === containerRef.current;
      setIsFullscreen(isActive);
      mapRef.current?.resize();
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  const handleFullscreenToggle = () => {
    const element = containerRef.current;
    if (!element) return;
    if (document.fullscreenElement === element) {
      void document.exitFullscreen();
      return;
    }
    void element.requestFullscreen();
  };

  const handleLegendClick = (key: LayerKey) => {
    setActiveLayer((current) => {
      const next = current === key ? null : key;
      if (next && data && mapRef.current) {
        const center = getLayerCenter(data, next);
        if (center) {
          mapRef.current.easeTo({ center, duration: 650 });
        }
      }
      return next;
    });
  };

  return (
    <section
      className="w-full rounded-xl border border-l-4 p-4"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        borderLeftColor: "#22c55e",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-[0.28em]"
            style={{ color: "var(--text-1)" }}
          >
            Mapa territorial
          </p>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>
            Capas de actividades, votantes y paneles
          </p>
        </div>
      </div>
      <div
        className="relative mt-4 h-[420px] w-full overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border)" }}
        ref={containerRef}
      >
        <MapLibreMap
          ref={mapRef}
          onLoad={() => setMapReady(true)}
          onClick={(event) => {
            if (!event.features?.length || !mapRef.current) return;
            const geometry = event.features[0].geometry as Geometry | undefined;
            if (!geometry) return;
            const { southWest, northEast } = getGeometryBounds(geometry);
            mapRef.current.fitBounds([southWest, northEast], {
              padding: 40,
              duration: 650,
            });
          }}
          initialViewState={{ longitude: -75.5, latitude: -9.2, zoom: 4.2 }}
          minZoom={4}
          maxZoom={9}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          interactiveLayerIds={["departamentos-fill"]}
          style={{ width: "100%", height: "100%" }}
        >
          {data ? (
            <>
              <Source id="departamentos" type="geojson" data={data.departamentos}>
                <Layer
                  id="departamentos-fill"
                  type="fill"
                  paint={{
                    "fill-color": LAYER_COLORS.departamentosFill,
                    "fill-opacity": 0.18,
                  }}
                />
                <Layer
                  id="departamentos-line"
                  type="line"
                  paint={{
                    "line-color": LAYER_COLORS.departamentosLine,
                    "line-width": 1.1,
                  }}
                />
              </Source>
              <Source id="actividades" type="geojson" data={data.actividades}>
                <Layer
                  id="actividades-points"
                  type="circle"
                  layout={{ visibility: getVisibility("actividades") }}
                  paint={{
                    "circle-radius": 4.5,
                    "circle-color": LAYER_COLORS.actividades,
                    "circle-stroke-color": "rgba(15, 23, 42, 0.35)",
                    "circle-stroke-width": 0.6,
                  }}
                />
              </Source>
              <Source id="votantes" type="geojson" data={data.votantes}>
                <Layer
                  id="votantes-digital"
                  type="circle"
                  layout={{ visibility: getVisibility("votantes-digital") }}
                  filter={VOTANTES_DIGITAL_FILTER}
                  paint={{
                    "circle-radius": 3.6,
                    "circle-color": LAYER_COLORS.votantesDigital,
                    "circle-opacity": 0.75,
                  }}
                />
                <Layer
                  id="votantes-territorial"
                  type="circle"
                  layout={{ visibility: getVisibility("votantes-territorial") }}
                  filter={VOTANTES_TERRITORIAL_FILTER}
                  paint={{
                    "circle-radius": 3.6,
                    "circle-color": LAYER_COLORS.votantesTerritorial,
                    "circle-opacity": 0.75,
                  }}
                />
              </Source>
              <Source id="paneles" type="geojson" data={data.paneles}>
                <Layer
                  id="paneles-avenidas"
                  type="circle"
                  layout={{ visibility: getVisibility("paneles-avenidas") }}
                  filter={PANELES_AVENIDAS_FILTER}
                  paint={{
                    "circle-radius": 5.2,
                    "circle-color": LAYER_COLORS.panelesAvenidas,
                    "circle-opacity": 0.85,
                  }}
                />
                <Layer
                  id="paneles-casas"
                  type="circle"
                  layout={{ visibility: getVisibility("paneles-casas") }}
                  filter={PANELES_CASAS_FILTER}
                  paint={{
                    "circle-radius": 5.2,
                    "circle-color": LAYER_COLORS.panelesCasas,
                    "circle-opacity": 0.85,
                  }}
                />
              </Source>
            </>
          ) : null}
        </MapLibreMap>
        <button
          type="button"
          onClick={handleFullscreenToggle}
          className="absolute right-4 top-4 rounded-lg border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--text-1)",
          }}
        >
          {isFullscreen ? "Salir" : "Pantalla completa"}
        </button>
        <div
          className="absolute left-4 top-4 rounded-xl border px-3 py-2 text-xs font-semibold"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--text-1)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-4 rounded-sm border"
              style={{
                backgroundColor: LAYER_COLORS.departamentosFill,
                borderColor: LAYER_COLORS.departamentosLine,
              }}
            />
            <span className="uppercase tracking-[0.18em]">Departamentos</span>
          </div>
          <div className="mt-3 space-y-2">
            {LEGEND_ITEMS.map((item) => {
              const isActive = activeLayer === item.key;
              const isMuted = activeLayer && !isActive;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleLegendClick(item.key)}
                  className="flex w-full items-center gap-2 rounded-lg border px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-[0.18em] transition"
                  style={{
                    borderColor: isActive ? item.color : "var(--border)",
                    color: isMuted ? "var(--text-2)" : "var(--text-1)",
                    opacity: isMuted ? 0.55 : 1,
                  }}
                >
                  <span
                    className={item.shape === "pill" ? "h-2.5 w-4 rounded-sm" : "h-2.5 w-2.5 rounded-full"}
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {error ? (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
            style={{ color: "var(--text-2)", backgroundColor: "var(--card)" }}
          >
            {error}
          </div>
        ) : null}
      </div>
    </section>
  );
}
