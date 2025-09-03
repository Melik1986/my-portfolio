'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import styles from './HeroImage.module.scss';
import { useI18n } from '@/i18n';

export function HeroAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // На мобильных устройствах не создаем отдельный timeline
    const isMobile = window.innerWidth <= 768;
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
  }, []);

  return (
    <div ref={containerRef} className={styles['hero__image-container']}>
      <Image
        className={styles['hero__image']}
        id="avatar"
        src="/images/avatar.png"
        alt={t('section.hero.avatarAlt')}
        width={4096}
        height={2989}
        sizes="(max-width: 768px) 100vw, 20vw"
        priority
        data-animation="zoom-in"
        data-duration="1.8"
        data-ease="back.out(1.7)"
        data-delay="0"
      />
    </div>
  );
}
