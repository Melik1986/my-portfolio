import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['gsap', 'echarts', 'three'],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
