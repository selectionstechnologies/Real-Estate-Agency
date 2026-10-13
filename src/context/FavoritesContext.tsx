import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { properties } from '../data/properties';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const knownIds = new Set(properties.map((p) => p.id));
const isIdList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useLocalStorage<string[]>('luxeestate:favorites', [], isIdList);
  const { notify } = useToast();

  // Drop ids that no longer exist in the dataset
  const favoriteIds = useMemo(() => stored.filter((id) => knownIds.has(id)), [stored]);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback(
    (id: string) => {
      const title = properties.find((p) => p.id === id)?.title ?? 'Property';
      const wasSaved = favoriteIds.includes(id);
      setStored(wasSaved ? favoriteIds.filter((x) => x !== id) : [...favoriteIds, id]);
      notify(wasSaved ? `Removed “${title}” from favorites` : `Saved “${title}” to favorites`, wasSaved ? 'info' : 'success');
    },
    [favoriteIds, setStored, notify],
  );

  const removeFavorite = useCallback(
    (id: string) => setStored(favoriteIds.filter((x) => x !== id)),
    [favoriteIds, setStored],
  );

  const clearFavorites = useCallback(() => {
    setStored([]);
    notify('Favorites cleared', 'info');
  }, [setStored, notify]);

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, removeFavorite, clearFavorites }),
    [favoriteIds, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
