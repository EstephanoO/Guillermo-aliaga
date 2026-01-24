"use client";

import {
  Layer,
  Map as MapLibreMap,
  NavigationControl,
  Source,
  type MapRef,
} from "@vis.gl/react-maplibre";
import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import { Crosshair } from "lucide-react";
import type { StyleSpecification } from "maplibre-gl";
import proj4 from "proj4";
import { useEffect, useRef, useState } from "react";
import type { FormRow } from "./forms-utils";

type GeoJsonFeatureCollection = FeatureCollection<Geometry, Record<string, unknown>>;

type MapPointProps = {
  id: string;
  nombre: string;
  telefono: string;
  fecha: string;
  candidate: string;
  zona: string;
  fotoUrl: string | null;
};

type MapPointFeature = Feature<Point, MapPointProps>;

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

const DEPARTAMENTO_FILL = "rgba(148, 163, 184, 0.35)";
const DEPARTAMENTO_LINE = "rgba(148, 163, 184, 0.9)";

const parseZone = (zona: string) => {
  const normalized = zona.trim().toUpperCase();
  const zoneMatch = normalized.match(/\d+/);
  if (!zoneMatch) return null;
  const zoneNumber = Number(zoneMatch[0]);
  if (!Number.isFinite(zoneNumber)) return null;
  const hasHemisphere = normalized.includes("S") || normalized.includes("N");
  const isSouth = normalized.includes("S") || normalized.includes("SUR") || !hasHemisphere;
  return { zoneNumber, isSouth };
};

const toLonLat = (row: FormRow) => {
  const zone = parseZone(row.zona);
  if (!zone) return null;
  const projection = `+proj=utm +zone=${zone.zoneNumber} ${
    zone.isSouth ? "+south " : ""
  }+datum=WGS84 +units=m +no_defs`;

  try {
    const [longitude, latitude] = proj4(projection, "EPSG:4326", [row.x, row.y]);
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;
    return [longitude, latitude] as [number, number];
  } catch {
    return null;
  }
};

type FormsMapProps = {
  rows: FormRow[];
};

export default function FormsMap({ rows }: FormsMapProps) {
  const [departamentos, setDepartamentos] = useState<GeoJsonFeatureCollection | null>(
    null,
  );
  const mapRef = useRef<MapRef | null>(null);
  const defaultCenter = [-75.5, -9.2] as [number, number];
  const defaultZoom = 5.03;

  useEffect(() => {
    let isActive = true;

    const loadDepartamentos = async () => {
      const response = await fetch("/mapa-guillermo/departamentos.geojson");
      if (!response.ok) return;
      const data = (await response.json()) as GeoJsonFeatureCollection;
      if (!isActive) return;
      setDepartamentos(data);
    };

    void loadDepartamentos();
    return () => {
      isActive = false;
    };
  }, []);

  const points: FeatureCollection<Point, MapPointProps> = {
    type: "FeatureCollection",
    features: rows
      .map((row) => {
        const coordinates = toLonLat(row);
        if (!coordinates) return null;
        const feature: MapPointFeature = {
          type: "Feature" as const,
          geometry: { type: "Point", coordinates },
          properties: {
            id: row.id,
            nombre: row.nombre,
            telefono: row.telefono,
            fecha: row.fecha,
            candidate: row.candidate,
            zona: row.zona,
            fotoUrl: row.fotoUrl,
          },
        };
        return feature;
      })
      .filter((feature): feature is MapPointFeature => feature !== null),
  };

  return (
    <div className="relative h-full w-full">
      <MapLibreMap
        ref={mapRef}
        initialViewState={{
          longitude: defaultCenter[0],
          latitude: defaultCenter[1],
          zoom: defaultZoom,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        {departamentos ? (
          <Source id="departamentos" type="geojson" data={departamentos}>
            <Layer
              id="departamentos-fill"
              type="fill"
              paint={{
                "fill-color": DEPARTAMENTO_FILL,
                "fill-opacity": 0.6,
              }}
            />
            <Layer
              id="departamentos-line"
              type="line"
              paint={{
                "line-color": DEPARTAMENTO_LINE,
                "line-width": 1,
              }}
            />
          </Source>
        ) : null}
        {points.features.length ? (
          <Source id="form-points" type="geojson" data={points}>
            <Layer
              id="form-points-layer"
              type="circle"
              paint={{
                "circle-radius": 4.5,
                "circle-color": "#38bdf8",
                "circle-stroke-color": "rgba(15, 23, 42, 0.35)",
                "circle-stroke-width": 0.6,
              }}
            />
          </Source>
        ) : null}
      </MapLibreMap>
      <button
        type="button"
        onClick={() =>
          mapRef.current?.easeTo({
            center: defaultCenter,
            zoom: defaultZoom,
            duration: 650,
          })
        }
        className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        aria-label="Centrar mapa"
      >
        <Crosshair className="h-4 w-4" aria-hidden="true" />
        <span>Centrar mapa</span>
      </button>
    </div>
  );
}
