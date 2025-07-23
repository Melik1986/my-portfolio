'use client';

import { HeroLetters } from './components/HeroLetters/HeroLetters';
import { HeroAvatar } from './components/HeroImage/HeroImage';
import { HeroContentLeft } from './components/HeroContentLeft/HeroContentLeft';
import { HeroContentRight } from './components/HeroContentRight/HeroContentRight';
import './HeroSection.module.scss';

export const HeroSection = () => {
  return (
    <div className="hero" id="hero">
      <h2 className="hero__title">Hello, I'm</h2>
      <HeroLetters />
      <HeroAvatar />
      <HeroContentLeft />
      <HeroContentRight />
    </div>
  );
};
