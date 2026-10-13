/**
 * Public, configurable agency details. Override any value with the matching
 * VITE_* variable in .env.local (see .env.example). Never place secrets here —
 * everything in this file ships to the browser.
 */
const env = import.meta.env;

export const siteConfig = {
  name: 'LuxeEstate',
  legalName: 'LuxeEstate Realty',
  tagline: 'Find Your Place. Live Your Dream.',
  phone: env.VITE_CONTACT_PHONE || '+1 (305) 555-0142',
  /** Digits only, international format, used for wa.me links. */
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || '13055550142',
  email: env.VITE_CONTACT_EMAIL || 'hello@luxeestate.example',
  address: {
    line1: '1200 Brickell Avenue, Suite 1800',
    city: 'Miami',
    region: 'FL 33131',
    country: 'United States',
  },
  coordinates: { lat: 25.7617, lng: -80.1918 },
  hours: [
    { days: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
    { days: 'Saturday', time: '10:00 AM – 5:00 PM' },
    { days: 'Sunday', time: 'By appointment' },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
  /** Optional: your own backend endpoint that proxies an AI model. */
  chatApiUrl: env.VITE_CHAT_API_URL || '',
} as const;

export function whatsappLink(message = 'Hello LuxeEstate, I would like to know more about your properties.') {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string = siteConfig.phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function mailLink(subject?: string, email: string = siteConfig.email) {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}
