import { AlertTriangle, SearchX } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { PropertyFilters } from '../components/PropertyFilters';
import { PropertyGrid } from '../components/PropertyGrid';
import { usePageMeta } from '../hooks/usePageMeta';
import { fetchProperties } from '../services/propertyService';
import type { Property, PropertyFilters as Filters } from '../types';
import { defaultFilters, filtersFromParams, filtersToParams } from '../utils/filterProperties';

const PAGE_SIZE = 6;

export function PropertiesPage() {
  usePageMeta('Properties', 'Search villas, houses, apartments and commercial properties for sale and rent.');
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const page = Math.max(1, Number(params.get('page')) || 1);
  const filterKey = filtersToParams(filters).toString();

  const [results, setResults] = useState<Property[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setResults(null);
    setError(false);
    fetchProperties(filters)
      .then((r) => !cancelled && setResults(r))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
    // filterKey captures every filter value; `filters` is a new object each render of params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, reloadToken]);

  const updateFilters = useCallback(
    (next: Filters) => setParams(filtersToParams(next), { replace: true }),
    [setParams],
  );
  const resetFilters = useCallback(() => setParams(filtersToParams(defaultFilters), { replace: true }), [setParams]);

  const totalPages = results ? Math.max(1, Math.ceil(results.length / PAGE_SIZE)) : 1;
  const currentPage = Math.min(page, totalPages);
  const pageItems = results?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ?? [];

  const goToPage = (n: number) => {
    const next = filtersToParams(filters);
    if (n > 1) next.set('page', String(n));
    setParams(next);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader
        title="Find your next property"
        description="Browse our full portfolio of homes, villas, apartments and commercial spaces."
        photoId="1600585154340-be6161a56a0c"
        photoAlt="Modern house with large windows at dusk"
        breadcrumb="Properties"
      />

      <section className="container-lux py-12 sm:py-16" aria-label="Property search results">
        <div className="-mt-24 relative z-10 sm:-mt-28">
          <PropertyFilters filters={filters} onChange={updateFilters} onReset={resetFilters} />
        </div>

        <div ref={gridTopRef} className="scroll-mt-28 pt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-charcoal/75" aria-live="polite">
              {results === null && !error
                ? 'Searching…'
                : results
                  ? `${results.length} ${results.length === 1 ? 'property' : 'properties'} found`
                  : ''}
            </p>
            <p className="hidden text-xs text-charcoal/50 sm:block">Demo listings for portfolio purposes</p>
          </div>

          {error ? (
            <EmptyState
              icon={AlertTriangle}
              title="We couldn’t load properties"
              description="Something went wrong while loading listings. Please try again."
              action={<Button onClick={() => setReloadToken((t) => t + 1)}>Try again</Button>}
            />
          ) : results === null ? (
            <LoadingState count={PAGE_SIZE} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No properties match your search"
              description="Try widening your price range, choosing a different location, or clearing some filters."
              action={
                <>
                  <Button onClick={resetFilters}>Clear all filters</Button>
                  <Button to="/contact?subject=Buying%20a%20property" variant="outline">
                    Ask an advisor
                  </Button>
                </>
              }
            />
          ) : (
            <>
              <PropertyGrid key={`${filterKey}-${currentPage}`} properties={pageItems} priorityCount={3} />
              <div className="mt-12">
                <Pagination page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
