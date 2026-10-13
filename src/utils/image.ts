/**
 * Builds optimized Unsplash CDN URLs. All photo ids used in the data files were
 * verified to resolve; the image component still falls back gracefully on errors.
 */
export interface ImageOptions {
  width: number;
  height?: number;
  quality?: number;
  /** Bias the crop towards faces (for portraits). */
  faces?: boolean;
}

export function unsplashUrl(id: string, { width, height, quality = 70, faces }: ImageOptions) {
  const params = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(width), q: String(quality) });
  if (height) params.set('h', String(height));
  if (faces) params.set('crop', 'faces');
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`;
}

/** Responsive srcset at a fixed aspect ratio (width / height). */
export function unsplashSrcSet(id: string, widths: number[], aspect?: number, faces?: boolean) {
  return widths
    .map((w) => `${unsplashUrl(id, { width: w, height: aspect ? Math.round(w / aspect) : undefined, faces })} ${w}w`)
    .join(', ');
}
