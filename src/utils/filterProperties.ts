import type { ListingType, Property, PropertyFilters, PropertyType, SortOption } from '../types';

export const defaultFilters: PropertyFilters = {
  query: '',
  listingType: 'all',
  propertyType: 'all',
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  sort: 'newest',
};

const normalize = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim();

export function matchesQuery(p: Property, query: string) {
  const q = normalize(query);
  if (!q) return true;
  const haystack = normalize(
    [p.title, p.location.city, p.location.state, p.location.neighborhood, p.location.address, p.propertyType, p.reference].join(' '),
  );
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

/** Pure filter + sort used by the listings page, the home search and the chatbot. */
export function filterProperties(list: Property[], f: PropertyFilters): Property[] {
  const result = list.filter((p) => {
    if (!matchesQuery(p, f.query)) return false;
    if (f.listingType !== 'all' && p.listingType !== f.listingType) return false;
    if (f.propertyType !== 'all' && p.propertyType !== f.propertyType) return false;
    if (f.minPrice != null && p.price < f.minPrice) return false;
    if (f.maxPrice != null && p.price > f.maxPrice) return false;
    if (f.minBedrooms != null && p.bedrooms < f.minBedrooms) return false;
    return true;
  });
  return sortProperties(result, f.sort);
}

export function sortProperties(list: Property[], sort: SortOption): Property[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'newest':
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

const listingTypes: ListingType[] = ['sale', 'rent'];
const propertyTypes: PropertyType[] = ['apartment', 'villa', 'house', 'commercial'];
const sorts: SortOption[] = ['newest', 'price-asc', 'price-desc'];

function toNumber(v: string | null): number | null {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Reads filters from URL search params, ignoring invalid values. */
export function filtersFromParams(params: URLSearchParams): PropertyFilters {
  const listing = params.get('listing');
  const type = params.get('type');
  const sort = params.get('sort');
  return {
    query: params.get('q') ?? '',
    listingType: listingTypes.includes(listing as ListingType) ? (listing as ListingType) : 'all',
    propertyType: propertyTypes.includes(type as PropertyType) ? (type as PropertyType) : 'all',
    minPrice: toNumber(params.get('min')),
    maxPrice: toNumber(params.get('max')),
    minBedrooms: toNumber(params.get('beds')),
    sort: sorts.includes(sort as SortOption) ? (sort as SortOption) : 'newest',
  };
}

export function filtersToParams(f: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (f.query.trim()) params.set('q', f.query.trim());
  if (f.listingType !== 'all') params.set('listing', f.listingType);
  if (f.propertyType !== 'all') params.set('type', f.propertyType);
  if (f.minPrice != null) params.set('min', String(f.minPrice));
  if (f.maxPrice != null) params.set('max', String(f.maxPrice));
  if (f.minBedrooms != null) params.set('beds', String(f.minBedrooms));
  if (f.sort !== 'newest') params.set('sort', f.sort);
  return params;
}

export function countActiveFilters(f: PropertyFilters) {
  return [
    f.query.trim() !== '',
    f.listingType !== 'all',
    f.propertyType !== 'all',
    f.minPrice != null,
    f.maxPrice != null,
    f.minBedrooms != null,
  ].filter(Boolean).length;
}

/** Budget presets shared by the home search panel and the chatbot. */
export const budgetOptions: Record<ListingType, { label: string; max: number }[]> = {
  sale: [
    { label: 'Up to $1M', max: 1_000_000 },
    { label: 'Up to $2M', max: 2_000_000 },
    { label: 'Up to $5M', max: 5_000_000 },
    { label: 'Up to $10M', max: 10_000_000 },
  ],
  rent: [
    { label: 'Up to $5,000/mo', max: 5_000 },
    { label: 'Up to $10,000/mo', max: 10_000 },
    { label: 'Up to $20,000/mo', max: 20_000 },
    { label: 'Up to $30,000/mo', max: 30_000 },
  ],
};
