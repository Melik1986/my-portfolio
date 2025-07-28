'use client';

import Image from 'next/image';

import styles from './HeroContentLeft.module.scss';
import { useGsap } from '@/lib/hooks/useGsap';

function HeroImage({ id, src, alt }: { id: string; src: string; alt: string }) {
  const { containerRef } = useGsap({});

  return (
    <Image
      className={styles['hero__image']}
      id={id}
      src={src}
      alt={alt}
      width={100}
      height={100}
      loading="eager"
    />
  );
}

export function HeroContentLeft() {
  return (
    <div className={styles['hero__content-left']}>
      <div
        className={styles['hero__container-img']}
        data-animation="slide-left"
        data-duration="0.7"
        data-ease="power2.out"
        data-delay="0.2"
      >
        <HeroImage id="melik" src="/images/melik.svg" alt="Melik" />
        <HeroImage id="musinian" src="/images/musinian.svg" alt="Musinian" />
      </div>
    </div>
  );
}
