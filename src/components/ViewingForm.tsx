import { CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitInquiry } from '../services/inquiryService';
import type { Property } from '../types';
import { emailPattern, isValidPhone } from '../utils/validation';
import { Button } from './Button';
import { FormError, FormSuccess } from './FormFeedback';
import { FormField } from './FormField';

interface ViewingValues {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  viewingType: 'in-person' | 'video';
  notes: string;
}

const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'];

function isoDate(d: Date) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function ViewingForm({ property }: { property: Property }) {
  const [confirmation, setConfirmation] = useState<ViewingValues | null>(null);
  const [submitError, setSubmitError] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const minIso = isoDate(tomorrow);
  const maxIso = isoDate(maxDate);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ViewingValues>({
    defaultValues: { name: '', email: '', phone: '', date: '', time: '', viewingType: 'in-person', notes: '' },
  });

  const onSubmit = async (values: ViewingValues) => {
    setSubmitError('');
    try {
      await submitInquiry('viewing', { ...values, propertyId: property.id, reference: property.reference });
      setConfirmation(values);
      reset();
    } catch {
      setSubmitError('We couldn’t submit your request. Please try again.');
    }
  };

  if (confirmation) {
    const when = new Date(`${confirmation.date}T${confirmation.time}`).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    return (
      <FormSuccess title="Viewing request received" onReset={() => setConfirmation(null)}>
        <p>
          {confirmation.viewingType === 'video' ? 'Video tour' : 'In-person viewing'} of <strong>{property.title}</strong>{' '}
          requested for <strong>{when}</strong>.
        </p>
        <p className="mt-1">In a live deployment, {property.agent.name} would confirm by email.</p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" aria-label={`Schedule a viewing of ${property.title}`}>
      <FormField id="viewing-name" label="Full name" required error={errors.name?.message}>
        <input
          type="text"
          autoComplete="name"
          className="field-input"
          {...register('name', { required: 'Please enter your name.', minLength: { value: 2, message: 'Name is too short.' } })}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="viewing-email" label="Email" required error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className="field-input"
            {...register('email', {
              required: 'Please enter your email.',
              pattern: { value: emailPattern, message: 'Please enter a valid email.' },
            })}
          />
        </FormField>
        <FormField id="viewing-phone" label="Phone" required error={errors.phone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            className="field-input"
            {...register('phone', {
              required: 'Please enter your phone number.',
              validate: (v) => isValidPhone(v) || 'Please enter a valid phone number.',
            })}
          />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="viewing-date" label="Preferred date" required error={errors.date?.message}>
          <input
            type="date"
            min={minIso}
            max={maxIso}
            className="field-input"
            {...register('date', {
              required: 'Please choose a date.',
              validate: (v) => (v >= minIso && v <= maxIso) || 'Choose a date between tomorrow and 90 days ahead.',
            })}
          />
        </FormField>
        <FormField id="viewing-time" label="Preferred time" required error={errors.time?.message}>
          <select className="field-input" {...register('time', { required: 'Please choose a time.' })}>
            <option value="">Select a time</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <fieldset>
        <legend className="field-label">Viewing type</legend>
        <div className="flex gap-3">
          {(
            [
              ['in-person', 'In person'],
              ['video', 'Video tour'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-navy-100 bg-white px-3 py-2.5 text-sm has-[:checked]:border-gold has-[:checked]:bg-beige/50"
            >
              <input type="radio" value={value} className="text-navy focus:ring-gold" {...register('viewingType')} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <FormField id="viewing-notes" label="Notes" error={errors.notes?.message}>
        <textarea
          rows={3}
          className="field-input resize-y"
          placeholder="Anything we should know?"
          {...register('notes', { maxLength: { value: 500, message: 'Please keep notes under 500 characters.' } })}
        />
      </FormField>
      {submitError && <FormError message={submitError} />}
      <Button type="submit" className="w-full" loading={isSubmitting} icon={<CalendarCheck className="h-4 w-4" aria-hidden />}>
        {isSubmitting ? 'Submitting…' : 'Request viewing'}
      </Button>
      <p className="text-center text-xs text-charcoal/60">Demo form — no booking is created and no email is sent.</p>
    </form>
  );
}
