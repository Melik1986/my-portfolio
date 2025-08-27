import type { Metadata } from 'next';
import { cookies } from 'next/headers';
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
import { getRequestLocale } from './seo/getRequestLocale';
import { buildMetadataForLocale } from './seo/buildMetadata';

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
  const locale = await getRequestLocale();
  return buildMetadataForLocale(locale);
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
