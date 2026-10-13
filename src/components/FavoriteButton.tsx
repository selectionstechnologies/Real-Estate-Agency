import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { cn } from '../utils/cn';

interface FavoriteButtonProps {
  propertyId: string;
  propertyTitle: string;
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FavoriteButton({ propertyId, propertyTitle, variant = 'floating', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${propertyTitle} from favorites` : `Save ${propertyTitle} to favorites`}
      className={cn(
        'flex items-center justify-center gap-2 transition-colors',
        variant === 'floating'
          ? 'h-10 w-10 rounded-full bg-white/90 shadow-card backdrop-blur hover:bg-white'
          : 'rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:border-navy',
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn('h-[18px] w-[18px] transition-colors', active ? 'fill-red-500 text-red-500' : 'text-navy')}
      />
      {variant === 'inline' && <span>{active ? 'Saved' : 'Save'}</span>}
    </motion.button>
  );
}
