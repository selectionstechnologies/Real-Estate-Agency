import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SmartImage } from './SmartImage';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  photoId: string;
  photoAlt: string;
  breadcrumb: string;
}

/** Image banner used at the top of inner pages. */
export function PageHeader({ title, description, photoId, photoAlt, breadcrumb }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy pt-[72px]">
      <SmartImage
        photoId={photoId}
        alt={photoAlt}
        aspect={16 / 6}
        widths={[768, 1280, 1920]}
        sizes="100vw"
        priority
        fill
        className="bg-navy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" aria-hidden />
      <div className="container-lux relative py-16 sm:py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-ivory/70">
            <li>
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-gold">
              {breadcrumb}
            </li>
          </ol>
        </nav>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl text-4xl font-semibold text-ivory sm:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-2xl text-lg text-ivory/80"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
