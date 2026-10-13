import { Calculator } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/format';

/** Standard amortized monthly payment (principal + interest). */
export function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function MortgageCalculator({ price }: { price: number }) {
  const uid = useId();
  const [homePrice, setHomePrice] = useState(price);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const { loan, payment, totalInterest } = useMemo(() => {
    const loan = Math.max(0, homePrice * (1 - downPct / 100));
    const payment = monthlyPayment(loan, rate, years);
    return { loan, payment, totalInterest: payment * years * 12 - loan };
  }, [homePrice, downPct, rate, years]);

  const num = (v: string, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card" aria-labelledby={`${uid}-title`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-beige text-gold-deep">
          <Calculator className="h-5 w-5" aria-hidden />
        </span>
        <h2 id={`${uid}-title`} className="text-xl font-semibold">
          Mortgage calculator
        </h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-price`} className="field-label">
            Property price ($)
          </label>
          <input
            id={`${uid}-price`}
            type="number"
            min={0}
            step={1000}
            value={homePrice}
            onChange={(e) => setHomePrice(Math.max(0, num(e.target.value)))}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-rate`} className="field-label">
            Interest rate (%)
          </label>
          <input
            id={`${uid}-rate`}
            type="number"
            min={0}
            max={20}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(Math.min(20, Math.max(0, num(e.target.value))))}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-down`} className="field-label">
            Down payment: {downPct}% ({formatCurrency(homePrice * (downPct / 100))})
          </label>
          <input
            id={`${uid}-down`}
            type="range"
            min={0}
            max={90}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(num(e.target.value, 20))}
            className="w-full accent-[#C6A56B]"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-years`} className="field-label">
            Loan term
          </label>
          <select id={`${uid}-years`} value={years} onChange={(e) => setYears(num(e.target.value, 30))} className="field-input">
            {[10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>
                {y} years
              </option>
            ))}
          </select>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl bg-navy p-5 text-ivory sm:grid-cols-3" aria-live="polite">
        <div>
          <dt className="text-xs uppercase tracking-widest text-ivory/60">Monthly payment</dt>
          <dd className="mt-1 font-serif text-2xl font-semibold text-gold">{formatCurrency(Math.round(payment))}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-ivory/60">Loan amount</dt>
          <dd className="mt-1 text-lg font-semibold">{formatCurrency(Math.round(loan))}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-ivory/60">Total interest</dt>
          <dd className="mt-1 text-lg font-semibold">{formatCurrency(Math.max(0, Math.round(totalInterest)))}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-charcoal/60">
        Estimate only — principal and interest, excluding taxes, insurance and fees. Not a loan offer.
      </p>
    </section>
  );
}
