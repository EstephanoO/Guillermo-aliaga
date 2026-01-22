import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import path from "path";

type BasquetRow = {
  dni?: string | number;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  nombres?: string;
  apellidos?: string;
  whatsapp?: string | number;
};

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Landings.xlsx");
  const file = await readFile(filePath);
  const workbook = XLSX.read(file, { type: "buffer" });
  const sheet = workbook.Sheets["Basquet"];

  if (!sheet) {
    return NextResponse.json(
      { error: "Basquet sheet not found" },
      { status: 404 },
    );
  }

  const rows = XLSX.utils.sheet_to_json<BasquetRow>(sheet);
  const data = rows.map((row) => ({
    dni: row.dni ?? "",
    direccion: row.direccion ?? "",
    departamento: row.departamento ?? "",
    provincia: row.provincia ?? "",
    distrito: row.distrito ?? "",
    nombres: row.nombres ?? "",
    apellidos: row.apellidos ?? "",
    whatsapp: row.whatsapp ?? "",
  }));

  return NextResponse.json(data);
}
