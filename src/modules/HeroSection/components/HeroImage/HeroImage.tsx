'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
import styles from './HeroImage.module.scss';

export function HeroAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      createElementTimeline(containerRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className={styles['hero__image-container']}>
      <Image
        className={styles['hero__image']}
        id="avatar"
        src="/images/avatar.webp"
        alt="Melik Musinian Avatar"
        width={200}
        height={200}
        priority
        data-animation="zoom-in"
        data-duration="0.8"
        data-ease="back.out(1.7)"
        data-delay="0.3"
      />
    </div>
  );
}
