import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

type SomistasRow = {
  dni?: string | number;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  nombres?: string;
  apellidos?: string;
  whatsapp?: string | number;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets["Somistas"];

  if (!sheet) {
    return NextResponse.json(
      { error: "Somistas sheet not found" },
      { status: 404 },
    );
  }

  const rows = XLSX.utils.sheet_to_json<SomistasRow>(sheet);
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
