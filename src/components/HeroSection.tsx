import { motion } from 'framer-motion';
import { ShieldCheck, Star } from 'lucide-react';
import { PropertySearch } from './PropertySearch';
import { SmartImage } from './SmartImage';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden" aria-labelledby="hero-title">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <SmartImage
          photoId="1613977257363-707ba9348227"
          alt="Modern luxury villa with a swimming pool and terrace"
          aspect={16 / 9}
          widths={[768, 1280, 1920, 2400]}
          sizes="100vw"
          priority
          className="h-full w-full bg-navy"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/45 to-navy/80" aria-hidden />

      <div className="container-lux relative z-10 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-ivory/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            Luxury Real Estate Agency
          </p>
          <h1 id="hero-title" className="text-4xl font-semibold leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
            Find a Place to Call <span className="whitespace-nowrap italic text-gold">Your Own.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85">
            Discover exceptional properties designed around your lifestyle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 max-w-4xl"
        >
          <PropertySearch />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ivory/85"
        >
          <li className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
            4.9/5 average client rating
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
            Licensed &amp; insured advisors
          </li>
        </motion.ul>
      </div>
    </section>
  );
}
