import { Compass } from 'lucide-react';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <div className="container-lux pb-24 pt-[140px]">
      <EmptyState
        headingLevel="h1"
        icon={Compass}
        title="We couldn’t find that page"
        description="The page you’re looking for doesn’t exist or has moved."
        action={
          <>
            <Button to="/">Back to home</Button>
            <Button to="/properties" variant="outline">
              Browse properties
            </Button>
          </>
        }
      />
    </div>
  );
}
