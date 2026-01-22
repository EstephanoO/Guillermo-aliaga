type EmptyStateProps = {
  title: string;
  action: string;
};

export default function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-center text-sm font-semibold text-[color:var(--text-2)]">
      <p className="text-base font-semibold text-[color:var(--text-1)]">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--text-2)]">
        {action}
      </p>
    </div>
  );
}
