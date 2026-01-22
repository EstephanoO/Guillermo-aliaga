import SomistasMapClient from "./SomistasMapClient";

export default function SomistasPage() {
  return (
    <main className="min-h-screen bg-[color:var(--bg)] px-5 py-8 text-[color:var(--text-1)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--text-2)]">
            Familia Somista
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Mapa de registros
          </h1>
          <p className="mt-2 text-sm text-[color:var(--text-2)]">
            Direcciones geocodificadas desde Landings.xlsx (hoja Somistas).
          </p>
        </div>
        <SomistasMapClient />
      </div>
    </main>
  );
}
