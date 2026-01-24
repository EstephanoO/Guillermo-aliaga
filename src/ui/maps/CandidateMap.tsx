"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import {
  Map as MapLibreMap,
  Source,
  Layer,
  type MapRef,
} from "@vis.gl/react-maplibre";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Crosshair } from "lucide-react";
import type { StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

type GeoJsonFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;

type CandidateMapProps = {
  candidate: string;
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

const DEPARTAMENTO_FILL = "rgba(148, 163, 184, 0.35)";
const DEPARTAMENTO_LINE = "rgba(148, 163, 184, 0.9)";

export default function CandidateMap({ candidate }: CandidateMapProps) {
  const [departamentos, setDepartamentos] = useState<GeoJsonFeatureCollection | null>(
    null,
  );
  const [points, setPoints] = useState<GeoJsonFeatureCollection | null>(null);
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

  useEffect(() => {
    let isActive = true;

    const loadPoints = async () => {
      if (!candidate) return;
      const response = await fetch(
        `/api/forms?candidate=${encodeURIComponent(candidate)}`,
      );
      if (!response.ok) return;
      const data = (await response.json()) as GeoJsonFeatureCollection;
      if (!isActive) return;
      setPoints(data);
    };

    void loadPoints();
    return () => {
      isActive = false;
    };
  }, [candidate]);

  return (
    <div className="relative h-full w-full">
      <MapLibreMap
        ref={mapRef}
        initialViewState={{ longitude: defaultCenter[0], latitude: defaultCenter[1], zoom: defaultZoom }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
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
        {points ? (
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
          mapRef.current?.easeTo({ center: defaultCenter, zoom: defaultZoom, duration: 650 })
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
