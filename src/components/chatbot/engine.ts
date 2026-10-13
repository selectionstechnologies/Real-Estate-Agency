/**
 * Deterministic, rule-based assistant. It only ever recommends listings that
 * exist in the shared dataset and never invents prices, availability or details.
 */
import { siteConfig, telLink, whatsappLink } from '../../config/site';
import { services } from '../../data/content';
import { cities, properties, propertyTypeLabels } from '../../data/properties';
import type { ListingType, Property, PropertyFilters, PropertyType } from '../../types';
import { budgetOptions, defaultFilters, filterProperties, filtersToParams } from '../../utils/filterProperties';
import { formatCompactCurrency } from '../../utils/format';
import type { BotMessage, ChatInput, ChatState, EngineResult, QuickReply, SearchCriteria } from './types';

export const initialChatState: ChatState = { mode: 'idle', criteria: {}, leadSubmitted: false };

export const mainQuickReplies: QuickReply[] = [
  { label: 'Buy a Property', action: 'start:sale' },
  { label: 'Rent a Property', action: 'start:rent' },
  { label: 'View Listings', action: 'listings' },
  { label: 'Talk to an Agent', action: 'agent' },
];

export function welcomeMessages(): BotMessage[] {
  return [
    { text: 'Hello! Looking for your perfect property? I’m here to help.' },
    {
      text: 'I can search our current listings by budget, location and property type, answer common questions, or connect you with an agent. What would you like to do?',
      quickReplies: mainQuickReplies,
    },
  ];
}

// ---------------------------------------------------------------------------
// Search flow
// ---------------------------------------------------------------------------

function toFilters(c: SearchCriteria): PropertyFilters {
  return {
    ...defaultFilters,
    listingType: c.listingType && c.listingType !== 'any' ? c.listingType : 'all',
    propertyType: c.propertyType && c.propertyType !== 'any' ? c.propertyType : 'all',
    query: c.city && c.city !== 'any' ? c.city : '',
    maxPrice: typeof c.maxPrice === 'number' ? c.maxPrice : null,
    minBedrooms: c.minBedrooms ?? null,
  };
}

function describeCriteria(c: SearchCriteria) {
  const parts: string[] = [];
  if (c.minBedrooms) parts.push(`${c.minBedrooms}+ bedroom`);
  parts.push(c.propertyType && c.propertyType !== 'any' ? propertyTypeLabels[c.propertyType].toLowerCase() + 's' : 'properties');
  if (c.listingType && c.listingType !== 'any') parts.push(c.listingType === 'sale' ? 'for sale' : 'for rent');
  if (c.city && c.city !== 'any') parts.push(`in ${c.city}`);
  if (typeof c.maxPrice === 'number') {
    parts.push(`up to ${formatCompactCurrency(c.maxPrice)}${c.listingType === 'rent' ? '/mo' : ''}`);
  }
  return parts.join(' ');
}

function askNext(state: ChatState): EngineResult {
  const c = state.criteria;

  if (c.listingType === undefined) {
    return {
      state,
      messages: [
        {
          text: 'Are you looking to buy or rent?',
          quickReplies: [
            { label: 'Buy', action: 'listing:sale' },
            { label: 'Rent', action: 'listing:rent' },
            { label: 'Either', action: 'listing:any' },
          ],
        },
      ],
    };
  }

  if (c.propertyType === undefined) {
    return {
      state,
      messages: [
        {
          text: 'Great. What type of property do you have in mind?',
          quickReplies: [
            ...Object.entries(propertyTypeLabels).map(([value, label]) => ({ label, action: `type:${value}` })),
            { label: 'Any type', action: 'type:any' },
          ],
        },
      ],
    };
  }

  if (c.city === undefined) {
    // Only suggest cities where something matches the criteria so far.
    const pool = filterProperties(properties, toFilters({ ...c, city: 'any', maxPrice: 'any' }));
    const available = Array.from(new Set(pool.map((p) => p.location.city))).sort();
    return {
      state,
      messages: [
        {
          text: available.length
            ? 'Which location are you interested in? You can pick one below or type a city.'
            : 'Which location are you interested in? You can type a city.',
          quickReplies: [...available.slice(0, 6).map((city) => ({ label: city, action: `city:${city}` })), { label: 'Anywhere', action: 'city:any' }],
        },
      ],
    };
  }

  if (c.maxPrice === undefined) {
    // Nothing matches even without a budget: say so now rather than asking a pointless question.
    if (filterProperties(properties, toFilters({ ...c, maxPrice: 'any' })).length === 0) {
      return showResults({ ...state, criteria: { ...c, maxPrice: 'any' } });
    }
    const lt: ListingType = c.listingType === 'rent' ? 'rent' : 'sale';
    const opts = c.listingType === 'any' ? [] : budgetOptions[lt];
    return {
      state,
      messages: [
        {
          text:
            c.listingType === 'rent'
              ? 'What is your maximum monthly rent? Choose an option or type an amount (e.g. “$9,000”).'
              : 'What is your maximum budget? Choose an option or type an amount (e.g. “$2.5M”).',
          quickReplies: [...opts.map((b) => ({ label: b.label, action: `budget:${b.max}` })), { label: 'No limit', action: 'budget:any' }],
        },
      ],
    };
  }

  return showResults(state);
}

