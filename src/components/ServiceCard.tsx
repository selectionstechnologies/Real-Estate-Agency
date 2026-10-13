import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Service } from '../data/content';

export function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  const Icon = service.icon;
  return (
    <article
      id={service.id}
      className="group flex h-full scroll-mt-28 flex-col rounded-2xl border border-navy/5 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{service.summary}</p>
      {detailed && (
        <ul className="mt-5 space-y-2">
          {service.points.map((pt) => (
            <li key={pt} className="flex items-start gap-2 text-sm text-charcoal/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
              {pt}
            </li>
          ))}
        </ul>
      )}
      <Link
        to={detailed ? service.cta.to : `/services#${service.id}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-navy transition hover:text-gold-deep"
      >
        {detailed ? service.cta.label : 'Learn more'}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        {!detailed && <span className="sr-only">about {service.title}</span>}
      </Link>
    </article>
  );
}
