import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { HeroSection } from '../components/HeroSection';
import { PropertyCard } from '../components/PropertyCard';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { SmartImage } from '../components/SmartImage';
import { StatCounter } from '../components/StatCounter';
import { TestimonialCard } from '../components/TestimonialCard';
import { siteConfig, telLink } from '../config/site';
import { reasons, services, stats, testimonials } from '../data/content';
import { properties } from '../data/properties';
import { usePageMeta } from '../hooks/usePageMeta';
import { getFeaturedProperties } from '../services/propertyService';
import type { PropertyType } from '../types';

const categories: { type: PropertyType; label: string; photo: string; alt: string }[] = [
  { type: 'apartment', label: 'Apartments', photo: '1515263487990-61b07816b324', alt: 'Modern apartment building' },
  { type: 'villa', label: 'Villas', photo: '1613490493576-7fde63acd811', alt: 'Luxury villa with a pool' },
  { type: 'house', label: 'Houses', photo: '1570129477492-45c003edd2be', alt: 'Family house with a porch' },
  { type: 'commercial', label: 'Commercial', photo: '1486406146926-c627a92ad1ab', alt: 'Glass office towers' },
];

export function HomePage() {
  usePageMeta('', 'Find a place to call your own. Explore luxury villas, houses, apartments and commercial properties with LuxeEstate.');
  const featured = getFeaturedProperties().slice(0, 6);

  return (
    <>
      <HeroSection />

      {/* Featured properties */}
      <section className="py-20 sm:py-28" aria-labelledby="featured-title">
        <div className="container-lux">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="featured-title"
              eyebrow="Featured listings"
              title="Handpicked properties"
              description="A curated selection of homes and investments from our current portfolio."
              align="left"
            />
            <Reveal>
              <Button to="/properties" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                View all properties
              </Button>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 3) * 0.08}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-beige/50 py-20 sm:py-28" aria-labelledby="categories-title">
        <div className="container-lux">
          <SectionHeading
            id="categories-title"
            eyebrow="Browse by category"
            title="Explore property types"
            description="From city apartments to waterfront villas and prime commercial space."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => {
              const count = properties.filter((p) => p.propertyType === c.type).length;
              return (
                <Reveal as="li" key={c.type} delay={i * 0.08}>
                  <Link
                    to={`/properties?type=${c.type}`}
                    className="group relative block overflow-hidden rounded-2xl shadow-card"
                  >
                    <SmartImage
                      photoId={c.photo}
                      alt={c.alt}
                      aspect={3 / 4}
                      widths={[400, 600, 800]}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/5]"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-ivory">{c.label}</h3>
                        <p className="mt-1 text-sm text-ivory/75">
                          {count} {count === 1 ? 'listing' : 'listings'}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy transition-transform group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 sm:py-28" aria-labelledby="why-title">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <SmartImage
              photoId="1600607687939-ce8a6c25118c"
              alt="Elegant minimalist living room"
              aspect={4 / 5}
              widths={[480, 720, 960]}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/5] rounded-2xl shadow-lift"
            />
            <div className="absolute -bottom-6 -right-2 rounded-2xl bg-navy p-6 text-ivory shadow-lift sm:-right-6">
              <p className="font-serif text-4xl font-semibold text-gold">18+</p>
              <p className="mt-1 text-sm text-ivory/75">Years of trusted service</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              id="why-title"
              eyebrow="Why choose us"
              title="An agency built on trust, insight and care"
              description="We combine local expertise with a discreet, personal approach — so every decision feels confident."
              align="left"
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {reasons.map((r, i) => (
                <Reveal as="li" key={r.title} delay={i * 0.08} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-beige text-gold-deep">
                    <r.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-semibold text-navy">{r.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/75">{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-16" aria-label="Agency statistics">
        <dl className="container-lux grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-ivory/70">{s.label}</dt>
              <dd className="font-serif text-4xl font-semibold text-gold sm:text-5xl">
                <StatCounter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-28" aria-labelledby="services-title">
        <div className="container-lux">
          <SectionHeading
            id="services-title"
            eyebrow="What we do"
            title="Services tailored to every goal"
            description="Whether you are buying, selling, renting or investing, our specialists guide you at every step."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 0.08}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Button to="/services" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              All services
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-beige/50 py-20 sm:py-28" aria-labelledby="testimonials-title">
        <div className="container-lux">
          <SectionHeading
            id="testimonials-title"
            eyebrow="Client stories"
            title="What our clients say"
            description="Sample testimonials illustrating the experience we aim to deliver."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal as="li" key={t.id} delay={i * 0.08}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" aria-labelledby="cta-title">
        <SmartImage
          photoId="1600573472550-8090b5e0745e"
          alt=""
          aspect={16 / 7}
          widths={[768, 1280, 1920]}
          sizes="100vw"
          fill
          className="bg-navy"
        />
        <div className="absolute inset-0 bg-navy/80" aria-hidden />
        <Reveal className="container-lux relative py-24 text-center sm:py-32">
          <p className="eyebrow text-gold">Let’s begin</p>
          <h2 id="cta-title" className="mx-auto mt-4 max-w-2xl text-4xl font-semibold text-ivory sm:text-5xl">
            Your Dream Property Starts Here
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/80">
            Tell us what you’re looking for and a dedicated advisor will curate options around your lifestyle and budget.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/properties" variant="gold" size="lg">
              Browse properties
            </Button>
            <Button href={telLink()} variant="outline-light" size="lg" icon={<Phone className="h-4 w-4" aria-hidden />}>
              Call {siteConfig.phone}
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
