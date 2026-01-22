import { csvUrl } from "../../db/dashboardData";

export default function CampaignDataStrip() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-xs font-semibold text-[color:var(--text-2)] shadow-[0_10px_22px_-18px_rgba(15,23,42,0.16)]">
      <div className="uppercase tracking-[0.28em]">
        Fuente: CSV campañas 2025-2026
      </div>
      <a
        href={csvUrl}
        download
        className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-2)] transition hover:border-[color:var(--text-2)]"
      >
        Descargar CSV
      </a>
    </div>
  );
}
