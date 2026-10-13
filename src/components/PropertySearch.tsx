import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { cities, propertyTypeLabels } from '../data/properties';
import type { ListingType, PropertyFilters, PropertyType } from '../types';
import { cn } from '../utils/cn';
import { budgetOptions, defaultFilters, filtersToParams } from '../utils/filterProperties';

/** Home-page search panel. Submits to /properties with the filters encoded in the URL. */
export function PropertySearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingType>('sale');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const [budget, setBudget] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const filters: PropertyFilters = {
      ...defaultFilters,
      query: location,
      listingType: listing,
      propertyType: type,
      maxPrice: budget ? Number(budget) : null,
    };
    navigate(`/properties?${filtersToParams(filters).toString()}`);
  };

  const selectClass =
    'w-full border-0 bg-transparent p-0 pr-8 text-sm font-medium text-navy focus:ring-0 cursor-pointer';

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Search properties"
      className={cn('rounded-2xl bg-white/95 p-2 shadow-lift backdrop-blur', className)}
    >
      <div className="flex gap-1 p-2 pb-3" role="radiogroup" aria-label="Buy or rent">
        {(['sale', 'rent'] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={listing === l}
            onClick={() => {
              setListing(l);
              setBudget('');
            }}
            className={cn(
              'rounded-full px-5 py-1.5 text-sm font-medium transition',
              listing === l ? 'bg-navy text-ivory' : 'text-navy/70 hover:bg-beige',
            )}
          >
            {l === 'sale' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl bg-beige md:grid-cols-[1.3fr_1fr_1fr_auto]">
        <div className="bg-white px-4 py-3">
          <label htmlFor="search-location" className="block text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
            Location
          </label>
          <input
            id="search-location"
            list="search-cities"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or neighborhood"
            className="w-full border-0 bg-transparent p-0 text-sm font-medium text-navy placeholder:text-navy/40 focus:ring-0"
          />
          <datalist id="search-cities">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="bg-white px-4 py-3">
          <label htmlFor="search-type" className="block text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
            Property type
          </label>
          <select
            id="search-type"
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | 'all')}
            className={selectClass}
          >
            <option value="all">Any type</option>
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white px-4 py-3">
          <label htmlFor="search-budget" className="block text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
            Budget
          </label>
          <select id="search-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
            <option value="">Any budget</option>
            {budgetOptions[listing].map((b) => (
              <option key={b.max} value={b.max}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white p-2">
          <button
            type="submit"
            className="flex h-full min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-medium text-ivory transition hover:bg-navy-600"
          >
            <Search className="h-4 w-4" aria-hidden />
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
