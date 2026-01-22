type StackedBarItem = {
  name: string;
  value: number;
  color: string;
};

type StackedBarCardProps = {
  items: StackedBarItem[];
  total: number;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function StackedBarCard({
  items,
  total,
}: StackedBarCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-2)]">
        {items.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
        {items.map((entry, index) => {
          const entryPercent = total > 0 ? (entry.value / total) * 100 : 0;
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          return (
            <div
              key={entry.name}
              className="h-full"
              style={{
                width: `${entryPercent}%`,
                backgroundColor: entry.color,
                borderTopLeftRadius: isFirst ? 9999 : 0,
                borderBottomLeftRadius: isFirst ? 9999 : 0,
                borderTopRightRadius: isLast ? 9999 : 0,
                borderBottomRightRadius: isLast ? 9999 : 0,
              }}
            />
          );
        })}
      </div>
      <div className="grid gap-2 text-xs font-semibold text-[color:var(--text-2)] sm:grid-cols-2">
        {items.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between">
            <span>{entry.name}</span>
            <span className="text-sm font-semibold text-[color:var(--text-1)]">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
