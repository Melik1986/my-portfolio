'use client';

import { useRef } from 'react';
import { useGsapAnimation } from '@/modules/HeroSection/hooks/useGsapAnimation';
import { HeroContentRightProps } from '@/types/hero.types';
import { SpriteIcon } from '@/ui/SpriteIcon/SpriteIcon';
import styles from './HeroContentRight.module.scss';

const headingData = {
  animation: 'slide-right',
  duration: '0.8',
  ease: 'power2.out',
  groupDelay: '0.25',
};
const headingAnimation = {
  'data-animation': headingData.animation,
  'data-duration': headingData.duration,
  'data-ease': headingData.ease,
  'data-delay': headingData.groupDelay,
};
const spanData = {
  animation: 'slide-right',
  duration: '0.9',
  ease: 'power2.out',
  groupDelay: '0.45',
};
const spanAnimation = {
  'data-animation': spanData.animation,
  'data-duration': spanData.duration,
  'data-ease': spanData.ease,
  'data-delay': spanData.groupDelay,
};
const brushData = {
  animation: 'svg-draw',
  duration: '1.0',
  ease: 'power2.out',
  groupDelay: '0.55',
};
const brushAnimation = {
  'data-animation': brushData.animation,
  'data-duration': brushData.duration,
  'data-ease': brushData.ease,
  'data-delay': brushData.groupDelay,
};

export const HeroContentRight: React.FC<HeroContentRightProps> = (props) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const brushRef = useRef<SVGSVGElement>(null);

  useGsapAnimation(headingRef as React.RefObject<Element>, headingData);
  useGsapAnimation(spanRef as React.RefObject<Element>, spanData);
  useGsapAnimation(brushRef as React.RefObject<Element>, brushData);

  return (
    <div className={styles['hero__content-right']}>
      <h2 className={styles['hero__heading']} ref={headingRef} {...headingAnimation}>
        Frontend development
      </h2>
      <span className={styles['hero__paragraph']} {...spanAnimation}>
        <span ref={spanRef}>and Web Design</span>
        <SpriteIcon
          id="brush"
          className={styles['hero__brush']}
          {...brushAnimation}
          ref={brushRef}
        />
      </span>
    </div>
  );
};
