'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGsapAnimation } from '@/modules/HeroSection/hooks/useGsapAnimation';
import { HeroContentLeftProps } from '@/types/hero.types';
import styles from './HeroContentLeft.module.scss';

const containerData = {
  animation: 'slide-left',
  duration: '0.7',
  ease: 'power2.out',
  groupDelay: '0.2',
};
const containerAnimation = {
  'data-animation': containerData.animation,
  'data-duration': containerData.duration,
  'data-ease': containerData.ease,
  'data-delay': containerData.groupDelay,
};

export const HeroContentLeft: React.FC<HeroContentLeftProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapAnimation(containerRef as React.RefObject<Element>, containerData);

  return (
    <div className={styles['hero__content-left']}>
      <div className={styles['hero__container-img']} ref={containerRef} {...containerAnimation}>
        <Image
          className={styles['hero__image']}
          id="melik"
          src="/images/melik.svg"
          alt="Melik"
          width={100}
          height={100}
          loading="eager"
        />
        <Image
          className={styles['hero__image']}
          id="musinian"
          src="/images/musinian.svg"
          alt="Musinian"
          width={100}
          height={100}
          loading="eager"
        />
      </div>
    </div>
  );
};
