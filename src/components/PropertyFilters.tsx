import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { propertyTypeLabels } from '../data/properties';
import type { ListingType, PropertyFilters as Filters, PropertyType, SortOption } from '../types';
import { cn } from '../utils/cn';
import { countActiveFilters } from '../utils/filterProperties';

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}

const listingTabs: { value: ListingType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sale', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
];

const parsePrice = (v: string) => {
  if (v.trim() === '') return null;
  const n = Number(v.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : null;
};

export function PropertyFilters({ filters, onChange, onReset }: PropertyFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Local text state so typing doesn't trigger a fetch on every keystroke.
  const [query, setQuery] = useState(filters.query);
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '');

  useEffect(() => setQuery(filters.query), [filters.query]);
  useEffect(() => setMinPrice(filters.minPrice?.toString() ?? ''), [filters.minPrice]);
  useEffect(() => setMaxPrice(filters.maxPrice?.toString() ?? ''), [filters.maxPrice]);

  // Debounce text inputs; read the latest filters via ref so other controls changed meanwhile aren't overwritten.
  const latest = useRef({ filters, onChange });
  latest.current = { filters, onChange };
  useEffect(() => {
    const t = window.setTimeout(() => {
      const { filters: f, onChange: emit } = latest.current;
      const min = parsePrice(minPrice);
      const max = parsePrice(maxPrice);
      if (query !== f.query || min !== f.minPrice || max !== f.maxPrice) {
        emit({ ...f, query, minPrice: min, maxPrice: max });
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [query, minPrice, maxPrice]);

  const priceInvalid =
    filters.minPrice != null && filters.maxPrice != null && filters.minPrice > filters.maxPrice;
  const active = countActiveFilters(filters);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <label htmlFor="filter-query" className="sr-only">
            Search by property name or location
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" aria-hidden />
          <input
            id="filter-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city or neighborhood"
            className="field-input pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-full bg-beige/70 p-1" role="radiogroup" aria-label="Listing type">
            {listingTabs.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={filters.listingType === t.value}
                onClick={() => onChange({ ...filters, listingType: t.value })}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition',
                  filters.listingType === t.value ? 'bg-navy text-ivory shadow-sm' : 'text-navy/70 hover:text-navy',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="advanced-filters"
            className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters{active > 0 && ` (${active})`}
          </button>
        </div>
      </div>

      <div
        id="advanced-filters"
        className={cn('mt-4 grid gap-3 sm:grid-cols-2 md:grid md:grid-cols-5', mobileOpen ? 'grid' : 'hidden')}
      >
        <div>
          <label htmlFor="filter-type" className="field-label">
            Property type
          </label>
          <select
            id="filter-type"
            value={filters.propertyType}
            onChange={(e) => onChange({ ...filters, propertyType: e.target.value as PropertyType | 'all' })}
            className="field-input"
          >
            <option value="all">All types</option>
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-min" className="field-label">
            Min price ($)
          </label>
          <input
            id="filter-min"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="No min"
            aria-invalid={priceInvalid ? 'true' : 'false'}
            aria-describedby={priceInvalid ? 'price-error' : undefined}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="filter-max" className="field-label">
            Max price ($)
          </label>
          <input
            id="filter-max"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="No max"
            aria-invalid={priceInvalid ? 'true' : 'false'}
            aria-describedby={priceInvalid ? 'price-error' : undefined}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="filter-beds" className="field-label">
            Bedrooms
          </label>
          <select
            id="filter-beds"
            value={filters.minBedrooms ?? ''}
            onChange={(e) => onChange({ ...filters, minBedrooms: e.target.value ? Number(e.target.value) : null })}
            className="field-input"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-sort" className="field-label">
            Sort by
          </label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
            className="field-input"
          >
            <option value="newest">Newest listings</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {priceInvalid ? (
          <p id="price-error" className="field-error mt-0">
            Minimum price is higher than maximum price.
          </p>
        ) : (
          <p className="text-xs text-charcoal/60">Rental prices are monthly. Sale prices are asking prices.</p>
        )}
        {active > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-md text-sm font-medium text-gold-deep hover:text-navy"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Clear filters ({active})
          </button>
        )}
      </div>
    </div>
  );
}
