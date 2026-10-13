import { useEffect } from 'react';
import { siteConfig } from '../config/site';

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — Luxury Real Estate Agency`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