function showResults(state: ChatState): EngineResult {
  const c = state.criteria;
  const filters = toFilters(c);
  const matches = filterProperties(properties, filters);
  const allLink = `/properties?${filtersToParams(filters).toString()}`;
  const followUps: QuickReply[] = [
    { label: 'New search', action: 'restart' },
    { label: 'Talk to an Agent', action: 'agent' },
  ];

  if (matches.length > 0) {
    return {
      state: { ...state, mode: 'idle' },
      messages: [
        {
          text: `I found ${matches.length} ${matches.length === 1 ? 'listing' : 'listings'} matching ${describeCriteria(c)}. ${
            matches.length > 3 ? 'Here are the top 3:' : 'Here they are:'
          }`,
          properties: matches.slice(0, 3),
          links: [{ label: matches.length > 3 ? `See all ${matches.length} results` : 'Open in search', href: allLink }],
        },
        {
          text: 'Prices and availability come from our demo listings — an agent can confirm current status before you visit.',
          quickReplies: [...followUps, { label: 'How do viewings work?', action: 'faq:viewing' }],
        },
      ],
    };
  }

  // No exact match: never invent one. Offer real alternatives by relaxing a single criterion.
  const alternatives: QuickReply[] = [];
  if (typeof c.maxPrice === 'number' && filterProperties(properties, toFilters({ ...c, maxPrice: 'any' })).length) {
    alternatives.push({ label: 'Remove budget limit', action: 'budget:any' });
  }
  if (c.city && c.city !== 'any' && filterProperties(properties, toFilters({ ...c, city: 'any' })).length) {
    alternatives.push({ label: 'Search all locations', action: 'city:any' });
  }
  if (c.propertyType && c.propertyType !== 'any' && filterProperties(properties, toFilters({ ...c, propertyType: 'any' })).length) {
    alternatives.push({ label: 'Any property type', action: 'type:any' });
  }

  return {
    state: { ...state, mode: 'search' },
    messages: [
      {
        text: `I couldn’t find any current listings matching ${describeCriteria(c)}. I don’t want to guess, so here are some options${
          alternatives.length ? ' that do have real matches' : ''
        }:`,
        quickReplies: [...alternatives, ...followUps],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Free-text understanding (keyword rules)
// ---------------------------------------------------------------------------

const cityAliases: Record<string, string> = {
  nyc: 'New York',
  manhattan: 'New York',
  'new york city': 'New York',
  'los angeles': 'Los Angeles',
  'l.a.': 'Los Angeles',
  'south beach': 'Miami Beach',
};

function parseCity(text: string): string | undefined {
  // Longest names first so "Miami Beach" wins over "Miami".
  for (const city of [...cities].sort((a, b) => b.length - a.length)) {
    if (text.includes(city.toLowerCase())) return city;
  }
  for (const [alias, city] of Object.entries(cityAliases)) {
    if (new RegExp(`\\b${alias.replace('.', '\\.')}`).test(text)) return city;
  }
  for (const p of properties) {
    if (text.includes(p.location.neighborhood.toLowerCase())) return p.location.city;
  }
  return undefined;
}

export function parseBudget(text: string): number | undefined {
  const m = text.match(/(?:\$\s*)?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(k|m|mm|million|thousand|mil)?\b/i);
  if (!m) return undefined;
  const hasDollar = /\$/.test(m[0]);
  const unit = m[2]?.toLowerCase();
  const budgetWords = /\b(under|below|max|maximum|up to|budget|less than|around|about|within|afford)\b/.test(text);
  if (!hasDollar && !unit && !budgetWords) return undefined;
  let value = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(value)) return undefined;
  if (unit === 'k' || unit === 'thousand') value *= 1_000;
  if (unit === 'm' || unit === 'mm' || unit === 'million' || unit === 'mil') value *= 1_000_000;
  return value >= 100 ? Math.round(value) : undefined;
}

function parseCriteria(raw: string): Partial<SearchCriteria> {
  const text = raw.toLowerCase();
  const found: Partial<SearchCriteria> = {};

  if (/\b(rent|renting|rental|lease|leasing|to let)\b/.test(text)) found.listingType = 'rent';
  else if (/\b(buy|buying|purchase|purchasing|for sale|invest in)\b/.test(text)) found.listingType = 'sale';

  const typeRules: [RegExp, PropertyType][] = [
    [/\b(apartment|apartments|flat|condo|loft|penthouse)\b/, 'apartment'],
    [/\b(villa|villas|estate|mansion)\b/, 'villa'],
    [/\b(house|houses|townhouse|family home|cottage)\b/, 'house'],
    [/\b(commercial|office|offices|retail|shop|warehouse|business premises)\b/, 'commercial'],
  ];
  for (const [re, type] of typeRules) {
    if (re.test(text)) {
      found.propertyType = type;
      break;
    }
  }

  const city = parseCity(text);
  if (city) found.city = city;

  const beds = text.match(/(\d+)\s*\+?\s*(?:bed|beds|bedroom|bedrooms|br|bd)\b/);
  if (beds) found.minBedrooms = Number(beds[1]);

  // Strip the bedroom count so "3 bed under 2m" doesn't read 3 as the budget.
  const budget = parseBudget(beds ? text.replace(beds[0], ' ') : text);
  if (budget) found.maxPrice = budget;

  return found;
}

function findPropertyMention(raw: string): Property | undefined {
  const text = raw.toLowerCase();
  return properties.find((p) => {
    const words = p.title.toLowerCase().split(' ');
    return text.includes(p.title.toLowerCase()) || text.includes(words.slice(0, 2).join(' ')) || text.includes(p.reference.toLowerCase());
  });
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

interface Faq {
  id: string;
  pattern: RegExp;
  answer: () => BotMessage;
}

const faqs: Faq[] = [
  {
    id: 'viewing',
    pattern: /\b(view|viewing|viewings|visit|tour|appointment|schedule|see the (house|property|place))\b/,
    answer: () => ({
      text: 'Viewings are easy to arrange: open any property page and use the “Schedule a Viewing” form to choose a date, time, and in-person or video tour. Viewings run Monday to Saturday, and Sundays by appointment. The listing agent then confirms with you.',
      links: [{ label: 'Browse properties', href: '/properties' }],
      quickReplies: [
        { label: 'Find a property', action: 'restart' },
        { label: 'Talk to an Agent', action: 'agent' },
      ],
    }),
  },
  {
    id: 'valuation',
    pattern: /\b(valuations?|value my|worth|appraisals?|appraise|sell my|selling my)\b/,
    answer: () => ({
      text: 'We offer property valuations based on a comparative market analysis and an on-site inspection, followed by a written report and pricing advice. I can’t estimate a value here, but you can request one through our contact page.',
      links: [
        { label: 'Request a valuation', href: '/contact?subject=Property%20valuation' },
        { label: 'Our services', href: '/services#valuation' },
      ],
    }),
  },
  {
    id: 'services',
    pattern: /\b(service|services|what do you (do|offer)|management|manage my|investment|consult)\b/,
    answer: () => ({
      text: `We offer ${services.map((s) => s.title.toLowerCase()).join(', ')}.`,
      links: [{ label: 'Explore our services', href: '/services' }],
      quickReplies: [
        { label: 'Talk to an Agent', action: 'agent' },
        { label: 'Find a property', action: 'restart' },
      ],
    }),
  },
  {
    id: 'hours',
    pattern: /\b(hours|opening|open on|open today|closing time|weekend|saturday|sunday)\b/,
    answer: () => ({
      text: `Our office hours are: ${siteConfig.hours.map((h) => `${h.days}: ${h.time}`).join('; ')}.`,
    }),
  },
  {
    id: 'contact',
    pattern: /\b(contact|phone|number|call|email|e-mail|address|office|whatsapp|where are you)\b/,
    answer: () => ({
      text: `You can reach us at ${siteConfig.phone} or ${siteConfig.email}. Our office is at ${siteConfig.address.line1}, ${siteConfig.address.city}, ${siteConfig.address.region}.`,
      links: [
        { label: 'Call us', href: telLink() },
        { label: 'WhatsApp', href: whatsappLink() },
        { label: 'Contact page', href: '/contact' },
      ],
    }),
  },
  {
    id: 'fees',
    pattern: /\b(fee|fees|commission|charge|charges|cost of (your|the) service)\b/,
    answer: () => ({
      text: 'Fees depend on the service and property, so I can’t quote them reliably. An advisor will explain all costs upfront before you commit to anything.',
      quickReplies: [{ label: 'Talk to an Agent', action: 'agent' }],
    }),
  },
  {
    id: 'mortgage',
    pattern: /\b(mortgage|loan|financing|finance|interest rate|down payment|deposit for buying)\b/,
    answer: () => ({
      text: 'Every property for sale has a mortgage calculator on its details page where you can adjust the price, down payment, rate and term. We aren’t a lender, but our advisors can introduce you to trusted mortgage brokers.',
      links: [{ label: 'Properties for sale', href: '/properties?listing=sale' }],
    }),
  },
  {
    id: 'buying-process',
    pattern: /\b(how (do i|to|does it work to) buy|buying process|process of buying|steps to buy|first[- ]time buyer)\b/,
    answer: () => ({
      text: 'Our buying process: 1) a short consultation to understand your goals and budget, 2) a curated shortlist and viewings, 3) offer and negotiation, 4) due diligence and inspections, 5) closing — with your advisor coordinating every step.',
      quickReplies: [
        { label: 'Buy a Property', action: 'start:sale' },
        { label: 'Talk to an Agent', action: 'agent' },
      ],
    }),
  },
  {
    id: 'renting-process',
    pattern: /\b(how (do i|to) rent|renting process|rental process|tenant|security deposit|application)\b/,
    answer: () => ({
      text: 'To rent: choose a property and book a viewing, submit an application with ID and proof of income, then sign the lease and pay the deposit and first month’s rent. Exact requirements vary by landlord, and your agent will confirm them.',
      quickReplies: [
        { label: 'Rent a Property', action: 'start:rent' },
        { label: 'Talk to an Agent', action: 'agent' },
      ],
    }),
  },
];

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function agentHandoff(state: ChatState): EngineResult {
  if (state.leadSubmitted) {
    return {
      state,
      messages: [
        {
          text: 'You’ve already shared your details in this chat. You can also reach the team directly:',
          links: [
            { label: `Call ${siteConfig.phone}`, href: telLink() },
            { label: 'WhatsApp', href: whatsappLink() },
          ],
        },
      ],
    };
  }
  return {
    state,
    messages: [
      {
        text: 'I’d be happy to connect you with one of our advisors. Share your details below and choose how you’d like to be contacted — or reach us directly by phone or WhatsApp.',
        leadForm: true,
        links: [
          { label: `Call ${siteConfig.phone}`, href: telLink() },
          { label: 'WhatsApp', href: whatsappLink() },
        ],
      },
    ],
  };
}

function fallback(state: ChatState): EngineResult {
  return {
    state,
    messages: [
      {
        text: 'Sorry, I don’t have a reliable answer to that. I’m a demo assistant with a fixed set of topics, so I’d rather not guess. An agent can help, or you can send us a message.',
        links: [{ label: 'Open contact form', href: '/contact' }],
        quickReplies: [
          { label: 'Talk to an Agent', action: 'agent' },
          { label: 'Find a property', action: 'restart' },
        ],
      },
    ],
  };
}

function handleAction(action: string, state: ChatState): EngineResult {
  const [kind, value = ''] = action.split(/:(.*)/s);
  const withCriteria = (patch: Partial<SearchCriteria>) => askNext({ ...state, mode: 'search', criteria: { ...state.criteria, ...patch } });

  switch (kind) {
    case 'start':
      return askNext({ ...state, mode: 'search', criteria: { listingType: value as ListingType } });
    case 'listing':
      return withCriteria({ listingType: value as ListingType | 'any', maxPrice: undefined });
    case 'type':
      return withCriteria({ propertyType: value as PropertyType | 'any' });
    case 'city':
      return withCriteria({ city: value });
    case 'budget':
      return withCriteria({ maxPrice: value === 'any' ? 'any' : Number(value) });
    case 'restart':
      return askNext({ ...state, mode: 'search', criteria: {} });
    case 'listings': {
      const featured = properties.filter((p) => p.featured).slice(0, 3);
      return {
        state,
        messages: [
          {
            text: `We currently have ${properties.length} listings. Here are a few featured ones:`,
            properties: featured,
            links: [{ label: 'View all listings', href: '/properties' }],
            quickReplies: [
              { label: 'Buy a Property', action: 'start:sale' },
              { label: 'Rent a Property', action: 'start:rent' },
              { label: 'Talk to an Agent', action: 'agent' },
            ],
          },
        ],
      };
    }
    case 'agent':
      return agentHandoff(state);
    case 'faq': {
      const faq = faqs.find((f) => f.id === value);
      return faq ? { state, messages: [faq.answer()] } : fallback(state);
    }
    default:
      return fallback(state);
  }
}

function handleText(raw: string, state: ChatState): EngineResult {
  const text = raw.toLowerCase().trim();

  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/.test(text) && text.split(/\s+/).length <= 4) {
    return { state, messages: [{ text: 'Hello! How can I help you today?', quickReplies: mainQuickReplies }] };
  }
  if (/\b(thank|thanks|thx|cheers)\b/.test(text)) {
    return { state, messages: [{ text: 'You’re welcome! Is there anything else I can help with?', quickReplies: mainQuickReplies }] };
  }
  if (/\b(start over|restart|reset|new search)\b/.test(text)) {
    return handleAction('restart', state);
  }
  if (/\b(agent|human|person|someone|advisor|adviser|representative|call me|speak to|talk to)\b/.test(text)) {
    return agentHandoff(state);
  }

  // A specific listing mentioned by name or reference: show the real record, never guess its status.
  const mentioned = findPropertyMention(text);
  if (mentioned) {
    return {
      state,
      messages: [
        {
          text: `Here’s ${mentioned.title} (ref ${mentioned.reference}). All details shown come from our listing; please confirm current availability with ${mentioned.agent.name}.`,
          properties: [mentioned],
          quickReplies: [
            { label: 'How do viewings work?', action: 'faq:viewing' },
            { label: 'Talk to an Agent', action: 'agent' },
          ],
        },
      ],
    };
  }

  const parsed = parseCriteria(text);
  const isSearchy = Object.keys(parsed).length > 0 || /\b(find|looking for|search|show me|property|properties|listing|listings|home)\b/.test(text);

  // In an active search, a bare city or amount answers the current question.
  if (state.mode === 'search') {
    const c = state.criteria;
    if (c.city === undefined && c.listingType !== undefined && c.propertyType !== undefined && !parsed.city) {
      if (/\b(any|anywhere|no preference|doesn'?t matter|all)\b/.test(text)) return handleAction('city:any', state);
    }
    if (c.maxPrice === undefined && c.city !== undefined) {
      if (/\b(no limit|any|unlimited|no budget|doesn'?t matter)\b/.test(text)) return handleAction('budget:any', state);
      const bare = Number(text.replace(/[$,\s]/g, ''));
      if (!parsed.maxPrice && Number.isFinite(bare) && bare >= 100) parsed.maxPrice = bare;
    }
  }

  // "How do I buy?" or "what are your fees to rent?" are questions, not searches:
  // answer FAQs first when the only search signal is buy/rent.
  const onlyListingSignal = Object.keys(parsed).every((k) => k === 'listingType');
  if (onlyListingSignal) {
    const faq = faqs.find((f) => f.pattern.test(text));
    if (faq) return { state, messages: [faq.answer()] };
  }

  if (Object.keys(parsed).length > 0) {
    // New listing type invalidates a budget given for the other type.
    const merged: SearchCriteria = { ...state.criteria, ...parsed };
    if (parsed.listingType && state.criteria.listingType && parsed.listingType !== state.criteria.listingType && !parsed.maxPrice) {
      merged.maxPrice = undefined;
    }
    return askNext({ ...state, mode: 'search', criteria: merged });
  }

  const c = state.criteria;
  if (state.mode === 'search' && c.listingType !== undefined && c.propertyType !== undefined && c.city === undefined) {
    return {
      state,
      messages: [
        {
          text: `I don’t have any listings in that location right now. We currently list properties in ${cities.join(', ')}.`,
          quickReplies: [{ label: 'Anywhere', action: 'city:any' }, { label: 'Talk to an Agent', action: 'agent' }],
        },
      ],
    };
  }

  if (isSearchy) return askNext({ ...state, mode: 'search' });

  return fallback(state);
}

export function respond(input: ChatInput, state: ChatState): EngineResult {
  return input.kind === 'action' ? handleAction(input.action, state) : handleText(input.text, state);
}
