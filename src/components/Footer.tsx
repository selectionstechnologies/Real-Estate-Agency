import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mailLink, siteConfig, telLink, whatsappLink } from '../config/site';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';
import { SocialIcons } from './SocialIcons';

const explore = [
  { to: '/properties', label: 'All properties' },
  { to: '/properties?listing=sale', label: 'Properties for sale' },
  { to: '/properties?listing=rent', label: 'Properties for rent' },
  { to: '/properties?type=commercial', label: 'Commercial' },
  { to: '/favorites', label: 'Saved favorites' },
];

const company = [
  { to: '/about', label: 'About us' },
  { to: '/services', label: 'Our services' },
  { to: '/contact', label: 'Contact' },
  { to: '/contact?subject=Property%20valuation', label: 'Free valuation' },
];

export function Footer() {
  return (
    <footer className="bg-navy text-ivory/80">
      <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/65">
            {siteConfig.tagline} Curated homes, villas and commercial spaces with advisors who put your goals first.
          </p>
          <SocialIcons className="mt-6" />
        </div>

        <nav className="lg:col-span-2" aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Explore
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-2" aria-labelledby="footer-company">
          <h2 id="footer-company" className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Company
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {company.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8 md:col-span-2 lg:col-span-4">
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Get in touch</h2>
            <address className="mt-5 space-y-3 text-sm not-italic">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  {siteConfig.address.line1}, {siteConfig.address.city}, {siteConfig.address.region}
                </span>
              </p>
              <a href={telLink()} className="flex gap-3 transition hover:text-gold">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                {siteConfig.phone}
              </a>
              <a href={mailLink()} className="flex gap-3 transition hover:text-gold">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                {siteConfig.email}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 transition hover:text-gold"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                Chat on WhatsApp
              </a>
            </address>
          </div>
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Newsletter</h2>
            <p className="mb-4 mt-3 text-sm text-ivory/65">New listings and market insight, once a month.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-lux flex flex-col gap-2 py-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>Portfolio demo — listings, prices and contact details are sample data. Photos via Unsplash.</p>
        </div>
      </div>
    </footer>
  );
}
