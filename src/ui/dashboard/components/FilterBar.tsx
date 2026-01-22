type FilterOption<T extends string> = {
  id: T;
  label: string;
};

type FilterBarProps<T extends string> = {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
};

export default function FilterBar<T extends string>({
  value,
  options,
  onChange,
}: FilterBarProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
            value === option.id
              ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/60 dark:text-emerald-200"
              : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-2)] hover:border-[color:var(--text-2)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
