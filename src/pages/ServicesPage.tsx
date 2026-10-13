import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { services } from '../data/content';
import { usePageMeta } from '../hooks/usePageMeta';

const steps = [
  { n: '01', title: 'Consultation', text: 'We learn your goals, timeline and budget in a short, no-obligation conversation.' },
  { n: '02', title: 'Strategy', text: 'Your advisor prepares a tailored plan — a curated shortlist, a pricing strategy or an investment brief.' },
  { n: '03', title: 'Execution', text: 'Viewings, marketing, negotiations and paperwork handled with care and full transparency.' },
  { n: '04', title: 'Aftercare', text: 'We stay on hand after closing for management, renewals and future moves.' },
];

export function ServicesPage() {
  usePageMeta('Services', 'Buying and selling, rental management, valuation, investment consultation and commercial real estate services.');
  const { hash } = useLocation();

  // Support deep links like /services#valuation after the page renders.
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 150);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <>
      <PageHeader
        title="Services for every property goal"
        description="End-to-end expertise across residential, rental, valuation, investment and commercial real estate."
        photoId="1600566753190-17f0baa2a6c3"
        photoAlt="Contemporary home with timber cladding"
        breadcrumb="Services"
      />

      <section className="py-20 sm:py-28" aria-labelledby="services-list-title">
        <div className="container-lux">
          <SectionHeading
            id="services-list-title"
            eyebrow="What we offer"
            title="Our services"
            description="Choose a service to learn more, or speak to an advisor for a tailored recommendation."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 3) * 0.08}>
                <ServiceCard service={s} detailed />
              </Reveal>
            ))}
            <Reveal as="li" delay={0.16}>
              <div className="flex h-full flex-col justify-center rounded-2xl bg-navy p-8 text-ivory shadow-card">
                <h3 className="text-2xl font-semibold text-ivory">Not sure where to start?</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                  Tell us about your plans and we’ll recommend the right service and advisor.
                </p>
                <div className="mt-6">
                  <Button to="/contact" variant="gold">
                    Get in touch
                  </Button>
                </div>
              </div>
            </Reveal>
          </ul>
        </div>
      </section>

      <section className="bg-beige/50 py-20 sm:py-28" aria-labelledby="process-title">
        <div className="container-lux">
          <SectionHeading id="process-title" eyebrow="How we work" title="A clear, four-step process" />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.08} className="rounded-2xl bg-white p-7 shadow-card">
                <span className="font-serif text-4xl font-semibold text-gold">{s.n}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
