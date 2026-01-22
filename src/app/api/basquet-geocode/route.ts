import { NextResponse } from "next/server";

type BasquetItem = {
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  [key: string]: unknown;
};

type GeocodeResult = {
  lat: number;
  lon: number;
} | null;

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const buildQuery = (item: BasquetItem) =>
  [item.direccion, item.distrito, item.provincia, item.departamento, "Peru"]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)
    .join(", ");

const geocode = async (query: string): Promise<GeocodeResult> => {
  if (!query) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    query,
  )}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "basquet-map/1.0 (contact: kczmckck@gmail.com)",
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data.length) return null;

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
  };
};

export async function POST(req: Request) {
  const items = (await req.json()) as BasquetItem[];

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Expected array" }, { status: 400 });
  }

  const results: Array<BasquetItem & Partial<GeocodeResult>> = [];

  for (const item of items) {
    const query = buildQuery(item);
    const geo = await geocode(query);
    results.push({
      ...item,
      ...(geo ?? {}),
    });

    await sleep(1100);
  }

  return NextResponse.json(results);
}
