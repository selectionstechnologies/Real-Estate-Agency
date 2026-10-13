import { Bath, BedDouble, MapPin, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listingTypeLabels, propertyTypeLabels } from '../data/properties';
import type { Property } from '../types';
import { cn } from '../utils/cn';
import { formatLocation, formatNumber, formatPrice } from '../utils/format';
import { FavoriteButton } from './FavoriteButton';
import { SmartImage } from './SmartImage';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  className?: string;
}

export function PropertyCard({ property: p, priority, className }: PropertyCardProps) {
  const cover = p.images[0];
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative">
        <SmartImage
          photoId={cover.id}
          alt={cover.alt}
          priority={priority}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              p.listingType === 'sale' ? 'bg-navy text-ivory' : 'bg-gold text-navy',
            )}
          >
            {listingTypeLabels[p.listingType]}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-navy backdrop-blur">
            {propertyTypeLabels[p.propertyType]}
          </span>
        </div>
        <FavoriteButton propertyId={p.id} propertyTitle={p.title} className="absolute right-4 top-4 z-10" />
        <p className="absolute bottom-4 left-4 font-serif text-2xl font-semibold text-white drop-shadow">
          {formatPrice(p)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">
          {/* Stretched link: the whole card is clickable, the favorite button sits above it */}
          <Link
            to={`/properties/${p.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-gold-deep"
          >
            {p.title}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-charcoal/70">
          <MapPin className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
          {formatLocation(p)}
        </p>
        <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-beige pt-4 text-sm text-charcoal/80">
          {p.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <dt>
                <BedDouble className="h-4 w-4 text-navy/60" aria-hidden />
                <span className="sr-only">Bedrooms</span>
              </dt>
              <dd>{p.bedrooms} Beds</dd>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <dt>
              <Bath className="h-4 w-4 text-navy/60" aria-hidden />
              <span className="sr-only">Bathrooms</span>
            </dt>
            <dd>{p.bathrooms} Baths</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>
              <Maximize2 className="h-4 w-4 text-navy/60" aria-hidden />
              <span className="sr-only">Area</span>
            </dt>
            <dd>{formatNumber(p.area)} sq ft</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
