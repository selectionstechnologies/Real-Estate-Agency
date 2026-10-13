import { useCallback, useEffect, useState } from 'react';

/** useState persisted to localStorage; falls back to memory if storage is unavailable. */
export function useLocalStorage<T>(key: string, initialValue: T, validate?: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      return validate && !validate(parsed) ? initialValue : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked or full — keep in-memory state */
    }
  }, [key, value]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue == null) return;
      try {
        const parsed: unknown = JSON.parse(e.newValue);
        if (!validate || validate(parsed)) setValue(parsed as T);
      } catch {
        /* ignore malformed value */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, validate]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, setValue, reset] as const;
}
