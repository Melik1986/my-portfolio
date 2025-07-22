'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGsapAnimation } from './hooks/useGsapAnimation';

export const HeroAvatar = () => {
  const imgRef = useRef<HTMLImageElement>(null);

  const data = {
    animation: 'zoom-in',
    duration: '0.6',
    ease: 'back.out(1.7)',
    groupDelay: '0.3',
  };

  useGsapAnimation(imgRef, data);

  return (
    <div className="hero__avatar-container">
      <Image
        ref={imgRef}
        className="hero__image"
        id="avatar"
        src="/images/avatar.webp"
        alt="Melik Musinian Avatar"
        width={200}
        height={200}
        loading="eager"
      />
    </div>
  );
};
