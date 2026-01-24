import { useEffect, useState } from "react";
import { PANORAMA_REPORT_PATH } from "../../db/constants/dashboard";
import type { PanoramaData } from "../types/dashboard";
import {
  createEmptyPanoramaData,
  parsePanoramaCSV,
} from "../utils/panoramaParser";

export const usePanoramaData = () => {
  const [panoramaData, setPanoramaData] = useState<PanoramaData>(() =>
    createEmptyPanoramaData(),
  );
  const [panoramaError, setPanoramaError] = useState<string | null>(null);
  const [panoramaLoading, setPanoramaLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPanoramaLoading(true);
        setPanoramaError(null);
        const res = await fetch(encodeURI(PANORAMA_REPORT_PATH));
        if (!res.ok) throw new Error("No se pudo cargar el informe panorámico");
        const text = await res.text();
        const parsed = parsePanoramaCSV(text);
        if (mounted) setPanoramaData(parsed);
      } catch (err) {
        if (mounted) {
          setPanoramaError(
            err instanceof Error ? err.message : "Error cargando informe",
          );
          setPanoramaData(createEmptyPanoramaData());
        }
      } finally {
        if (mounted) setPanoramaLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { panoramaData, panoramaError, panoramaLoading };
};
