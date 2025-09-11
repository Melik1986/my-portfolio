import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['gsap', 'echarts', 'three'],
    // Дополнительные экспериментальные оптимизации
    optimizeCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
    // Включаем Server Actions
    serverActions: {
      bodySizeLimit: '1mb',
      allowedOrigins: [
        'localhost:3000',
        'portfolio-melik-next.vercel.app',
        ...(process.env.NEXT_PUBLIC_CUSTOM_DOMAIN
          ? [process.env.NEXT_PUBLIC_CUSTOM_DOMAIN.replace(/^https?:\/\//, '')]
          : []),
      ],
    },
  },
  // Разрешенные источники для разработки
  allowedDevOrigins: ['192.168.2.109'],
  // Turbopack настройки (стабильная версия)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      '@': './src',
    },
  },
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        bundleAnalyzer({
          enabled: true,
        }),
      );
      return config;
    },
  }),
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    // Конфигурация для внешних изображений
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: false,
    emotion: false,
  },
  // Оптимизации для продакшена
  output: 'standalone',
  poweredByHeader: false,
  // Дополнительные оптимизации
  compress: true,
  generateEtags: true,
};

export default nextConfig;
