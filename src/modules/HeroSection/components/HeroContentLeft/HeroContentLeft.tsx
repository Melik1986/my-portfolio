'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import styles from './HeroContentLeft.module.scss';
import { useI18n } from '@/i18n';

function HeroImage({ id, src, alt }: { id: string; src: string; alt: string }) {
  return (
    <Image
      className={`${styles['hero__image']} ${styles[`hero__image--${id}`]}`}
      id={id}
      src={src}
      alt={alt}
      width={100}
      height={100}
      loading="eager"
      unoptimized={src.endsWith('.svg')}
    />
  );
}

export function HeroContentLeft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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
    <>
      <div
        ref={containerRef}
        className={styles['hero__container-img']}
        data-animation="slide-left"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0.4"
      >
        <HeroImage id="melik" src="/images/melik.svg" alt={t('section.hero.melikAlt')} />
        <HeroImage id="musinian" src="/images/musinian.svg" alt={t('section.hero.musinianAlt')} />
      </div>
    </>
  );
}
