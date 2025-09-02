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
import { AppReadyEmitter } from '../lib/ui/AppReadyEmitter';
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
  // В SCSS используется var(--font-leckerli)
  variable: '--font-leckerli',
  display: 'swap',
});

const robotoSerif = Roboto_Serif({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'cyrillic'],
  // В SCSS используется var(--font-roboto)
  variable: '--font-roboto',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Корректный способ генерации метаданных на сервере
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
        {/* Важно: прелоадер монтируется на уровне body, чтобы не попадать под скрытие main */}
        <GlobalPreloader />
        <AppThemeProvider>
          <I18nProvider locale={htmlLang as SupportedLocale}>
            <main className="portfolio" id="smooth-wrapper">
              <div className="portfolio__section" id="smooth-content">
                <Container>
                  {/* AppReadyEmitter отслеживает готовность ресурсов */}
                  <AppReadyEmitter />
                  {/* Прелоадер перенесен на уровень body */}
                  <ScrollSmootherProvider>{children}</ScrollSmootherProvider>
                </Container>
              </div>
              <AnchorButton />
              {/* Optional theme toggle, can be removed later */}
              {/* <ThemeToggle /> */}
            </main>
          </I18nProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
