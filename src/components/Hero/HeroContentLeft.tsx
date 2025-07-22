'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGsapAnimation } from './hooks/useGsapAnimation';

export const HeroContentLeft = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const data = {
    animation: 'slide-left',
    duration: '0.7',
    ease: 'power2.out',
    groupDelay: '0.2',
  };

  useGsapAnimation(containerRef, data);

  return (
    <div className="hero__content hero__content--left">
      <div className="hero__container-img" ref={containerRef}>
        <Image
          className="hero__image"
          id="melik"
          src="/images/melik.svg"
          alt="Melik"
          width={100}
          height={100}
          loading="eager"
        />
        <Image
          className="hero__image"
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
