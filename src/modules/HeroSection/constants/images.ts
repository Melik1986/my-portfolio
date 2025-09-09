import type { HeroAvatarImages } from '../types/images';

export const HERO_AVATAR_IMAGES: HeroAvatarImages = {
  desktop: {
    src: '/images/banner_desktop.webp',
    width: 1920,
    height: 1080,
    alt: 'Портрет для десктопа',
  },
  mobile: {
    src: '/images/banner_mobile.webp',
    width: 1080,
    height: 1920,
    alt: 'Портрет для мобильных устройств',
  },
  retina: {
    src: '/images/banner_retina.webp',
    width: 3840,
    height: 2160,
    alt: 'Портрет для ретина экранов',
  },
  ultrawide: {
    src: '/images/banner_ultrawide.webp',
    width: 2560,
    height: 1440,
    alt: 'Портрет для ультраширокие мониторов',
  },
};
