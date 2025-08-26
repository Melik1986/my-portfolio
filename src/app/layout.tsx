import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { tServer } from '@/i18n/server';
import { I18nProvider } from '@/i18n';
import type { SupportedLocale } from '@/i18n';
import { Roboto_Serif, Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import './styles/globals.scss';
import AppThemeProvider from './ThemeProvider';
import Container from '../lib/ui/Container/Container';
import { AnchorButton } from '../lib/ui/AnchorButton/AnchorButton';
import { ScrollSmootherProvider } from '../lib/gsap/components/ScrollSmootherProvider';
import { GlobalPreloader } from '../lib/ui/GlobalPreloader/GlobalPreloader';
import LanguageSwitcher from '@/lib/ui/LanguageSwitcher/LanguageSwitcher';

// Локальные шрифты
const chango = localFont({
  src: [
    {
      path: '../../public/fonts/Chango-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-chango',
  display: 'swap',
});

const okinawa = localFont({
  src: [
    {
      path: '../../public/fonts/Okinawa.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-okinawa',
  display: 'swap',
});

const leckerliOne = localFont({
  src: [
    {
      path: '../../public/fonts/LeckerliOne-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-leckerli',
  display: 'swap',
});

// Google Fonts
const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

/**
 * Метаданные для SEO оптимизации
 * Определяет заголовок и описание страницы для поисковых систем
 */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const hdrs = await headers();
  const cookieLocale = cookieStore.get('locale')?.value || '';
  const headerLocale = (hdrs.get('x-locale') || '').toLowerCase();
  const accept = hdrs.get('accept-language') || '';
  const preferred = (cookieLocale || headerLocale || accept.split(',')[0]?.slice(0, 2) || 'en').toLowerCase();
  const locale = preferred === 'ru' ? 'ru' : 'en';

  return {
    title: {
      default: tServer(locale, 'seo.title.default'),
      template: tServer(locale, 'seo.title.template'),
    },
    description: tServer(locale, 'seo.description'),
    keywords: ['portfolio', 'web developer', 'React', 'Next.js', 'TypeScript', 'full-stack'],
    authors: [{ name: 'Melik Musinian' }],
    creator: 'Melik Musinian',
    publisher: 'Melik Musinian',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://melikmusinian.com'),
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      url: 'https://melikmusinian.com',
      siteName: tServer(locale, 'seo.siteName'),
      title: tServer(locale, 'seo.title.default'),
      description: tServer(locale, 'seo.description'),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: tServer(locale, 'seo.og.alt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tServer(locale, 'seo.title.default'),
      description: tServer(locale, 'seo.description'),
      images: ['/images/og-image.jpg'],
      creator: '@melikmusinian',
    },
    other: {
      'font-chango': '/fonts/Chango-Regular.woff2',
      'font-okinawa': '/fonts/Okinawa.woff2',
      'font-leckerli': '/fonts/LeckerliOne-Regular.woff2',
      'font-roboto': '/fonts/RobotoSerif-Regular.woff2',
      'font-poppins': '/fonts/Poppins-Regular.woff2',
    },
  };
}

/**
 * Корневой layout компонент
 * Оборачивает все страницы в HTML структуру с контейнером
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hdrs = typeof window === 'undefined' ? undefined : undefined;
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value || 'en';
  const htmlLang = cookieLocale === 'ru' ? 'ru' : 'en';

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body
        className={`${chango.variable} ${okinawa.variable} ${leckerliOne.variable} ${robotoSerif.variable} ${poppins.variable}`}
      >
        <AppThemeProvider>
          <I18nProvider locale={htmlLang as SupportedLocale}>
          <main className="portfolio" id="smooth-wrapper">
            <div className="portfolio__section" id="smooth-content">
              <Container>
                {/* Важно: прелоадер монтируется до ScrollSmootherProvider */}
                <GlobalPreloader />
                <ScrollSmootherProvider>{children}</ScrollSmootherProvider>
              </Container>
            </div>
            <AnchorButton />
            <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }}>
              <LanguageSwitcher />
            </div>
            {/* Optional theme toggle, can be removed later */}
            {/* <ThemeToggle /> */}
          </main>
          </I18nProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
