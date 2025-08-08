'use client';

import { SpriteIcon } from '@/lib/ui/SpriteIcon/SpriteIcon';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
import styles from './HeroContentRight.module.scss';

function HeroHeading() {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      createElementTimeline(containerRef.current);
    }
  }, []);

  return (
    <h2
      ref={containerRef}
      className={styles['hero__heading']}
      data-animation="slide-right"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="2.1"
    >
      Frontend development
    </h2>
  );
}

function HeroParagraph() {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      createElementTimeline(containerRef.current);
    }
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
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="2.1"
      >
        and Web Design
      </span>
      <span
        className={styles['hero__brush-container']}
        data-animation="fade-up"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="2.1"
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
