import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { emailPattern, isValidPhone } from '../../utils/validation';
import type { LeadDetails } from './types';

interface LeadFormProps {
  onSubmit: (values: LeadDetails) => Promise<void>;
}

export function LeadForm({ onSubmit }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadDetails>({ defaultValues: { name: '', email: '', phone: '', preference: 'email' } });
  const preference = watch('preference');
  const phoneNeeded = preference !== 'email';

  const input =
    'block w-full rounded-lg border-navy-100 px-3 py-2 text-sm focus:border-gold focus:ring-gold aria-[invalid=true]:border-red-400';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-2 space-y-2.5 rounded-xl border border-navy/10 bg-ivory p-3"
      aria-label="Agent follow-up details"
    >
      <div>
        <label htmlFor="lead-name" className="mb-1 block text-xs font-medium text-navy">
          Name
        </label>
        <input
          id="lead-name"
          autoComplete="name"
          className={input}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'lead-name-err' : undefined}
          {...register('name', { required: 'Please enter your name.', minLength: { value: 2, message: 'Name is too short.' } })}
        />
        {errors.name && (
          <p id="lead-name-err" className="mt-1 text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="lead-email" className="mb-1 block text-xs font-medium text-navy">
          Email
        </label>
        <input
          id="lead-email"
          type="email"
          autoComplete="email"
          className={input}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'lead-email-err' : undefined}
          {...register('email', {
            required: 'Please enter your email.',
            pattern: { value: emailPattern, message: 'Please enter a valid email.' },
          })}
        />
        {errors.email && (
          <p id="lead-email-err" className="mt-1 text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>
      <fieldset>
        <legend className="mb-1 block text-xs font-medium text-navy">Preferred contact</legend>
        <div className="flex gap-1.5">
          {(
            [
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['whatsapp', 'WhatsApp'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-xs has-[:checked]:border-gold has-[:checked]:bg-beige/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold"
            >
              <input type="radio" value={value} className="sr-only" {...register('preference')} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="lead-phone" className="mb-1 block text-xs font-medium text-navy">
          Phone {phoneNeeded ? '' : <span className="font-normal text-charcoal/60">(optional)</span>}
        </label>
        <input
          id="lead-phone"
          type="tel"
          autoComplete="tel"
          className={input}
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'lead-phone-err' : undefined}
          {...register('phone', {
            validate: (v, all) => {
              if (!v) return all.preference === 'email' || 'Please enter a phone number for this contact method.';
              return isValidPhone(v) || 'Please enter a valid phone number.';
            },
          })}
        />
        {errors.phone && (
          <p id="lead-phone-err" className="mt-1 text-xs text-red-600">
            {errors.phone.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2 text-sm font-medium text-ivory transition hover:bg-navy-600 disabled:opacity-60"
      >
        <Send className="h-3.5 w-3.5" aria-hidden />
        {isSubmitting ? 'Sending…' : 'Request a call back'}
      </button>
      <p className="text-[11px] leading-snug text-charcoal/60">
        Demo: details stay in this browser session and are not sent to anyone.
      </p>
    </form>
  );
}
