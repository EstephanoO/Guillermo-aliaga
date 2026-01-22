import { heroStats } from "../../db/dashboardData";
import KpiCard from "./components/KpiCard";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function HeroCard() {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.18)]">
      <div className="mt-3 flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-[0.32em]"
          style={{ color: "var(--text-2)" }}
        >
          Seguidores totales
        </p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {heroStats.map((stat) => (
          <KpiCard
            key={stat.label}
            label={stat.label}
            value={formatNumber(stat.value)}
            detail={stat.detail}
            delta={stat.delta}
            accent={stat.accent}
          />
        ))}
      </div>
    </section>
  );
}
