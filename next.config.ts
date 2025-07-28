import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['gsap', 'echarts', 'three'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Дополнительные оптимизации
    resolveAlias: {
      '@': './src',
    },
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Оптимизации для продакшена
  output: 'standalone',
  poweredByHeader: false,
};

export default nextConfig;
