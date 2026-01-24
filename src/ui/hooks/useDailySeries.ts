import { useEffect, useState } from "react";
import { FACEBOOK_DATASET_PATH } from "../../db/constants/dashboard";
import type { DailyPoint, FacebookPost } from "../types/dashboard";

export const useDailySeries = () => {
  const [dailySeries, setDailySeries] = useState<DailyPoint[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(FACEBOOK_DATASET_PATH);
        if (!res.ok) throw new Error("Dataset no disponible");
        const posts = (await res.json()) as FacebookPost[];
        const dailyMap = new Map<string, DailyPoint>();
        posts.forEach((post) => {
          const date = new Date(post.time);
          if (Number.isNaN(date.getTime())) return;
          const key = date.toISOString().slice(0, 10);
          const reach = post.viewsCount ?? 0;
          const interactions =
            (post.likes ?? 0) + (post.comments ?? 0) + (post.shares ?? 0);
          const existing = dailyMap.get(key) ?? {
            dateKey: key,
            reach: 0,
            interactions: 0,
          };
          existing.reach += reach;
          existing.interactions += interactions;
          dailyMap.set(key, existing);
        });
        const sortedSeries = Array.from(dailyMap.values())
          .filter((item) => item.dateKey >= "2025-01-01")
          .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
        if (mounted) setDailySeries(sortedSeries);
      } catch {
        if (mounted) setDailySeries([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { dailySeries };
};
