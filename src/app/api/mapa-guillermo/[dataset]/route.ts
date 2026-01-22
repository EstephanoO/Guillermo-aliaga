import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: { dataset: string } },
) {
  const raw = context.params.dataset;
  const normalized = decodeURIComponent(raw)
    .replace(/\.geojson$/i, "")
    .replace(/[^a-z0-9_-]/gi, "");

  const filePath = path.join(
    process.cwd(),
    "src",
    "db",
    "constants",
    "mapa-guillermo",
    `${normalized}.geojson`,
  );

  try {
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "application/geo+json" },
    });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el archivo" }, { status: 500 });
  }
}
