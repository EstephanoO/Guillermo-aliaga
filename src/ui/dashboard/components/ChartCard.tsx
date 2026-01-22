import React from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
}: ChartCardProps) {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-2)]">
            {title}
          </p>
          {subtitle ? (
            <p className="text-xs font-semibold text-[color:var(--text-2)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
