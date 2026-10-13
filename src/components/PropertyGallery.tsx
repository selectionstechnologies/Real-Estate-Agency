import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PropertyImage } from '../types';
import { cn } from '../utils/cn';
import { unsplashUrl } from '../utils/image';
import { SmartImage } from './SmartImage';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      openerRef.current?.focus();
    };
  }, [lightbox, go]);

  const current = images[index];

  return (
    <section aria-label={`${title} photo gallery`}>
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SmartImage
              photoId={current.id}
              alt={current.alt}
              aspect={16 / 10}
              widths={[640, 960, 1280, 1600]}
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority={index === 0}
              className="aspect-[4/3] sm:aspect-[16/10]"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-card transition hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-card transition hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="rounded-full bg-navy/80 px-3 py-1 text-xs font-medium text-ivory" aria-live="polite">
            {index + 1} / {count}
          </span>
          <button
            ref={openerRef}
            type="button"
            onClick={() => setLightbox(true)}
            className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-navy shadow-card hover:bg-white"
          >
            <Expand className="h-3.5 w-3.5" aria-hidden />
            View fullscreen
          </button>
        </div>
      </div>

      {count > 1 && (
        <ul className="scrollbar-none mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Photo thumbnails">
          {images.map((img, i) => (
            <li key={img.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}: ${img.alt}`}
                aria-current={i === index}
                className={cn(
                  'block overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-ivory transition',
                  i === index ? 'ring-gold' : 'opacity-70 ring-transparent hover:opacity-100',
                )}
              >
                <SmartImage photoId={img.id} alt="" aspect={4 / 3} widths={[160, 240]} sizes="120px" className="h-16 w-24 sm:h-20 sm:w-28" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photos, fullscreen`}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-900/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <img
              key={current.id}
              src={unsplashUrl(current.id, { width: 1800, quality: 80 })}
              alt={current.alt}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"
              aria-label="Close fullscreen gallery"
            >
              <X className="h-5 w-5" />
            </button>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-ivory/70">
              {index + 1} / {count} — {current.alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
