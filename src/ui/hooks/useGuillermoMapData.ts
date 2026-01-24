import { useEffect, useState } from "react";
import { GUILLERMO_MAP_DATASETS } from "../../db/constants/dashboard";
import type { MapData } from "../dashboard/GuillermoMap";

export const useGuillermoMapData = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadMap = async () => {
      try {
        const [departamentos, actividades, votantes, paneles] =
          await Promise.all(
            GUILLERMO_MAP_DATASETS.map(async (name) => {
              const response = await fetch(`/mapa-guillermo/${name}.geojson`);
              if (!response.ok) {
                throw new Error("No se pudo cargar los datos del mapa.");
              }
              return (await response.json()) as MapData["departamentos"];
            }),
          );
        if (!mounted) return;
        setMapData({ departamentos, actividades, votantes, paneles });
      } catch (err) {
        if (!mounted) return;
        setMapError(err instanceof Error ? err.message : "Error cargando mapa");
      }
    };

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  return { mapData, mapError };
};
