import type { Metadata } from 'next';
import type { SupportedLocale } from '@/i18n';
import { tServer } from '@/i18n/server';

function buildBaseMeta(): Pick<Metadata, 'keywords' | 'authors' | 'creator' | 'publisher' | 'formatDetection' | 'metadataBase' | 'alternates'> {
  return {
    keywords: ['portfolio', 'web developer', 'React', 'Next.js', 'TypeScript', 'full-stack'],
    authors: [{ name: 'Melik Musinian' }],
    creator: 'Melik Musinian',
    publisher: 'Melik Musinian',
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL('https://melikmusinian.com'),
    alternates: { canonical: '/' },
  };
}

function buildRobots(): NonNullable<Metadata['robots']> {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

function buildOpenGraph(locale: SupportedLocale): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    locale: locale === 'ru' ? 'ru_RU' : 'en_US',
    url: 'https://melikmusinian.com',
    siteName: tServer(locale, 'seo.siteName'),
    title: tServer(locale, 'seo.title.default'),
    description: tServer(locale, 'seo.description'),
    images: [
      { url: '/images/og-image.jpg', width: 1200, height: 630, alt: tServer(locale, 'seo.og.alt') },
    ],
  };
}

function buildTwitter(locale: SupportedLocale): NonNullable<Metadata['twitter']> {
  return {
    card: 'summary_large_image',
    title: tServer(locale, 'seo.title.default'),
    description: tServer(locale, 'seo.description'),
    images: ['/images/og-image.jpg'],
    creator: '@melikmusinian',
  };
}

function buildFontsOther(): NonNullable<Metadata['other']> {
  return {
    'font-chango': '/fonts/Chango-Regular.woff2',
    'font-okinawa': '/fonts/Okinawa.woff2',
    'font-leckerli': '/fonts/LeckerliOne-Regular.woff2',
    'font-roboto': '/fonts/RobotoSerif-Regular.woff2',
    'font-poppins': '/fonts/Poppins-Regular.woff2',
  };
}

export function buildMetadataForLocale(locale: SupportedLocale): Metadata {
  return {
    title: { default: tServer(locale, 'seo.title.default'), template: tServer(locale, 'seo.title.template') },
    description: tServer(locale, 'seo.description'),
    ...buildBaseMeta(),
    robots: buildRobots(),
    openGraph: buildOpenGraph(locale),
    twitter: buildTwitter(locale),
    other: buildFontsOther(),
  };
}

