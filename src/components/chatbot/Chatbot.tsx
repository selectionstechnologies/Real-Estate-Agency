import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Minus, SendHorizonal, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { submitInquiry } from '../../services/inquiryService';
import { cn } from '../../utils/cn';
import { getAssistantReply, isRemoteAssistant } from './chatService';
import { ChatMessageItem } from './ChatMessageItem';
import { initialChatState, welcomeMessages } from './engine';
import type { BotMessage, ChatInput, ChatMessage, ChatState, LeadDetails, QuickReply } from './types';

let idCounter = 0;
const newId = () => `m${Date.now().toString(36)}${(idCounter++).toString(36)}`;

const toChat = (msgs: BotMessage[]): ChatMessage[] =>
  msgs.map((m) => ({ ...m, id: newId(), sender: 'bot' as const, createdAt: new Date() }));

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => toChat(welcomeMessages()));
  const [state, setState] = useState<ChatState>(initialChatState);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [unread, setUnread] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const openRef = useRef(open);
  openRef.current = open;

  // Keep the latest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      // Wait for the open animation to mount the input.
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const pushBot = useCallback((msgs: BotMessage[]) => {
    setMessages((prev) => [...prev, ...toChat(msgs)]);
    if (!openRef.current) setUnread(true);
  }, []);

  const send = useCallback(
    async (input: ChatInput, displayText: string) => {
      if (typing) return;
      setMessages((prev) => [...prev, { id: newId(), sender: 'user', createdAt: new Date(), text: displayText }]);
      setTyping(true);
      try {
        const transcript = messages.filter((m) => m.text).map((m) => `${m.sender}: ${m.text}`);
        const result = await getAssistantReply(input, stateRef.current, transcript);
        setState(result.state);
        pushBot(result.messages);
      } catch {
        pushBot([
          {
            text: 'Sorry, something went wrong on my side. Please try again, or contact the team directly.',
            links: [{ label: 'Contact page', href: '/contact' }],
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [typing, messages, pushBot],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    void send({ kind: 'text', text: text.slice(0, 500) }, text.slice(0, 500));
  };

  const onQuickReply = (qr: QuickReply) => void send({ kind: 'action', action: qr.action }, qr.label);

  const onLeadSubmit = async (values: LeadDetails) => {
    await submitInquiry('agent-lead', { ...values, criteria: stateRef.current.criteria });
    setState((s) => ({ ...s, leadSubmitted: true }));
    const via =
      values.preference === 'email' ? `email at ${values.email}` : values.preference === 'phone' ? `phone at ${values.phone}` : `WhatsApp at ${values.phone}`;
    setMessages((prev) => [
      ...prev,
      { id: newId(), sender: 'user', createdAt: new Date(), text: `Please contact me by ${values.preference}.` },
    ]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 700));
    setTyping(false);
    inputRef.current?.focus();
    pushBot([
      {
        text: `Thank you, ${values.name.split(' ')[0]}! In a live deployment, an advisor would contact you by ${via} within one business day.\n\nDemo note: no message has actually been sent — your details were only validated in this browser.`,
        quickReplies: [
          { label: 'Find a property', action: 'restart' },
          { label: 'View Listings', action: 'listings' },
        ],
      },
    ]);
  };

  const minimize = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Escape minimizes while open, wherever focus is (e.g. after the lead form unmounts).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[aria-modal="true"]')) minimize();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, minimize]);

  const closeAndReset = () => {
    setOpen(false);
    launcherRef.current?.focus();
    // Reset after the close animation so the content doesn't flash.
    window.setTimeout(() => {
      setMessages(toChat(welcomeMessages()));
      setState(initialChatState);
      setDraft('');
      setUnread(false);
    }, 250);
  };

  const lastBotIndex = messages.map((m) => m.sender).lastIndexOf('bot');

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-modal="false"
            aria-labelledby="chatbot-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-x-2 bottom-2 top-[80px] z-[60] flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-lift sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[min(620px,calc(100vh-8rem))] sm:w-[390px]"
          >
            <header className="flex items-center gap-3 bg-navy px-4 py-3 text-ivory">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Bot className="h-5 w-5" aria-hidden />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-navy bg-emerald-400" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="chatbot-title" className="font-serif text-base font-semibold text-ivory">
                  LuxeEstate Assistant
                </h2>
                <p className="truncate text-[11px] text-ivory/65">
                  {isRemoteAssistant ? 'AI assistant · connected via secure backend' : 'Demo assistant · rule-based answers'}
                </p>
              </div>
              <button
                type="button"
                onClick={minimize}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ivory/80 hover:bg-ivory/10 hover:text-ivory"
                aria-label="Minimize chat"
                title="Minimize"
              >
                <Minus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={closeAndReset}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ivory/80 hover:bg-ivory/10 hover:text-ivory"
                aria-label="Close chat and clear conversation"
                title="Close & clear"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {!isRemoteAssistant && (
              <p className="border-b border-gold/20 bg-beige/60 px-4 py-1.5 text-center text-[11px] text-charcoal/75">
                Demo mode: answers come from predefined rules and this site’s listings — no AI model is connected.
              </p>
            )}

            <ul
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-ivory/60 px-3 py-4"
            >
              {messages.map((m, i) => (
                <ChatMessageItem
                  key={m.id}
                  message={m}
                  isLatest={i === lastBotIndex && !typing}
                  busy={typing}
                  onQuickReply={onQuickReply}
                  onLeadSubmit={onLeadSubmit}
                  leadSubmitted={state.leadSubmitted}
                  onNavigate={() => {
                    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false);
                  }}
                />
              ))}
              {typing && (
                <li className="flex items-center gap-2" aria-label="Assistant is typing">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-gold" aria-hidden>
                    <Bot className="h-4 w-4" />
                  </span>
                  <span className="flex gap-1 rounded-2xl rounded-tl-sm bg-beige/70 px-4 py-3" aria-hidden>
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-navy/60"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </span>
                  <span className="sr-only">Assistant is typing…</span>
                </li>
              )}
            </ul>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-navy/10 bg-white p-3">
              <label htmlFor="chatbot-input" className="sr-only">
                Type your message
              </label>
              <input
                ref={inputRef}
                id="chatbot-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={500}
                autoComplete="off"
                placeholder="e.g. Villa in Miami under $5M"
                className="min-w-0 flex-1 rounded-full border-navy-100 bg-ivory px-4 py-2.5 text-sm focus:border-gold focus:ring-gold"
              />
              <button
                type="submit"
                disabled={!draft.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold transition hover:bg-navy-600 disabled:opacity-40"
                aria-label="Send message"
              >
                <SendHorizonal className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={open}
        aria-label={open ? 'Minimize LuxeEstate Assistant' : `Open LuxeEstate Assistant chat${unread ? ' (new message)' : ''}`}
        className={cn(
          'fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold shadow-lift ring-1 ring-gold/30 transition-colors hover:bg-navy-600 sm:bottom-6 sm:right-6',
          open && 'max-sm:hidden',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
          </motion.span>
        </AnimatePresence>
        {unread && !open && (
          <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-ivory bg-gold" aria-hidden />
        )}
      </motion.button>
    </>
  );
}
