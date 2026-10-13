import { Facebook, Instagram, Linkedin, Youtube, type LucideIcon } from 'lucide-react';
import { siteConfig } from '../config/site';
import { cn } from '../utils/cn';

const icons: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
  YouTube: Youtube,
};

export function SocialIcons({ className }: { className?: string }) {
  return (
    <ul className={cn('flex gap-2', className)}>
      {siteConfig.social.map((s) => {
        const Icon = icons[s.label];
        return (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteConfig.name} on ${s.label} (opens in a new tab)`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition hover:border-gold hover:bg-gold hover:text-navy"
            >
              <Icon className="h-4 w-4" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
