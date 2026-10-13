import { Loader2 } from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

type Variant = 'primary' | 'gold' | 'outline' | 'outline-light' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-ivory hover:bg-navy-600 shadow-sm hover:shadow-card',
  gold: 'bg-gold text-navy hover:bg-gold-light shadow-sm hover:shadow-card',
  outline: 'border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-ivory',
  'outline-light': 'border border-ivory/40 text-ivory hover:bg-ivory hover:text-navy',
  ghost: 'text-navy hover:bg-navy/5',
  whatsapp: 'bg-[#1f7a4d] text-white hover:bg-[#186640] shadow-sm',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined; loading?: boolean };
type RouterLinkProps = CommonProps & { to: string; href?: undefined; onClick?: () => void; 'aria-label'?: string };
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };

export type Props = ButtonProps | RouterLinkProps | AnchorProps;

/** A button that renders as <button>, a router <Link> (`to`) or an external <a> (`href`). */
export function Button(props: Props) {
  const { variant = 'primary', size = 'md', icon, iconRight, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {iconRight}
    </>
  );

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick} aria-label={props['aria-label']}>
        {content}
      </Link>
    );
  }

  if (props.href !== undefined) {
    const { variant: _v, size: _s, icon: _i, iconRight: _ir, className: _c, children: _ch, ...rest } = props as AnchorProps;
    const external = /^https?:/.test(props.href);
    return (
      <a {...rest} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    iconRight: _ir,
    className: _c,
    children: _ch,
    loading,
    type = 'button',
    disabled,
    ...rest
  } = props as ButtonProps;
  return (
    <button {...rest} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={classes}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
