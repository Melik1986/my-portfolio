import { cookies, headers } from 'next/headers';
import type { SupportedLocale } from '@/i18n';

export async function getRequestLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const hdrs = await headers();
  const cookieLocale = cookieStore.get('locale')?.value || '';
  const headerLocale = (hdrs.get('x-locale') || '').toLowerCase();
  const accept = hdrs.get('accept-language') || '';
  const preferred = (cookieLocale || headerLocale || accept.split(',')[0]?.slice(0, 2) || 'en').toLowerCase();
  return preferred === 'ru' ? 'ru' : 'en';
}

