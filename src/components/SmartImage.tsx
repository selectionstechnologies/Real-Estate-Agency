import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { unsplashSrcSet, unsplashUrl } from '../utils/image';

interface SmartImageProps {
  photoId: string;
  alt: string;
  /** width / height, used for the CDN crop. The container controls the displayed ratio. */
  aspect?: number;
  widths?: number[];
  sizes?: string;
  priority?: boolean;
  faces?: boolean;
  /** Absolutely fill the nearest positioned ancestor (for background images). */
  fill?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Responsive, lazy-loaded image with a soft placeholder while loading and a
 * tasteful fallback panel if the image fails, so broken images never show.
 */
export function SmartImage({
  photoId,
  alt,
  aspect = 4 / 3,
  widths = [400, 640, 960, 1280],
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  faces = false,
  fill = false,
  className,
  imgClassName,
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const fallbackWidth = widths[Math.min(1, widths.length - 1)];

  return (
    <div className={cn(fill ? 'absolute inset-0' : 'relative', 'overflow-hidden bg-beige', className)}>
      {status === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-beige to-beige-dark text-navy/50">
          <ImageOff className="h-7 w-7" aria-hidden />
          <span className="text-xs font-medium">Image unavailable</span>
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={unsplashUrl(photoId, { width: fallbackWidth, height: Math.round(fallbackWidth / aspect), faces })}
          srcSet={unsplashSrcSet(photoId, widths, aspect, faces)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // fetchpriority is supported by modern browsers; React 18 passes it through lowercase
          {...(priority ? { fetchpriority: 'high' } : {})}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
      {status === 'loading' && <div aria-hidden className="absolute inset-0 animate-pulse bg-beige" />}
    </div>
  );
}
