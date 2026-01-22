import Image from "next/image";
import { voteGoal } from "../../db/dashboardData";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function DashboardHeader() {
  const potentialVoters = 2000;
  const projectedVotes = 1000;
  const currentVotes = 0;

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
          <h1 className="text-lg font-semibold uppercase tracking-[0.12em] text-[color:var(--text-1)] md:text-xl">
            Guillermo Aliaga
          </h1>
          <p className="mt-1 text-sm font-semibold text-[color:var(--text-1)]">
            Partido Democrático Somos Perú
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
            Senador Nacional #1
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
            <p className="mt-2 text-xl font-semibold text-[color:var(--text-1)]">
              {formatNumber(potentialVoters)} / {formatNumber(voteGoal)}
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--text-1)]">
              Proyección de votos
            </p>
            <p className="mt-2 text-xl font-semibold text-[color:var(--text-1)]">
              {formatNumber(projectedVotes)} / {formatNumber(voteGoal)}
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <div className="flex h-full flex-col justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--text-1)]">
                Votos
              </p>
              <p className="text-xl font-semibold text-[color:var(--text-1)]">
                {formatNumber(currentVotes)} / {formatNumber(voteGoal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
