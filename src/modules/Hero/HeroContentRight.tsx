'use client';

import { useRef } from 'react';
import { useGsapAnimation } from './hooks/useGsapAnimation';
import { HeroContentRightProps } from '@/types/hero.types';
import { SpriteIcon } from '../../ui/SpriteIcon/SpriteIcon';

export const HeroContentRight = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const brushRef = useRef<SVGSVGElement>(null);

  const headingData = {
    animation: 'slide-right',
    duration: '0.8',
    ease: 'power2.out',
    groupDelay: '0.25',
  };

  const spanData = {
    animation: 'slide-right',
    duration: '0.9',
    ease: 'power2.out',
    groupDelay: '0.45',
  };

  const brushData = {
    animation: 'svg-draw',
    duration: '1.0',
    ease: 'power2.out',
    groupDelay: '0.55',
  };

  useGsapAnimation(headingRef as React.RefObject<Element>, headingData);
  useGsapAnimation(spanRef as React.RefObject<Element>, spanData);
  useGsapAnimation(brushRef as React.RefObject<Element>, brushData);

  return (
    <div className="hero__content hero__content--right">
      <h2 className="hero__heading" ref={headingRef}>
        Frontend development
      </h2>
      <span className="hero__paragraph">
        <span ref={spanRef}>and Web Design</span>
        <SpriteIcon id="brush" className="hero__brush" />
      </span>
    </div>
  );
};
