/**
 * Demo inquiry handling. No backend is connected, so submissions are validated
 * client-side and acknowledged locally — nothing is emailed or stored on a server.
 * Replace `submitInquiry` with a call to your own API to go live.
 */
export type InquiryKind = 'contact' | 'viewing' | 'agent-lead' | 'newsletter';

export interface InquiryResult {
  ok: boolean;
  reference: string;
}

const STORAGE_KEY = 'luxeestate:demo-inquiries';

export async function submitInquiry(kind: InquiryKind, payload: Record<string, unknown>): Promise<InquiryResult> {
  await new Promise((r) => setTimeout(r, 700));
  const reference = `${kind.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  // Keep a local log so the demo is inspectable; ignore storage failures (private mode, quota).
  try {
    const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[];
    existing.push({ kind, payload, reference, at: new Date().toISOString() });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-20)));
  } catch {
    /* non-critical */
  }
  return { ok: true, reference };
}

export const DEMO_SUBMISSION_NOTE =
  'Demo mode: your details were validated in the browser only — no email was sent and nothing was saved to a server.';
