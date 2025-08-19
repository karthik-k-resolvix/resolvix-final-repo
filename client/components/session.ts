// src/components/session.ts
export function setSession<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSession<T>(key: string): T | null {
  if (typeof window === 'undefined') return null; // avoid "window is not defined"
  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}
