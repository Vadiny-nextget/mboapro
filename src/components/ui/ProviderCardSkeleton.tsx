/** État de chargement de ProviderCard, réutilise les classes shimmer du design system. */
export default function ProviderCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-subtle bg-surface shadow-sm">
      <div className="skeleton-card" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="skeleton-avatar" style={{ width: 32, height: 32 }} />
          <div className="flex-1">
            <div className="skeleton-text skeleton-text--w-75" />
            <div className="skeleton-text skeleton-text--w-50" />
          </div>
        </div>
        <div className="skeleton-text skeleton-text--w-50" />
        <div className="flex gap-2">
          <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 999 }} />
          <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 999 }} />
        </div>
        <hr className="border-subtle" />
        <div className="flex items-center justify-between">
          <div className="skeleton-text skeleton-text--w-25" />
          <div className="skeleton-text skeleton-text--w-25" />
        </div>
      </div>
    </div>
  );
}