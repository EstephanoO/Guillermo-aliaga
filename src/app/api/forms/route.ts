import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { getDb } from "../../lib/db";
import { forms } from "../../lib/schema";

type FormRow = {
  id: string;
  nombre: string;
  telefono: string;
  fecha: Date;
  x: number;
  y: number;
  zona: string;
  candidate: string;
  fotoUrl: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const candidate = searchParams.get("candidate")?.trim().toLowerCase();
  const db = getDb();

  const baseQuery = db
    .select({
      id: forms.id,
      nombre: forms.nombre,
      telefono: forms.telefono,
      fecha: forms.fecha,
      x: forms.x,
      y: forms.y,
      zona: forms.zona,
      candidate: forms.candidate,
      fotoUrl: forms.fotoUrl,
    })
    .from(forms)
    .orderBy(desc(forms.fecha));

  const rows = (candidate
    ? await baseQuery.where(sql`LOWER(${forms.candidate}) = ${candidate}`)
    : await baseQuery) as FormRow[];

  return NextResponse.json({
    rows: rows.map((row) => ({
      ...row,
      fecha:
        row.fecha instanceof Date
          ? row.fecha.toISOString()
          : new Date(row.fecha).toISOString(),
    })),
  });
}
