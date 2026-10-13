import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { DEMO_SUBMISSION_NOTE } from '../services/inquiryService';

export function FormSuccess({ title, children, onReset }: { title: string; children?: ReactNode; onReset?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      role="status"
      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
    >
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden />
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      {children && <div className="mt-2 text-sm text-charcoal/80">{children}</div>}
      <p className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-xs text-charcoal/70">{DEMO_SUBMISSION_NOTE}</p>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-4 text-sm font-medium text-gold-deep underline-offset-4 hover:underline">
          Send another request
        </button>
      )}
    </motion.div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {message}
    </div>
  );
}
