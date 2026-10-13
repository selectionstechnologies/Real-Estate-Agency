/**
 * Assistant provider abstraction.
 *
 * By default the site uses the deterministic rule engine (`engine.ts`). To
 * connect a real AI model later, set VITE_CHAT_API_URL to an endpoint on YOUR
 * OWN backend. That backend keeps the AI provider's secret key server-side and
 * returns `{ text: string, propertyIds?: string[] }`. The browser never sees a key.
 *
 * Recommendations from a remote model are mapped back onto the local dataset,
 * so unknown or invented property ids are dropped rather than displayed.
 */
import { siteConfig } from '../../config/site';
import { getPropertiesByIds } from '../../services/propertyService';
import { respond } from './engine';
import type { ChatInput, ChatState, EngineResult } from './types';

export const isRemoteAssistant = Boolean(siteConfig.chatApiUrl);

interface RemoteResponse {
  text?: unknown;
  propertyIds?: unknown;
}

async function remoteReply(input: ChatInput, state: ChatState, transcript: string[]): Promise<EngineResult> {
  // Structured quick-reply actions stay deterministic even when a model is connected.
  if (input.kind === 'action') return respond(input, state);

  const res = await fetch(siteConfig.chatApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input.text, history: transcript.slice(-10), criteria: state.criteria }),
  });
  if (!res.ok) throw new Error(`Assistant API responded ${res.status}`);
  const data = (await res.json()) as RemoteResponse;
  if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('Assistant API returned no text');

  const ids = Array.isArray(data.propertyIds) ? data.propertyIds.filter((x): x is string => typeof x === 'string') : [];
  const props = getPropertiesByIds(ids);
  return { state, messages: [{ text: data.text, properties: props.length ? props : undefined }] };
}

/** Returns the assistant's reply, with a short natural delay for the typing indicator. */
export async function getAssistantReply(input: ChatInput, state: ChatState, transcript: string[]): Promise<EngineResult> {
  const started = Date.now();
  let result: EngineResult;
  if (isRemoteAssistant) {
    try {
      result = await remoteReply(input, state, transcript);
    } catch {
      const fallback = respond(input, state);
      result = {
        ...fallback,
        messages: [{ text: 'The AI service is unavailable right now, so I’m answering with my built-in responses.' }, ...fallback.messages],
      };
    }
  } else {
    result = respond(input, state);
  }
  const minDelay = 550 + Math.min(700, (result.messages[0]?.text?.length ?? 0) * 4);
  const elapsed = Date.now() - started;
  if (elapsed < minDelay) await new Promise((r) => setTimeout(r, minDelay - elapsed));
  return result;
}
