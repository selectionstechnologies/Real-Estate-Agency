import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <Link to="/" className={cn('group flex items-center gap-2.5 rounded-md', className)} aria-label="LuxeEstate home">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
        <rect width="40" height="40" rx="10" className={tone === 'light' ? 'fill-ivory/10' : 'fill-navy'} />
        <path d="M10 29V17.5L20 10l10 7.5V29" fill="none" stroke="#C6A56B" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16.5 29v-7h7v7" fill="none" stroke="#FAF9F6" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
      <span className={cn('font-serif text-xl font-semibold tracking-tight', tone === 'light' ? 'text-ivory' : 'text-navy')}>
        Luxe<span className="text-gold">Estate</span>
      </span>
    </Link>
  );
}
