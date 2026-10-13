import { ArrowUpRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { formatLocation, formatPrice, formatTime } from '../../utils/format';
import { SmartImage } from '../SmartImage';
import { LeadForm } from './LeadForm';
import type { ChatMessage, LeadDetails, QuickReply } from './types';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLatest: boolean;
  busy: boolean;
  onQuickReply: (qr: QuickReply) => void;
  onLeadSubmit: (values: LeadDetails) => Promise<void>;
  leadSubmitted: boolean;
  onNavigate: () => void;
}

export function ChatMessageItem({
  message: m,
  isLatest,
  busy,
  onQuickReply,
  onLeadSubmit,
  leadSubmitted,
  onNavigate,
}: ChatMessageItemProps) {
  const isBot = m.sender === 'bot';

  return (
    <li className={cn('flex gap-2', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-gold" aria-hidden>
          <Bot className="h-4 w-4" />
        </span>
      )}
      <div className={cn('flex max-w-[85%] flex-col', isBot ? 'items-start' : 'items-end')}>
        <span className="sr-only">{isBot ? 'Assistant said:' : 'You said:'}</span>
        {m.text && (
          <p
            className={cn(
              'whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
              isBot ? 'rounded-tl-sm bg-beige/70 text-charcoal' : 'rounded-tr-sm bg-navy text-ivory',
            )}
          >
            {m.text}
          </p>
        )}

        {m.properties && m.properties.length > 0 && (
          <ul className="mt-2 w-full space-y-2">
            {m.properties.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/properties/${p.slug}`}
                  onClick={onNavigate}
                  className="group flex gap-3 rounded-xl border border-navy/10 bg-white p-2 transition hover:border-gold hover:shadow-card"
                >
                  <SmartImage
                    photoId={p.images[0].id}
                    alt=""
                    aspect={1}
                    widths={[120, 240]}
                    sizes="64px"
                    className="h-16 w-16 shrink-0 rounded-lg"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy group-hover:text-gold-deep">{p.title}</span>
                    <span className="block truncate text-xs text-charcoal/65">{formatLocation(p)}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-gold-deep">{formatPrice(p)}</span>
                    <span className="block text-[11px] text-charcoal/60">
                      {p.bedrooms > 0 ? `${p.bedrooms} bd · ` : ''}
                      {p.bathrooms} ba · {p.area.toLocaleString('en-US')} sq ft
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {m.leadForm && !leadSubmitted && <LeadForm onSubmit={onLeadSubmit} />}

        {m.links && m.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.links.map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.href + l.label}
                  to={l.href}
                  onClick={onNavigate}
                  className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-white px-3 py-1 text-xs font-medium text-navy hover:border-gold"
                >
                  {l.label}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </Link>
              ) : (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-white px-3 py-1 text-xs font-medium text-navy hover:border-gold"
                >
                  {l.label}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              ),
            )}
          </div>
        )}

        {isLatest && m.quickReplies && m.quickReplies.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Suggested replies">
            {m.quickReplies.map((qr) => (
              <button
                key={qr.action}
                type="button"
                disabled={busy}
                onClick={() => onQuickReply(qr)}
                className="rounded-full border border-gold bg-white px-3 py-1.5 text-xs font-medium text-navy transition hover:bg-gold disabled:opacity-50"
              >
                {qr.label}
              </button>
            ))}
          </div>
        )}

        <time className="mt-1 px-1 text-[10px] text-charcoal/50" dateTime={m.createdAt.toISOString()}>
          {formatTime(m.createdAt)}
        </time>
      </div>
    </li>
  );
}
