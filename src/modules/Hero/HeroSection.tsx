'use client';

import { HeroLetters } from './HeroLetters';
import { HeroAvatar } from './HeroAvatar';
import { HeroContentLeft } from './HeroContentLeft';
import { HeroContentRight } from './HeroContentRight';
import { HeroSectionProps } from '@/types/hero.types';

export const HeroSection = () => {
  return (
    <div className="hero" id="hero">
      <HeroLetters />
      <HeroAvatar />
      <HeroContentLeft />
      <HeroContentRight />
    </div>
  );
};
