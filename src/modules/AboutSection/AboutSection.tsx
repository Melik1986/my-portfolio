'use client';

import { useAutoGsapAnimation } from '@/lib/hooks/useGsap';
import { AboutContent } from './components/AboutContent/AboutContent';
import { AboutGallery } from './components/AboutGallery/AboutGallery';

import './About.module.scss';

export function AboutSection() {
  const aboutContainerRef = useAutoGsapAnimation();

  return (
    <div ref={aboutContainerRef} className="about" id="about">
      <h2
        className="about__title"
        data-animation="fade-up"
        data-duration="0.8"
        data-ease="power2.out"
      >
        About
      </h2>
      <AboutContent />
      <AboutGallery />
    </div>
  );
}
