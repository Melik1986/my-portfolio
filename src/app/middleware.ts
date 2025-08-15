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

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
};
