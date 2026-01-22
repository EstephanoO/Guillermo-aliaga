type KpiCardProps = {
  label: string;
  value: string;
  detail: string;
  delta: string;
  accent: string;
};

export default function KpiCard({
  label,
  value,
  detail,
  delta,
  accent,
}: KpiCardProps) {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
          {label}
        </p>
        <span className="text-[10px] font-semibold" style={{ color: accent }}>
          {delta}
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold text-[color:var(--text-1)]">
        {value}
      </p>
      <p className="text-xs font-semibold text-[color:var(--text-2)]">
        {detail}
      </p>
    </div>
  );
}
