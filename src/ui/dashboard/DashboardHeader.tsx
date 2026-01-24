import Image from "next/image";
import { CONTACTOS_FORMULARIOS } from "../../db/constants/dashboard";
import { voteGoal } from "../../db/dashboardData";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function DashboardHeader() {
  const potentialVoters = 2000;
  const projectedVotes = 1000;
  const currentVotes = 0;
  const totalContacts = CONTACTOS_FORMULARIOS.reduce((sum, item) => sum + item.leads, 0);
  const potentialPercent = (potentialVoters / voteGoal) * 100;
  const projectedPercent = (projectedVotes / voteGoal) * 100;
  const currentPercent = (currentVotes / voteGoal) * 100;

  return (
    <header className="border-b border-[color:var(--border)] bg-[color:var(--card)] shadow-[0_8px_20px_-16px_rgba(15,23,42,0.16)]">
      <div className="flex w-full flex-col gap-2 px-2 py-2 md:flex-row md:items-center md:gap-5 md:px-6">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[color:var(--border)] shadow-[0_6px_16px_-14px_rgba(15,23,42,0.16)]">
          <Image
            src="/GUILLERMO.jpg"
            alt="Guillermo Aliaga"
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold uppercase tracking-[0.12em] text-[color:var(--text-1)] md:text-xl">
              Rocio Porras
            </h1>
            <div
              className="rounded-xl border px-3 py-2"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--text-2)" }}
              >
                Contactos conseguidos
              </p>
              <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--text-1)" }}>
                {formatNumber(totalContacts)}
              </p>
            </div>
          </div>
          <p className="mt-1 text-sm font-semibold text-[color:var(--text-1)]">Somos Perú</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
            Rocio Porras · Senadora Nacional #4
          </p>
          <span className="mt-2 inline-flex w-fit items-center rounded-full border border-blue-200/70 bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-200">
            En crecimiento
          </span>
        </div>
        <div className="flex w-full flex-col gap-3 md:ml-5 md:w-auto md:flex-none md:flex-row">
          <div className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--text-1)]">
              Potenciales votantes
            </p>
            <div className="mt-2 flex items-center justify-between gap-3 text-xl font-semibold text-[color:var(--text-1)]">
              <span>
                {formatNumber(potentialVoters)} / {formatNumber(voteGoal)}
              </span>
              <span className="text-sm font-semibold text-[color:var(--text-2)]">
                {potentialPercent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${Math.min(100, potentialPercent)}%` }}
              />
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--text-1)]">
              Proyección de votos
            </p>
            <div className="mt-2 flex items-center justify-between gap-3 text-xl font-semibold text-[color:var(--text-1)]">
              <span>
                {formatNumber(projectedVotes)} / {formatNumber(voteGoal)}
              </span>
              <span className="text-sm font-semibold text-[color:var(--text-2)]">
                {projectedPercent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${Math.min(100, projectedPercent)}%` }}
              />
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <div className="flex h-full flex-col justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--text-1)]">
                Votos
              </p>
              <div className="flex w-full items-center justify-between gap-3 text-xl font-semibold text-[color:var(--text-1)]">
                <span>
                  {formatNumber(currentVotes)} / {formatNumber(voteGoal)}
                </span>
                <span className="ml-3 text-sm font-semibold text-[color:var(--text-2)]">
                  {currentPercent.toFixed(1)}%
                </span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${Math.min(100, currentPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
