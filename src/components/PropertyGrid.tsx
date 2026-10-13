import { motion } from 'framer-motion';
import type { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  /** Eager-load the first N images (above the fold). */
  priorityCount?: number;
}

export function PropertyGrid({ properties, priorityCount = 0 }: PropertyGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p, i) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <PropertyCard property={p} priority={i < priorityCount} />
        </motion.li>
      ))}
    </ul>
  );
}
