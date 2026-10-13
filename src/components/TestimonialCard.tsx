import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '../data/content';
import { SmartImage } from './SmartImage';

export function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-card">
      <Quote className="h-8 w-8 text-gold" aria-hidden />
      <div className="mt-4 flex gap-0.5" role="img" aria-label={`Rated ${t.rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden
            className={i < t.rating ? 'h-4 w-4 fill-gold text-gold' : 'h-4 w-4 text-navy/20'}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-charcoal/85">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-beige pt-5">
        <SmartImage
          photoId={t.photo}
          alt=""
          aspect={1}
          widths={[96, 192]}
          sizes="48px"
          faces
          className="h-12 w-12 shrink-0 rounded-full"
        />
        <div>
          <p className="font-semibold text-navy">{t.name}</p>
          <p className="text-xs text-charcoal/65">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
