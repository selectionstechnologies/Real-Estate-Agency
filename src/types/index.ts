export type ListingType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'villa' | 'house' | 'commercial';
export type Currency = 'USD';

export interface PropertyImage {
  /** Unsplash photo id (the part after `photo-`). */
  id: string;
  alt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  photo: string;
  languages: string[];
  yearsExperience: number;
}

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface NearbyFacility {
  name: string;
  category: 'school' | 'transport' | 'shopping' | 'health' | 'leisure';
  distance: string;
}

export interface Property {
  id: string;
  reference: string;
  title: string;
  slug: string;
  summary: string;
  description: string[];
  price: number;
  currency: Currency;
  /** Rental prices are per month. */
  listingType: ListingType;
  propertyType: PropertyType;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  /** Interior floor area in square feet. */
  area: number;
  yearBuilt: number;
  parking: number;
  images: PropertyImage[];
  features: string[];
  amenities: string[];
  nearby: NearbyFacility[];
  featured: boolean;
  /** ISO date the listing was published. */
  createdAt: string;
  agent: Agent;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export interface PropertyFilters {
  query: string;
  listingType: ListingType | 'all';
  propertyType: PropertyType | 'all';
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  sort: SortOption;
}
