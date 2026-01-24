"use client";

import { useEffect, useState } from "react";
import type { FormRow } from "../components/forms-utils";

type FormsStatus = "idle" | "loading" | "ready" | "error";

export const useFormsData = (candidate?: string) => {
  const [rows, setRows] = useState<FormRow[]>([]);
  const [status, setStatus] = useState<FormsStatus>("idle");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let isActive = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const fetchRows = async () => {
      setStatus((current) => (current === "idle" ? "loading" : current));
      const query = candidate
        ? `?candidate=${encodeURIComponent(candidate)}`
        : "";
      try {
        const response = await fetch(`/api/forms${query}`);
        if (!response.ok) throw new Error("Failed to load forms");
        const data = (await response.json()) as { rows: FormRow[] };
        if (!isActive) return;
        setRows(data.rows ?? []);
        setStatus("ready");
        setUpdatedAt(new Date());
      } catch (error) {
        if (!isActive) return;
        setStatus("error");
      }
    };

    void fetchRows();
    timer = setInterval(fetchRows, 5000);

    return () => {
      isActive = false;
      if (timer) clearInterval(timer);
    };
  }, [candidate]);

  return { rows, status, updatedAt };
};
