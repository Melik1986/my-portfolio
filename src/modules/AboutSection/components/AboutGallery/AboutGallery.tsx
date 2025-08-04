'use client';

import styles from './AboutGallery.module.scss';
import Image from 'next/image';

/**
 * Массив изображений семьи для галереи
 * Содержит пути к изображениям и alt тексты
 */
const familyImages = [
  { src: '/images/family/family.webp', alt: 'Family photo' },
  { src: '/images/family/family1.webp', alt: 'Family photo 1' },
  { src: '/images/family/family2.webp', alt: 'Family photo 2' },
  { src: '/images/family/family3.webp', alt: 'Family photo 3' },
  { src: '/images/family/family4.webp', alt: 'Family photo 4' },
  { src: '/images/family/family5.webp', alt: 'Family photo 5' },
  { src: '/images/family/family6.webp', alt: 'Family photo 6' },
  { src: '/images/family/family7.webp', alt: 'Family photo 7' },
  { src: '/images/family/family8.webp', alt: 'Family photo 8' },
  { src: '/images/family/family9.webp', alt: 'Family photo 9' },
];

/**
 * Галерея изображений семьи с 3D анимацией
 * Отображает вращающуюся карусель с семейными фото
 */
export function AboutGallery() {
  return (
    <div
      className={styles['about__gallery']}
      data-animation="fade-up"
      data-duration="0.8"
      data-stagger="0.1"
      data-ease="power2.out"
      data-delay="0.6"
    >
      {familyImages.map((image, index) => (
        <Image
          key={index}
          src={image.src}
          alt={image.alt}
          className={styles['about__gallery-image']}
          width={200}
          height={150}
        />
      ))}
    </div>
  );
}
