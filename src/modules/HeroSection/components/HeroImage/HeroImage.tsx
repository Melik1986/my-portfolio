'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import styles from './HeroImage.module.scss';
import { useI18n } from '@/i18n';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { HERO_AVATAR_IMAGES } from '../../constants/images';

export function HeroAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const image = isMobile ? HERO_AVATAR_IMAGES.mobile : HERO_AVATAR_IMAGES.desktop;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isMobile) return;
    const tl = createElementTimeline(el);
    const start = () => tl.play();
    const preloaderRoot = document.querySelector('[data-preloader-root]');
    if (preloaderRoot) {
      document.addEventListener('preloader:complete', start as EventListener, { once: true });
    } else {
      start();
    }
    return () => {
      document.removeEventListener('preloader:complete', start as EventListener);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className={styles['hero__image-container']}>
      <Image
        className={styles['hero__image']}
        id="avatar"
        src={image.src}
        alt={t('section.hero.avatarAlt')}
        width={image.width}
        height={image.height}
        sizes={isMobile ? '100vw' : '20vw'}
        priority
        data-animation="zoom-in"
        data-duration="1.8"
        data-ease="back.out(1.7)"
        data-delay="0"
      />
    </div>
  );
}
