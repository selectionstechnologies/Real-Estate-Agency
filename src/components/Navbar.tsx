import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Phone, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { siteConfig, telLink } from '../config/site';
import { useFavorites } from '../context/FavoritesContext';
import { cn } from '../utils/cn';
import { Button } from './Button';
import { Logo } from './Logo';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { favoriteIds } = useFavorites();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // The home hero sits under a transparent navbar until the user scrolls.
  const overHero = pathname === '/' && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll, close on Escape and move focus into the drawer while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative rounded-md px-1 py-2 text-sm font-medium transition-colors',
      'after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300',
      isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
      overHero ? (isActive ? 'text-ivory' : 'text-ivory/80 hover:text-ivory') : isActive ? 'text-navy' : 'text-charcoal/80 hover:text-navy',
    );

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          overHero ? 'bg-transparent' : 'border-b border-navy/5 bg-ivory/90 shadow-sm backdrop-blur-md',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <nav className="container-lux flex h-[72px] items-center justify-between gap-6" aria-label="Main">
          <Logo tone={overHero ? 'light' : 'dark'} />

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/favorites"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                overHero ? 'text-ivory hover:bg-ivory/10' : 'text-navy hover:bg-navy/5',
              )}
              aria-label={`Favorites (${favoriteIds.length} saved)`}
            >
              <Heart className="h-5 w-5" aria-hidden />
              {favoriteIds.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-navy">
                  {favoriteIds.length}
                </span>
              )}
            </Link>
            <Button
              to="/properties"
              variant={overHero ? 'gold' : 'primary'}
              size="sm"
              className="hidden sm:inline-flex"
              icon={<Search className="h-4 w-4" aria-hidden />}
            >
              Find a Property
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full lg:hidden',
                overHero ? 'text-ivory hover:bg-ivory/10' : 'text-navy hover:bg-navy/5',
              )}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block for these fixed elements. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[72px] z-[64] bg-navy/40 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="drawer"
              id="mobile-menu"
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 right-0 top-[72px] z-[65] flex w-full max-w-sm flex-col bg-ivory px-6 py-8 shadow-lift lg:hidden"
            >
              <ul className="space-y-1">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-lg px-4 py-3 font-serif text-xl transition-colors',
                          isActive ? 'bg-beige text-navy' : 'text-charcoal hover:bg-beige/60',
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-4 py-3 font-serif text-xl transition-colors',
                        isActive ? 'bg-beige text-navy' : 'text-charcoal hover:bg-beige/60',
                      )
                    }
                  >
                    Favorites {favoriteIds.length > 0 && <span className="text-gold-deep">({favoriteIds.length})</span>}
                  </NavLink>
                </li>
              </ul>
              <div className="mt-auto space-y-3 border-t border-navy/10 pt-6">
                <Button to="/properties" className="w-full" icon={<Search className="h-4 w-4" aria-hidden />}>
                  Find a Property
                </Button>
                <Button href={telLink()} variant="outline" className="w-full" icon={<Phone className="h-4 w-4" aria-hidden />}>
                  {siteConfig.phone}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
