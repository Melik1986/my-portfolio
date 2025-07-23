'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGsapAnimation } from '@/modules/HeroSection/hooks/useGsapAnimation';
import { HeroImageProps } from '@/types/hero.types';
import styles from './HeroImage.module.scss';

const imageData = {
  animation: 'zoom-in',
  duration: '0.6',
  ease: 'back.out(1.7)',
  groupDelay: '0.3',
};
const imageAnimation = {
  'data-animation': imageData.animation,
  'data-duration': imageData.duration,
  'data-ease': imageData.ease,
  'data-delay': imageData.groupDelay,
};

export const HeroAvatar: React.FC<HeroImageProps> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useGsapAnimation(imgRef as React.RefObject<Element>, imageData);

  return (
    <div className={styles['hero__image-container']}>
      <Image
        ref={imgRef}
        className={styles['hero__image']}
        id="avatar"
        src="/images/avatar.webp"
        alt="Melik Musinian Avatar"
        width={200}
        height={200}
        loading="eager"
        {...imageAnimation}
      />
    </div>
  );
};
