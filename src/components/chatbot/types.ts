import type { ListingType, Property, PropertyType } from '../../types';

export type Sender = 'bot' | 'user';

/** Quick-reply buttons carry an action token interpreted by the engine. */
export interface QuickReply {
  label: string;
  action: string;
}

export interface ChatLink {
  label: string;
  /** Internal route (starts with "/") or external URL. */
  href: string;
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  createdAt: Date;
  text?: string;
  properties?: Property[];
  links?: ChatLink[];
  quickReplies?: QuickReply[];
  /** Renders the inline agent follow-up form. */
  leadForm?: boolean;
}

export type BotMessage = Omit<ChatMessage, 'id' | 'sender' | 'createdAt'>;

/** `undefined` = not asked yet, 'any' = visitor has no preference. */
export interface SearchCriteria {
  listingType?: ListingType | 'any';
  propertyType?: PropertyType | 'any';
  city?: string | 'any';
  maxPrice?: number | 'any';
  minBedrooms?: number;
}

export interface ChatState {
  mode: 'idle' | 'search';
  criteria: SearchCriteria;
  leadSubmitted: boolean;
}

export interface EngineResult {
  messages: BotMessage[];
  state: ChatState;
}

export type ChatInput = { kind: 'text'; text: string } | { kind: 'action'; action: string };

export interface LeadDetails {
  name: string;
  email: string;
  phone: string;
  preference: 'email' | 'phone' | 'whatsapp';
}
