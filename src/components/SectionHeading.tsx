import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'dark',
  as: Tag = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className={cn('eyebrow mb-3', tone === 'light' && 'text-gold')}>{eyebrow}</p>}
      <Tag
        id={id}
        className={cn(
          'text-3xl font-semibold leading-tight sm:text-4xl',
          tone === 'light' ? 'text-ivory' : 'text-navy',
        )}
      >
        {title}
      </Tag>
      {align === 'center' && <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-gold" />}
      {description && (
        <p className={cn('mt-5 text-base leading-relaxed', tone === 'light' ? 'text-ivory/75' : 'text-charcoal/75')}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
