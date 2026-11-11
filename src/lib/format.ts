import type { Lang } from '@/types';

const LOCALES: Record<Lang, string> = { ar: 'ar-MA', fr: 'fr-MA', en: 'en-GB' };

export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template,
  );
}

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function nextDays(count: number): Date[] {
  const today = new Date();
  return Array.from(
    { length: count },
    (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
  );
}

export function formatDate(isoDate: string, lang: Lang, options: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(LOCALES[lang], options).format(new Date(year, month - 1, day));
}

export function formatMonth(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], { month: 'short' }).format(date);
}

export function formatWeekday(index: number, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], { weekday: 'short' }).format(new Date(2024, 0, 7 + index));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidMoroccanPhone(value: string): boolean {
  return /^(\+212|0)[5-7]\d{8}$/.test(value.replace(/[\s.-]/g, ''));
}
