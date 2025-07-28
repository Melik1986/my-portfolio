'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import { HeroLetters, HeroAvatar } from './components/index';
import { HeroContentLeft, HeroContentRight } from './components/index';
import styles from './HeroSection.module.scss';
import '@/styles/_visually-hidden.scss';

export function HeroSection() {
  const { containerRef } = useGsap({});

  return (
    <div ref={containerRef} className={styles.hero} id="hero">
      <h2
        className={`${styles.hero__title} visually-hidden`}
        data-animation="slide-down"
        data-duration="0.8"
        data-ease="power2.out"
      >
        Hi, I&apos;m
      </h2>
      <HeroLetters />
      <HeroAvatar />
      <HeroContentLeft />
      <HeroContentRight />
    </div>
  );
}
