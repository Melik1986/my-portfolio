'use client';

import { useRef } from 'react';
import { useGsapAnimation } from './hooks/useGsapAnimation';

export const HeroLetters = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const data = {
    animation: 'slide-down',
    duration: '0.8',
    stagger: '0.1',
    ease: 'power2.out',
    groupDelay: '0.66',
  };

  useGsapAnimation(containerRef, data);

  return (
    <div className="hero__container-letters" ref={containerRef}>
      <span className="hero__text" data-title="P">
        P
      </span>
      <span className="hero__text" data-title="O">
        O
      </span>
      <span className="hero__text" data-title="R">
        R
      </span>
      <span className="hero__text" data-title="T">
        T
      </span>
      <span className="hero__text" data-title="F">
        F
      </span>
      <span className="hero__text" data-title="O">
        O
      </span>
      <span className="hero__text" data-title="L">
        L
      </span>
      <span className="hero__text" data-title="I">
        I
      </span>
      <span className="hero__text" data-title="O">
        O
      </span>
    </div>
  );
};
