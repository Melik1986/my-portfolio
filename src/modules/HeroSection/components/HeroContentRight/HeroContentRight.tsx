'use client';

import { SpriteIcon } from '@/lib/ui';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import styles from './HeroContentRight.module.scss';

function HeroHeading() {
  const containerRef = useRef<HTMLHeadingElement>(null);

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
    <h2
      ref={containerRef}
      className={styles['hero__heading']}
      data-animation="slide-right"
      data-duration="1.4"
      data-ease="power2.out"
      data-delay="0.8"
      translate="no"
    >
      Frontend development
    </h2>
  );
}

function HeroParagraph() {
  const containerRef = useRef<HTMLSpanElement>(null);

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
    <span ref={containerRef} className={styles['hero__paragraph']}>
      <HeroParagraphContent />
    </span>
  );
}

function HeroParagraphContent() {
  return (
    <>
      <span
        data-animation="slide-right"
        data-duration="1.2"
        data-ease="power2.out"
        data-delay="0.8"
        translate="no"
      >
        and Web Design
      </span>
      <span
        className={styles['hero__brush-container']}
        data-animation="fade-up"
        data-duration="1.2"
        data-ease="power2.out"
        data-delay="1.2"
      >
        <SpriteIcon id="brush" className={styles['hero__brush']} />
      </span>
    </>
  );
}

export function HeroContentRight() {
  return (
    <>
      <HeroHeading />
      <HeroParagraph />
    </>
  );
}
