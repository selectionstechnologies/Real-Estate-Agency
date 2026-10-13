import type { Property } from '../types';

const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(value: number, currency = 'USD') {
  let fmt = currencyFormatters.get(currency);
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
    currencyFormatters.set(currency, fmt);
  }
  return fmt.format(value);
}

/** Price with a "/mo" suffix for rentals. */
export function formatPrice(property: Pick<Property, 'price' | 'currency' | 'listingType'>) {
  const base = formatCurrency(property.price, property.currency);
  return property.listingType === 'rent' ? `${base}/mo` : base;
}

/** Compact form, e.g. $4.85M or $8.5K. */
export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatLocation(p: Pick<Property, 'location'>) {
  return `${p.location.neighborhood}, ${p.location.city}, ${p.location.state}`;
}
