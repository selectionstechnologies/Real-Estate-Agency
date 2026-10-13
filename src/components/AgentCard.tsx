import { Mail, MessageCircle, Phone } from 'lucide-react';
import { mailLink, telLink, whatsappLink } from '../config/site';
import type { Agent } from '../types';
import { SmartImage } from './SmartImage';

interface AgentCardProps {
  agent: Agent;
  /** Used to prefill email subjects and WhatsApp messages. */
  propertyTitle?: string;
  propertyRef?: string;
}

export function AgentCard({ agent, propertyTitle, propertyRef }: AgentCardProps) {
  const subject = propertyTitle ? `Enquiry: ${propertyTitle} (${propertyRef})` : 'Property enquiry';
  const waMessage = propertyTitle
    ? `Hello ${agent.name.split(' ')[0]}, I'm interested in ${propertyTitle} (ref ${propertyRef}).`
    : `Hello ${agent.name.split(' ')[0]}, I'd like some help finding a property.`;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <p className="eyebrow">Listing agent</p>
      <div className="mt-4 flex items-center gap-4">
        <SmartImage
          photoId={agent.photo}
          alt={`Portrait of ${agent.name}`}
          aspect={1}
          widths={[128, 256]}
          sizes="64px"
          faces
          className="h-16 w-16 shrink-0 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{agent.name}</h3>
          <p className="text-sm text-charcoal/70">{agent.role}</p>
          <p className="mt-0.5 text-xs text-charcoal/60">
            {agent.yearsExperience} yrs experience · {agent.languages.join(', ')}
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        <a
          href={telLink(agent.phone)}
          className="flex items-center gap-3 rounded-lg border border-navy/10 px-4 py-2.5 text-sm text-navy transition hover:border-gold hover:bg-beige/40"
        >
          <Phone className="h-4 w-4 text-gold-deep" aria-hidden />
          {agent.phone}
        </a>
        <a
          href={mailLink(subject, agent.email)}
          className="flex items-center gap-3 rounded-lg border border-navy/10 px-4 py-2.5 text-sm text-navy transition hover:border-gold hover:bg-beige/40"
        >
          <Mail className="h-4 w-4 text-gold-deep" aria-hidden />
          <span className="truncate">{agent.email}</span>
        </a>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#186640]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
