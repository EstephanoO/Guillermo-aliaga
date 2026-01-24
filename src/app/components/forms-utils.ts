export type FormRow = {
  id: string;
  nombre: string;
  telefono: string;
  fecha: string;
  x: number;
  y: number;
  zona: string;
  candidate: string;
  fotoUrl: string | null;
};

export const toUiRows = (rows: FormRow[]) => rows.map((row) => ({ ...row }));
