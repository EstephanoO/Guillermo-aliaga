type LoadingSkeletonProps = {
  lines?: number;
};

export default function LoadingSkeleton({ lines = 3 }: LoadingSkeletonProps) {
  const keys = Array.from({ length: lines }, (_, idx) => `skeleton-${lines}-${idx}`);
  return (
    <div className="space-y-3">
      {keys.map((key) => (
        <div
          key={key}
          className="h-4 w-full animate-pulse rounded-full bg-[color:var(--surface-strong)]"
        />
      ))}
    </div>
  );
}
