import { properties } from '../data/properties';
import type { Property, PropertyFilters } from '../types';
import { filterProperties } from '../utils/filterProperties';

/**
 * Data-access layer. Today it reads the bundled demo dataset with a short
 * simulated latency so loading states are visible; swap these functions for
 * real API calls when a backend is available — callers won't need to change.
 */
const LATENCY_MS = 350;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchProperties(filters: PropertyFilters): Promise<Property[]> {
  await wait(LATENCY_MS);
  return filterProperties(properties, filters);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  await wait(LATENCY_MS);
  return properties.find((p) => p.slug === slug) ?? null;
}

export function getPropertiesByIds(ids: string[]): Property[] {
  return ids.map((id) => properties.find((p) => p.id === id)).filter((p): p is Property => Boolean(p));
}

/** Same type first, then same listing type, excluding the current property. */
export function getRelatedProperties(current: Property, limit = 3): Property[] {
  const score = (p: Property) =>
    (p.propertyType === current.propertyType ? 2 : 0) + (p.listingType === current.listingType ? 1 : 0);
  return properties
    .filter((p) => p.id !== current.id)
    .sort((a, b) => score(b) - score(a) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}
