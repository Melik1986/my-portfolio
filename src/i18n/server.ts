import type { NextRequest } from 'next/server';
import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';

export type SupportedLocale = 'en' | 'ru';

const dictionaries: Record<SupportedLocale, Record<string, string>> = {
  en,
  ru,
};

export function getLocaleFromRequest(req: NextRequest): SupportedLocale {
  const cookieLocale = req.cookies.get('locale')?.value as SupportedLocale | undefined;
  const headerLocale = (req.headers.get('x-locale') || '').toLowerCase() as
    | SupportedLocale
    | '';
  const acceptLanguage = req.headers.get('accept-language') || '';

  const candidate = cookieLocale || headerLocale || acceptLanguage.split(',')[0]?.slice(0, 2);
  return candidate === 'ru' ? 'ru' : 'en';
}

export function tServer(
  locale: SupportedLocale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] || dictionaries.en;
  const template = dict[key] || dictionaries.en[key] || key;
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, k) => acc.replaceAll(`{${k}}`, String(vars[k])), template);
}

