# LuxeEstate — Premium Real Estate Agency Website

A responsive real estate agency site built with **React 18, TypeScript, Tailwind CSS 3, React Router 6, Framer Motion, React Hook Form and Lucide icons**.

> **Portfolio demo.** Listings, prices, agents, testimonials and contact details are sample data. Forms are validated in the browser but **nothing is emailed or saved to a server**. The chatbot is a **rule-based demo**, and no AI model is connected unless you configure one (see below).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero with search, featured listings, categories, why us, stats, services, testimonials, CTA |
| `/properties` | Listings grid with search, buy/rent, type, min/max price, bedrooms, sorting, pagination. Filters live in the URL, so results can be shared. |
| `/properties/:slug` | Gallery with fullscreen lightbox, specs, description, features, amenities, nearby facilities, mortgage calculator, agent card, viewing form, related listings. Unknown slugs show a friendly not-found state. |
| `/about` | Story, mission/values, team, milestones, trust indicators |
| `/services` | Five service cards with CTAs (deep links such as `/services#valuation`) and a process overview |
| `/contact` | Validated contact form (subject can be pre-filled via `?subject=`), contact details, hours, WhatsApp, OpenStreetMap embed |
| `/favorites` | Saved properties, persisted in `localStorage` |

## Configuration

Copy `.env.example` to `.env.local` to change the public contact phone, email and WhatsApp number. These values are bundled into the browser, so **never put secret keys in `VITE_` variables**.

## Chatbot ("LuxeEstate Assistant")

- `src/components/chatbot/engine.ts`: a deterministic rule engine. It runs a guided search (buy/rent → type → location → budget) and also understands free text such as *"3 bed house for sale under 2m"* or *"villa in Miami"*. It answers FAQs (viewings, services, valuation, hours, contact, fees, mortgages, buying and renting processes) and hands off to an agent through an inline lead form.
- Recommendations come only from `src/data/properties.ts`, the same dataset and `filterProperties` function the listings page uses. When nothing matches, it says so and offers alternatives that have real matches instead of guessing.
- `chatService.ts`: to connect a real model, set `VITE_CHAT_API_URL` to an endpoint on **your own backend**. That backend holds the AI provider key and returns `{ text, propertyIds? }`. Any property ids not in the dataset are dropped.

## Project structure

```
src/
  components/      Reusable UI (Navbar, Footer, HeroSection, PropertySearch, PropertyCard, PropertyGrid,
                   PropertyFilters, PropertyGallery, AgentCard, ServiceCard, TestimonialCard, ContactForm,
                   ViewingForm, Button, SectionHeading, LoadingState, EmptyState, …) + chatbot/
  pages/           Route components
  layouts/         MainLayout (navbar, footer, chatbot, scroll restoration)
  context/         FavoritesContext (localStorage), ToastContext
  data/            properties.ts (single source of listings), agents.ts, content.ts
  services/        propertyService (async data-access layer), inquiryService (demo submissions)
  hooks/ utils/ types/ config/
```

## Images

Photos are served from the Unsplash CDN with responsive `srcset`, lazy loading and fixed aspect ratios. Every photo id was checked to resolve. `SmartImage` shows a styled placeholder if an image fails to load.

## Accessibility & UX

Semantic landmarks, a skip link, labelled form controls with `aria-invalid` and `aria-describedby` errors, visible focus rings, keyboard support for the drawer, gallery lightbox and chat (Escape closes them), and `prefers-reduced-motion` support through Framer Motion's `MotionConfig` and CSS.
