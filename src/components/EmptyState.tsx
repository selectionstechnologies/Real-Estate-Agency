import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  /** Use h1 when the empty state is the main content of the page. */
  headingLevel?: 'h1' | 'h2';
}

export function EmptyState({ icon: Icon, title, description, action, headingLevel: Heading = 'h2' }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-navy/15 bg-white/60 px-6 py-14 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-beige text-gold-deep">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <Heading className="text-xl font-semibold">{title}</Heading>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{description}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
