import { Loader2 } from 'lucide-react';

/** Skeleton cards matching the PropertyCard layout. */
export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card" aria-hidden>
      <div className="relative aspect-[4/3] overflow-hidden bg-beige">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-5 w-1/3 rounded bg-beige" />
        <div className="h-5 w-3/4 rounded bg-beige" />
        <div className="h-4 w-1/2 rounded bg-beige" />
        <div className="flex gap-4 border-t border-beige pt-4">
          <div className="h-4 w-12 rounded bg-beige" />
          <div className="h-4 w-12 rounded bg-beige" />
          <div className="h-4 w-16 rounded bg-beige" />
        </div>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  variant?: 'cards' | 'spinner';
  count?: number;
  label?: string;
}

export function LoadingState({ variant = 'cards', count = 6, label = 'Loading properties…' }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div role="status" className="flex flex-col items-center justify-center gap-3 py-24 text-navy/70">
        <Loader2 className="h-8 w-8 animate-spin text-gold" aria-hidden />
        <p className="text-sm">{label}</p>
      </div>
    );
  }
  return (
    <div role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
