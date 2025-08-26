import type { Metadata } from 'next';
import { Roboto_Serif, Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import './styles/globals.scss';
import AppThemeProvider from './ThemeProvider';
import Container from '../lib/ui/Container/Container';
import { AnchorButton } from '../lib/ui/AnchorButton/AnchorButton';
import { ScrollSmootherProvider } from '../lib/gsap/components/ScrollSmootherProvider';
import { GlobalPreloader } from '../lib/ui/GlobalPreloader/GlobalPreloader';
import { JsonLd } from '../lib/ui';

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
export const metadata: Metadata = {
  title: {
    default: 'My Portfolio | Full-Stack Developer',
    template: '%s | My Portfolio',
  },
  description:
    'Personal portfolio website showcasing web development projects, skills, and experience in React, Next.js, TypeScript, and more.',
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
    locale: 'en_US',
    url: 'https://melikmusinian.com',
    siteName: 'My Portfolio',
    title: 'My Portfolio | Full-Stack Developer',
    description:
      'Personal portfolio website showcasing web development projects, skills, and experience in React, Next.js, TypeScript, and more.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Portfolio - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Portfolio | Full-Stack Developer',
    description:
      'Personal portfolio website showcasing web development projects, skills, and experience in React, Next.js, TypeScript, and more.',
    images: ['/images/og-image.jpg'],
    creator: '@melikmusinian',
  },
  other: {
    // Preload критических шрифтов
    'font-chango': '/fonts/Chango-Regular.woff2',
    'font-okinawa': '/fonts/Okinawa.woff2',
    'font-leckerli': '/fonts/LeckerliOne-Regular.woff2',
    'font-roboto': '/fonts/RobotoSerif-Regular.woff2',
    'font-poppins': '/fonts/Poppins-Regular.woff2',
  },
};

/**
 * Корневой layout компонент
 * Оборачивает все страницы в HTML структуру с контейнером
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${chango.variable} ${okinawa.variable} ${leckerliOne.variable} ${robotoSerif.variable} ${poppins.variable}`}
      >
        <AppThemeProvider>
          <main className="portfolio" id="smooth-wrapper">
            <div className="portfolio__section" id="smooth-content">
              <Container>
                {/* Важно: прелоадер монтируется до ScrollSmootherProvider */}
                <GlobalPreloader />
                <ScrollSmootherProvider>{children}</ScrollSmootherProvider>
              </Container>
            </div>
            <AnchorButton />
            {/* Optional theme toggle, can be removed later */}
            {/* <ThemeToggle /> */}
          </main>
          {/* JSON-LD for Person and WebSite */}
          <JsonLd
            id="jsonld-person"
            item={{
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Melik Musinian',
              url: 'https://melikmusinian.com',
              jobTitle: 'Full-Stack / Frontend Developer',
              sameAs: [
                'https://github.com/Melik1986',
                'https://x.com/melikmusinian',
              ],
            }}
          />
          <JsonLd
            id="jsonld-website"
            item={{
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'My Portfolio',
              url: 'https://melikmusinian.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://melikmusinian.com/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }}
          />
        </AppThemeProvider>
      </body>
    </html>
  );
}
