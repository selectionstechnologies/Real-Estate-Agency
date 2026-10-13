import { Award, Eye, HeartHandshake, Target } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { SmartImage } from '../components/SmartImage';
import { StatCounter } from '../components/StatCounter';
import { achievements, reasons, stats, team } from '../data/content';
import { usePageMeta } from '../hooks/usePageMeta';

const values = [
  { icon: Target, title: 'Our mission', text: 'To make every property journey clear, considered and rewarding — matching people with places that genuinely fit their lives.' },
  { icon: Eye, title: 'Our vision', text: 'To be the most trusted name in luxury real estate, known for honest advice and exceptional service.' },
  { icon: HeartHandshake, title: 'Our values', text: 'Integrity, discretion and care. We advise as if every decision were our own.' },
];

export function AboutPage() {
  usePageMeta('About us', 'Meet the LuxeEstate team: our story, mission, values and the advisors behind every transaction.');

  return (
    <>
      <PageHeader
        title="Real estate, personally guided"
        description="Since 2008 we have helped families, professionals and investors find properties worth calling their own."
        photoId="1600210492486-724fe5c67fb0"
        photoAlt="Warm, elegant living room"
        breadcrumb="About"
      />

      <section className="py-20 sm:py-28" aria-labelledby="story-title">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading id="story-title" eyebrow="Our story" title="From one office to a national advisory" align="left" />
            <Reveal className="mt-6 space-y-4 leading-relaxed text-charcoal/85">
              <p>
                LuxeEstate began with a simple belief: buying or renting a home should feel exciting, not overwhelming. Our founder, Richard
                Hale, opened our first office on Brickell Avenue with a small team committed to honest advice and meticulous service.
              </p>
              <p>
                Today our advisors work across residential, rental and commercial markets — but the approach is unchanged. We listen first,
                curate carefully and stay with you well beyond closing day.
              </p>
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Button to="/properties">Explore properties</Button>
              <Button to="/contact" variant="outline">
                Talk to our team
              </Button>
            </Reveal>
          </div>
          <Reveal className="grid grid-cols-2 gap-4">
            <SmartImage
              photoId="1577415124269-fc1140a69e91"
              alt="Two LuxeEstate advisors reviewing a property"
              aspect={3 / 4}
              widths={[360, 540, 720]}
              sizes="(min-width: 1024px) 22vw, 50vw"
              className="aspect-[3/4] rounded-2xl shadow-card"
            />
            <SmartImage
              photoId="1551836022-d5d88e9218df"
              alt="An advisor meeting with a client"
              aspect={3 / 4}
              widths={[360, 540, 720]}
              sizes="(min-width: 1024px) 22vw, 50vw"
              className="mt-10 aspect-[3/4] rounded-2xl shadow-card"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-beige/50 py-20" aria-label="Mission, vision and values">
        <ul className="container-lux grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.08} className="rounded-2xl bg-white p-8 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                <v.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">{v.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{v.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="team-title">
        <div className="container-lux">
          <SectionHeading
            id="team-title"
            eyebrow="Our people"
            title="Meet the team"
            description="Experienced, licensed advisors with deep local knowledge."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 3) * 0.08}>
                <article className="group overflow-hidden rounded-2xl bg-white shadow-card">
                  <SmartImage
                    photoId={m.photo}
                    alt={`Portrait of ${m.name}`}
                    aspect={1}
                    widths={[400, 600, 800]}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    faces
                    className="aspect-square"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{m.name}</h3>
                    <p className="eyebrow mt-1 normal-case tracking-normal">{m.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{m.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-navy py-20 sm:py-28" aria-labelledby="achievements-title">
        <div className="container-lux">
          <SectionHeading id="achievements-title" eyebrow="Milestones" title="Achievements & trust" tone="light" />
          <dl className="mt-12 grid grid-cols-2 gap-8 border-b border-ivory/10 pb-12 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-sm text-ivory/70">{s.label}</dt>
                <dd className="font-serif text-4xl font-semibold text-gold">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a, i) => (
              <Reveal as="li" key={a.year} delay={i * 0.08} className="border-l-2 border-gold pl-5">
                <p className="font-serif text-3xl font-semibold text-gold">{a.year}</p>
                <h3 className="mt-2 font-sans text-base font-semibold text-ivory">{a.title}</h3>
                <p className="mt-1 text-sm text-ivory/70">{a.text}</p>
              </Reveal>
            ))}
          </ol>
          <ul className="mt-12 flex flex-wrap justify-center gap-3 text-sm text-ivory/80">
            {['Licensed brokerage', 'Fair Housing compliant', 'Client funds protected', 'Award-winning service'].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-ivory/15 px-4 py-2">
                <Award className="h-4 w-4 text-gold" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="why-about-title">
        <div className="container-lux">
          <SectionHeading id="why-about-title" eyebrow="Why LuxeEstate" title="Why clients choose us" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 0.08} className="rounded-2xl border border-navy/5 bg-white p-7 text-center shadow-card">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-beige text-gold-deep">
                  <r.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
