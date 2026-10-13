export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Permissive international phone check: 7–15 digits with common separators. */
export const phonePattern = /^\+?[\d\s().-]{7,20}$/;

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return phonePattern.test(value) && digits.length >= 7 && digits.length <= 15;
}
