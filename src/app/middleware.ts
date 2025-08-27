import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Логирование запросов
  console.log(`${request.method} ${request.url}`);

  // Базовые заголовки безопасности
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Кэширование для статических ресурсов
  if (request.nextUrl.pathname.startsWith('/api/projects')) {
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
  }

  // Locale cookie normalization
  const cookieLocale = request.cookies.get('locale')?.value;
  const accept = request.headers.get('accept-language') || '';
  const headerLocale = (request.headers.get('x-locale') || '').toLowerCase();
  const preferred = (
    cookieLocale ||
    headerLocale ||
    accept.split(',')[0]?.slice(0, 2) ||
    'en'
  ).toLowerCase();
  const normalized = preferred === 'ru' ? 'ru' : 'en';

  if (cookieLocale !== normalized) {
    response.cookies.set('locale', normalized, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  // Set lang on HTML via header for client to read (optional helper)
  response.headers.set('x-html-lang', normalized);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
};
