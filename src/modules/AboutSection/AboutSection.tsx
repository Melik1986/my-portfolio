'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import { AboutContent, AboutGallery } from './components/index';
import './About.module.scss';

/**
 * Секция "Обо мне" с анимацией
 * Содержит информацию о разработчике с Aurora анимацией
 */
export function AboutSection() {
  const { containerRef } = useGsap({});

  return (
    <div ref={containerRef} className="about" id="about">
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
