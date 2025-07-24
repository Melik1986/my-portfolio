'use client';

import Image from 'next/image';
import styles from './HeroImage.module.scss';

export function HeroAvatar() {
  return (
    <div className={styles['hero__image-container']}>
      <Image
        className={styles['hero__image']}
        id="avatar"
        src="/images/avatar.webp"
        alt="Melik Musinian Avatar"
        width={200}
        height={200}
        loading="eager"
        data-animation="zoom-in"
        data-duration="0.6"
        data-ease="back.out(1.7)"
        data-delay="0.3"
      />
    </div>
  );
}
