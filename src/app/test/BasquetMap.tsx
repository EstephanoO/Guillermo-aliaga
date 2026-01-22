"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

type BasquetPoint = {
  lat?: number;
  lon?: number;
  [key: string]: unknown;
};

type BasquetMapProps = {
  points: BasquetPoint[];
};

export default function BasquetMap({ points }: BasquetMapProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-77.03, -12.04],
      zoom: 5,
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
    });

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const buildTooltipHtml = (props: BasquetPoint) => {
      const nombre = [props.nombres, props.apellidos]
        .filter((item) => typeof item === "string" && item.trim().length > 0)
        .join(" ");
      const dni =
        typeof props.dni === "string" || typeof props.dni === "number"
          ? String(props.dni)
          : "";
      const whatsapp =
        typeof props.whatsapp === "string" || typeof props.whatsapp === "number"
          ? String(props.whatsapp)
          : "";

      return `
        <div style="display:flex;flex-direction:column;gap:6px;font-family:var(--font-geist-sans, sans-serif);">
          <div style="font-weight:600;font-size:13px;color:#0f172a;">${escapeHtml(
            nombre || "Sin nombre",
          )}</div>
          <div style="font-size:12px;color:#334155;">
            DNI: ${escapeHtml(dni || "Sin dato")}
          </div>
          <div style="font-size:12px;color:#334155;">
            WhatsApp: ${escapeHtml(whatsapp || "Sin dato")}
          </div>
        </div>
      `;
    };

    map.on("load", () => {
      const features = points
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon))
        .map((point) => ({
          type: "Feature" as const,
          properties: point,
          geometry: {
            type: "Point" as const,
            coordinates: [point.lon as number, point.lat as number],
          },
        }));

      map.addSource("basquet", {
        type: "geojson",
        data: {
          type: "FeatureCollection" as const,
          features,
        },
      });

      map.addLayer({
        id: "basquet-points",
        type: "circle",
        source: "basquet",
        paint: {
          "circle-radius": 6,
          "circle-color": "#38bdf8",
          "circle-stroke-color": "#0f172a",
          "circle-stroke-width": 1,
        },
      });

      map.on("mouseenter", "basquet-points", (event) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = event.features?.[0];
        if (!feature) return;
        const { lng, lat } = event.lngLat;
        popup.setLngLat([lng, lat]);
        popup.setHTML(buildTooltipHtml(feature.properties ?? {}));
        popup.addTo(map);
      });

      map.on("mouseleave", "basquet-points", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    return () => {
      map.remove();
    };
  }, [points]);

  return (
    <div
      ref={ref}
      className="h-[520px] w-full rounded-2xl border border-[color:var(--border)]"
    />
  );
}
