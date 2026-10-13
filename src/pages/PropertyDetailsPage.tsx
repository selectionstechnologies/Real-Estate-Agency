import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  GraduationCap,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  Maximize2,
  ShoppingBag,
  Train,
  Trees,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AgentCard } from '../components/AgentCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { FavoriteButton } from '../components/FavoriteButton';
import { LoadingState } from '../components/LoadingState';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGallery } from '../components/PropertyGallery';
import { Reveal } from '../components/Reveal';
import { ViewingForm } from '../components/ViewingForm';
import { mailLink } from '../config/site';
import { listingTypeLabels, propertyTypeLabels } from '../data/properties';
import { usePageMeta } from '../hooks/usePageMeta';
import { fetchPropertyBySlug, getRelatedProperties } from '../services/propertyService';
import type { NearbyFacility, Property } from '../types';
import { formatDate, formatLocation, formatNumber, formatPrice } from '../utils/format';

const nearbyIcons: Record<NearbyFacility['category'], LucideIcon> = {
  school: GraduationCap,
  transport: Train,
  shopping: ShoppingBag,
  health: HeartPulse,
  leisure: Trees,
};

export function PropertyDetailsPage() {
  const { slug = '' } = useParams();
  const [property, setProperty] = useState<Property | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setProperty(undefined);
    fetchPropertyBySlug(slug)
      .then((p) => !cancelled && setProperty(p))
      .catch(() => !cancelled && setProperty(null));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  usePageMeta(
    property ? property.title : property === null ? 'Property not found' : 'Loading property',
    property ? `${property.summary} ${formatPrice(property)} · ${formatLocation(property)}` : undefined,
  );

  if (property === undefined) {
    return (
      <div className="container-lux pb-24 pt-[120px]">
        <LoadingState variant="spinner" label="Loading property details…" />
      </div>
    );
  }

  if (property === null) {
    return (
      <div className="container-lux pb-24 pt-[140px]">
        <EmptyState
          headingLevel="h1"
          icon={Home}
          title="Property not found"
          description="This listing may have been removed, or the link is incorrect. Browse our current properties instead."
          action={
            <>
              <Button to="/properties">Browse properties</Button>
              <Button to="/contact" variant="outline">
                Contact us
              </Button>
            </>
          }
        />
      </div>
    );
  }

  const p = property;
  const related = getRelatedProperties(p);
  const specs = [
    p.bedrooms > 0 ? { icon: BedDouble, label: 'Bedrooms', value: String(p.bedrooms) } : null,
    { icon: Bath, label: 'Bathrooms', value: String(p.bathrooms) },
    { icon: Maximize2, label: 'Floor area', value: `${formatNumber(p.area)} sq ft` },
    { icon: Building2, label: 'Property type', value: propertyTypeLabels[p.propertyType] },
    { icon: Car, label: 'Parking', value: p.parking ? `${p.parking} spaces` : 'None' },
    { icon: CalendarDays, label: 'Year built', value: String(p.yearBuilt) },
  ].filter((s): s is { icon: LucideIcon; label: string; value: string } => s !== null);

  const scrollToViewing = () => document.getElementById('schedule-viewing')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <article className="pb-20 pt-[96px]">
      <div className="container-lux">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-medium text-navy/70 transition hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to properties
        </Link>

        <header className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  p.listingType === 'sale'
                    ? 'rounded-full bg-navy px-3 py-1 text-xs font-semibold text-ivory'
                    : 'rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy'
                }
              >
                {listingTypeLabels[p.listingType]}
              </span>
              <span className="rounded-full bg-beige px-3 py-1 text-xs font-medium text-navy">{propertyTypeLabels[p.propertyType]}</span>
              <span className="text-xs text-charcoal/60">Ref. {p.reference}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl lg:text-5xl">{p.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-charcoal/75">
              <MapPin className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
              {p.location.address}, {formatLocation(p)}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <p className="font-serif text-3xl font-semibold text-navy sm:text-4xl">
              {formatPrice(p)}
              {p.listingType === 'rent' && <span className="sr-only"> per month</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              <FavoriteButton propertyId={p.id} propertyTitle={p.title} variant="inline" />
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <PropertyGallery images={p.images} title={p.title} />

            <section aria-labelledby="specs-title">
              <h2 id="specs-title" className="sr-only">
                Specifications
              </h2>
              <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-card sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-beige text-gold-deep">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-charcoal/60">{s.label}</dt>
                      <dd className="font-semibold text-navy">{s.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            <Reveal as="section">
              <h2 className="text-2xl font-semibold">About this property</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-charcoal/85">
                {p.description.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </div>
              <p className="mt-4 text-xs text-charcoal/55">Listed {formatDate(p.createdAt)} · Demo listing — details are illustrative.</p>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2">
              <Reveal as="section" className="rounded-2xl bg-white p-6 shadow-card">
                <h2 className="text-xl font-semibold">Key features</h2>
                <ul className="mt-4 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal as="section" className="rounded-2xl bg-white p-6 shadow-card" delay={0.08}>
                <h2 className="text-xl font-semibold">Amenities</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.amenities.map((a) => (
                    <li key={a} className="rounded-full bg-beige/70 px-3 py-1.5 text-sm text-navy">
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal as="section" className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold">Nearby facilities</h2>
              <ul className="mt-4 divide-y divide-beige">
                {p.nearby.map((n) => {
                  const Icon = nearbyIcons[n.category];
                  return (
                    <li key={n.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                        {n.name}
                      </span>
                      <span className="shrink-0 text-charcoal/60">{n.distance}</span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            {p.listingType === 'sale' && <MortgageCalculator key={p.id} price={p.price} />}
          </div>

          <aside className="space-y-6" aria-label="Contact and viewing">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <Button onClick={scrollToViewing} size="lg" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
                Schedule a Viewing
              </Button>
              <Button
                href={mailLink(`Enquiry: ${p.title} (${p.reference})`, p.agent.email)}
                variant="outline"
                size="lg"
                icon={<Mail className="h-4 w-4" aria-hidden />}
              >
                Contact Agent
              </Button>
            </div>
            <AgentCard agent={p.agent} propertyTitle={p.title} propertyRef={p.reference} />
            <section id="schedule-viewing" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-card" aria-labelledby="viewing-title">
              <h2 id="viewing-title" className="text-xl font-semibold">
                Schedule a Viewing
              </h2>
              <p className="mb-5 mt-1 text-sm text-charcoal/70">Choose a time that suits you — in person or by video.</p>
              <ViewingForm key={p.id} property={p} />
            </section>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-3xl font-semibold">
                You may also like
              </h2>
              <Link to="/properties" className="text-sm font-semibold text-gold-deep hover:text-navy">
                View all
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Reveal as="li" key={r.id} delay={i * 0.08}>
                  <PropertyCard property={r} />
                </Reveal>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
