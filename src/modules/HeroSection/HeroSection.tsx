'use client';

import { useAutoGsapAnimation } from '@/lib/hooks/useGsap';
import { HeroLetters } from './components/HeroLetters/HeroLetters';
import { HeroAvatar } from './components/HeroImage/HeroImage';
import { HeroContentLeft } from './components/HeroContentLeft/HeroContentLeft';
import { HeroContentRight } from './components/HeroContentRight/HeroContentRight';
import './HeroSection.module.scss';

export function HeroSection() {
  const heroContainerRef = useAutoGsapAnimation();

  return (
    <div ref={heroContainerRef} className="hero" id="hero">
      <h2
        className="hero__title"
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
