import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ContactForm } from '../components/ContactForm';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { mailLink, siteConfig, telLink, whatsappLink } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

export function ContactPage() {
  usePageMeta('Contact us', 'Contact LuxeEstate by phone, email or WhatsApp, or send us a message. Office hours and location.');
  const [params] = useSearchParams();
  const subject = params.get('subject') ?? '';

  const { lat, lng } = siteConfig.coordinates;
  const d = 0.008;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <>
      <PageHeader
        title="Let’s talk about your next move"
        description="Our advisors are ready to help — by phone, email, WhatsApp or in person."
        photoId="1497366811353-6870744d04b2"
        photoAlt="Bright modern office"
        breadcrumb="Contact"
      />

      <section className="container-lux py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="rounded-2xl bg-white p-6 shadow-card sm:p-10 lg:col-span-3">
            <h2 className="text-3xl font-semibold">Send us a message</h2>
            <p className="mb-8 mt-2 text-charcoal/70">We usually reply within one business day.</p>
            <ContactForm key={subject} defaultSubject={subject} />
          </Reveal>

          <div className="space-y-6 lg:col-span-2">
            <Reveal className="rounded-2xl bg-navy p-8 text-ivory shadow-card" delay={0.08}>
              <h2 className="text-2xl font-semibold text-ivory">Contact details</h2>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <p className="font-semibold">Office</p>
                    <address className="not-italic text-ivory/75">
                      {siteConfig.address.line1}
                      <br />
                      {siteConfig.address.city}, {siteConfig.address.region}
                    </address>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href={telLink()} className="text-ivory/75 hover:text-gold">
                      {siteConfig.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href={mailLink()} className="text-ivory/75 hover:text-gold">
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <p className="font-semibold">Business hours</p>
                    <dl className="mt-1 space-y-1 text-ivory/75">
                      {siteConfig.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-6">
                          <dt>{h.days}</dt>
                          <dd>{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              </ul>
              <Button
                href={whatsappLink()}
                variant="whatsapp"
                className="mt-8 w-full"
                icon={<MessageCircle className="h-4 w-4" aria-hidden />}
              >
                Chat on WhatsApp
              </Button>
            </Reveal>

            <Reveal className="overflow-hidden rounded-2xl bg-white shadow-card" delay={0.16}>
              <iframe
                title={`Map showing the LuxeEstate office at ${siteConfig.address.line1}, ${siteConfig.address.city}`}
                src={mapSrc}
                loading="lazy"
                className="h-64 w-full border-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs">
                <span className="text-charcoal/60">Map © OpenStreetMap contributors</span>
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-deep hover:text-navy">
                  Open larger map
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
