import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitInquiry } from '../services/inquiryService';
import { emailPattern } from '../utils/validation';

interface FormValues {
  email: string;
}

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await submitInquiry('newsletter', { ...values });
    setDone(true);
  };

  if (done) {
    return (
      <p className="flex items-start gap-2 text-sm text-ivory/80" role="status">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
        Thanks for subscribing! (Demo — no mailing list is connected yet.)
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex rounded-full border border-ivory/20 bg-ivory/5 p-1 focus-within:border-gold">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'newsletter-error' : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-ivory placeholder:text-ivory/40 focus:ring-0"
          {...register('email', {
            required: 'Please enter your email.',
            pattern: { value: emailPattern, message: 'Please enter a valid email.' },
          })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-navy transition hover:bg-gold-light disabled:opacity-60"
          aria-label="Subscribe to newsletter"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {errors.email && (
        <p id="newsletter-error" className="mt-2 text-xs text-red-300">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
