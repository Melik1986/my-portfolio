import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['gsap', 'echarts', 'three'],
    // Дополнительные экспериментальные оптимизации
    optimizeCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },
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
        new (require('@next/bundle-analyzer')())({
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
    // Добавить для внешних изображений (если появятся)
    domains: ['example.com'],
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
