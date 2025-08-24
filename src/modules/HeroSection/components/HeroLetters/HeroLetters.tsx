'use client';

import styles from './HeroLetters.module.scss';
import React, { useRef, useEffect, useDeferredValue, useMemo } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';

function Letter({ letter }: { letter: string }) {
  return (
    <span className={styles['hero__text']} data-title={letter}>
      {letter}
    </span>
  );
}

export function HeroLetters() {
  const containerRef = useRef<HTMLDivElement>(null);

  const letters = useMemo(() => ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'], []);
  const deferredLetters = useDeferredValue(letters);

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
  }, [deferredLetters]); // зависимость от deferred значения

  return (
    <div
      ref={containerRef}
      className={styles['hero__container-letters']}
      data-animation="slide-down"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0"
      data-stagger="0.08"
    >
      {deferredLetters.map((letter, index) => (
        <Letter key={index} letter={letter} />
      ))}
    </div>
  );
}
