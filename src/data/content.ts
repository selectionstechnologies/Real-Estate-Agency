import {
  BadgeDollarSign,
  Building2,
  Handshake,
  KeyRound,
  LineChart,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  points: string[];
  cta: { label: string; to: string };
}

export const services: Service[] = [
  {
    id: 'buying-selling',
    title: 'Buying & Selling',
    icon: Handshake,
    summary: 'Expert guidance from first viewing to closing, with tailored marketing for sellers and discreet search for buyers.',
    points: ['Curated property shortlists', 'Pricing strategy & negotiation', 'Professional photography & staging', 'Closing coordination'],
    cta: { label: 'Browse properties for sale', to: '/properties?listing=sale' },
  },
  {
    id: 'rental-management',
    title: 'Rental & Property Management',
    icon: KeyRound,
    summary: 'Hands-off ownership: tenant screening, rent collection, maintenance and transparent monthly reporting.',
    points: ['Tenant sourcing & screening', 'Lease preparation', 'Maintenance coordination', 'Monthly owner statements'],
    cta: { label: 'View rental listings', to: '/properties?listing=rent' },
  },
  {
    id: 'valuation',
    title: 'Property Valuation',
    icon: BadgeDollarSign,
    summary: 'Accurate, data-backed valuations that reflect your property’s features, condition and local market.',
    points: ['Comparative market analysis', 'On-site inspection', 'Written valuation report', 'Pricing recommendations'],
    cta: { label: 'Request a valuation', to: '/contact?subject=Property%20valuation' },
  },
  {
    id: 'investment',
    title: 'Investment Consultation',
    icon: LineChart,
    summary: 'Build a resilient portfolio with yield analysis, market insight and long-term acquisition planning.',
    points: ['Yield & cash-flow modelling', 'Market and neighborhood research', 'Portfolio strategy', 'Off-market opportunities'],
    cta: { label: 'Book a consultation', to: '/contact?subject=Investment%20consultation' },
  },
  {
    id: 'commercial',
    title: 'Commercial Real Estate',
    icon: Building2,
    summary: 'Office, retail and mixed-use solutions for occupiers and investors, from leasing to acquisitions.',
    points: ['Office & retail leasing', 'Tenant representation', 'Investment sales', 'Lease renewals & negotiations'],
    cta: { label: 'Explore commercial listings', to: '/properties?type=commercial' },
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo: string;
  rating: number;
}

/** Sample testimonials for demonstration purposes. */
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amelia Richardson',
    role: 'Bought a villa in Miami Beach',
    quote: 'Olivia understood exactly what we were looking for. Every viewing was relevant, and the negotiation was handled with real care.',
    photo: '1494790108377-be9c29b29330',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Leased office space in Chicago',
    quote: 'The team found us a full-floor suite in a fraction of the time we expected and negotiated terms that worked for our growth plans.',
    photo: '1500648767791-00dcc994a43e',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Isabella Moreno',
    role: 'Renting in New York',
    quote: 'Clear communication, fast responses and no surprises. Moving across the country felt surprisingly easy.',
    photo: '1544005313-94ddf0286df2',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Ethan Brooks',
    role: 'Property investor',
    quote: 'Their investment analysis was thorough and honest. I now trust LuxeEstate with three properties in my portfolio.',
    photo: '1556157382-97eda2d62296',
    rating: 4,
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 18, suffix: '+', label: 'Years of experience' },
  { value: 2400, suffix: '+', label: 'Properties sold & leased' },
  { value: 98, suffix: '%', label: 'Client satisfaction' },
  { value: 35, suffix: '', label: 'Expert advisors' },
];

export interface Reason {
  title: string;
  text: string;
  icon: LucideIcon;
}

export const reasons: Reason[] = [
  { title: 'Curated portfolio', text: 'Every listing is personally reviewed so you only see properties worth your time.', icon: Sparkles },
  { title: 'Trusted advisors', text: 'Licensed specialists with deep local knowledge and a record of discreet service.', icon: Users },
  { title: 'Transparent process', text: 'Clear fees, honest advice and regular updates from first call to final keys.', icon: ShieldCheck },
  { title: 'Market insight', text: 'Data-led pricing and investment guidance that protects your long-term value.', icon: LineChart },
];

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}

export const team: TeamMember[] = [
  { name: 'Richard Hale', role: 'Founder & Managing Director', photo: '1472099645785-5658abf4ff4e', bio: 'Founded LuxeEstate in 2008 after two decades in luxury development.' },
  { name: 'Olivia Bennett', role: 'Senior Luxury Advisor', photo: '1573496359142-b8d87734a5a2', bio: 'Specialist in waterfront villas and high-value residential sales.' },
  { name: 'James Carter', role: 'Commercial Property Director', photo: '1560250097-0b93528c311a', bio: 'Leads office, retail and investment transactions nationwide.' },
  { name: 'Sophia Martinez', role: 'Rentals & Leasing Manager', photo: '1580489944761-15a19d654956', bio: 'Matches tenants and owners with care across our rental portfolio.' },
  { name: 'Daniel Reyes', role: 'Residential Sales Specialist', photo: '1507003211169-0a1dd7228f2d', bio: 'Helps families find homes that fit both lifestyle and budget.' },
  { name: 'Emma Collins', role: 'Client Experience Lead', photo: '1438761681033-6461ffad8d80', bio: 'Ensures every client journey is smooth, informed and personal.' },
];

export const achievements = [
  { year: '2008', title: 'LuxeEstate founded', text: 'Opened our first office on Brickell Avenue, Miami.' },
  { year: '2014', title: 'National expansion', text: 'Launched teams in New York, Los Angeles and Austin.' },
  { year: '2019', title: 'Commercial division', text: 'Established a dedicated commercial and investment practice.' },
  { year: '2025', title: '2,400+ transactions', text: 'Surpassed 2,400 completed sales and leases.' },
];
