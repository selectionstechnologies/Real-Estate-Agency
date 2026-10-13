import { Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitInquiry } from '../services/inquiryService';
import { emailPattern, isValidPhone } from '../utils/validation';
import { Button } from './Button';
import { FormError, FormSuccess } from './FormFeedback';
import { FormField } from './FormField';

interface ContactValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const contactSubjects = [
  'Buying a property',
  'Renting a property',
  'Selling my property',
  'Property valuation',
  'Investment consultation',
  'Commercial real estate',
  'Something else',
];

export function ContactForm({ defaultSubject = '' }: { defaultSubject?: string }) {
  const [result, setResult] = useState<{ reference: string; name: string } | null>(null);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: contactSubjects.includes(defaultSubject) ? defaultSubject : '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactValues) => {
    setSubmitError('');
    try {
      const res = await submitInquiry('contact', { ...values });
      setResult({ reference: res.reference, name: values.name.split(' ')[0] });
      reset();
    } catch {
      setSubmitError('Something went wrong while sending your message. Please try again or call us directly.');
    }
  };

  if (result) {
    return (
      <FormSuccess title={`Thank you, ${result.name}!`} onReset={() => setResult(null)}>
        <p>
          Your message passed validation. Reference <strong className="font-semibold">{result.reference}</strong>.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label="Full name" required error={errors.name?.message}>
          <input
            type="text"
            autoComplete="name"
            className="field-input"
            {...register('name', {
              required: 'Please enter your name.',
              minLength: { value: 2, message: 'Name must be at least 2 characters.' },
            })}
          />
        </FormField>
        <FormField id="contact-email" label="Email" required error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className="field-input"
            {...register('email', {
              required: 'Please enter your email.',
              pattern: { value: emailPattern, message: 'Please enter a valid email address.' },
            })}
          />
        </FormField>
        <FormField id="contact-phone" label="Phone" error={errors.phone?.message} hint="Optional — include country code.">
          <input
            type="tel"
            autoComplete="tel"
            className="field-input"
            {...register('phone', {
              validate: (v) => !v || isValidPhone(v) || 'Please enter a valid phone number.',
            })}
          />
        </FormField>
        <FormField id="contact-subject" label="Subject" required error={errors.subject?.message}>
          <select className="field-input" {...register('subject', { required: 'Please choose a subject.' })}>
            <option value="">Select a subject</option>
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField id="contact-message" label="Message" required error={errors.message?.message}>
        <textarea
          rows={5}
          className="field-input resize-y"
          placeholder="Tell us what you’re looking for…"
          {...register('message', {
            required: 'Please enter a message.',
            minLength: { value: 10, message: 'Please write at least 10 characters.' },
            maxLength: { value: 2000, message: 'Please keep your message under 2,000 characters.' },
          })}
        />
      </FormField>
      {submitError && <FormError message={submitError} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-charcoal/60">Demo form — validated in your browser; no data is sent to a server.</p>
        <Button type="submit" loading={isSubmitting} icon={<Send className="h-4 w-4" aria-hidden />}>
          {isSubmitting ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}
