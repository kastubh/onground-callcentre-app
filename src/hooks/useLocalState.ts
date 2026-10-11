import { useState, type Dispatch, type SetStateAction } from 'react';
export function useLocalState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });
  const update: Dispatch<SetStateAction<T>> = (value) =>
    setState((previous) => {
      const next = typeof value === 'function' ? (value as (previous: T) => T)(previous) : value;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Storage may be unavailable in private browsing. */
      }
      return next;
    });
  return [state, update];
}
