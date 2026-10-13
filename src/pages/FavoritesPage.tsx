import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { PropertyCard } from '../components/PropertyCard';
import { useFavorites } from '../context/FavoritesContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { getPropertiesByIds } from '../services/propertyService';

export function FavoritesPage() {
  usePageMeta('Saved favorites', 'Your saved LuxeEstate properties.');
  const { favoriteIds, removeFavorite, clearFavorites } = useFavorites();
  const saved = getPropertiesByIds(favoriteIds);

  return (
    <>
      <PageHeader
        title="Your saved properties"
        description="Favorites are stored in this browser, so they’ll be here when you come back."
        photoId="1618221195710-dd6b41faaea6"
        photoAlt="Calm, neutral living room"
        breadcrumb="Favorites"
      />
      <section className="container-lux py-16 sm:py-20" aria-label="Saved properties">
        {saved.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart on any property to save it here for later comparison."
            action={<Button to="/properties">Browse properties</Button>}
          />
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-charcoal/75" aria-live="polite">
                {saved.length} saved {saved.length === 1 ? 'property' : 'properties'}
              </p>
              <Button variant="ghost" size="sm" onClick={clearFavorites} icon={<Trash2 className="h-4 w-4" aria-hidden />}>
                Clear all
              </Button>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {saved.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    <PropertyCard property={p} />
                    <div className="flex gap-2">
                      <Button to={`/properties/${p.slug}`} size="sm" className="flex-1">
                        View details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavorite(p.id)}
                        icon={<Trash2 className="h-4 w-4" aria-hidden />}
                        aria-label={`Remove ${p.title} from favorites`}
                      >
                        Remove
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </section>
    </>
  );
}
