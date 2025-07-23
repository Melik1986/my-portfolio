'use client';

import { AboutGalleryProps } from '@/types/about.types';
import styles from './AboutGallery.module.scss';

export const AboutGallery: React.FC<AboutGalleryProps> = (props) => {
  const familyImages = [
    { src: 'images/family/family.webp', alt: 'Family photo' },
    { src: 'images/family/family1.webp', alt: 'Family photo 1' },
    { src: 'images/family/family2.webp', alt: 'Family photo 2' },
    { src: 'images/family/family3.webp', alt: 'Family photo 3' },
    { src: 'images/family/family4.webp', alt: 'Family photo 4' },
    { src: 'images/family/family5.webp', alt: 'Family photo 5' },
    { src: 'images/family/family6.webp', alt: 'Family photo 6' },
    { src: 'images/family/family7.webp', alt: 'Family photo 7' },
    { src: 'images/family/family8.webp', alt: 'Family photo 8' },
    { src: 'images/family/family9.webp', alt: 'Family photo 9' },
  ];

  return (
    <div className={styles['about__content-right']}>
      <ul className={styles['about__slider']} data-quantity={familyImages.length}>
        {familyImages.map((image, index) => (
          <li key={index} className={styles['about__slider-item']} data-position={index + 1}>
            <picture>
              <source srcSet={image.src} type="image/webp" />
              <img src={image.src} alt={image.alt} width={200} height={150} />
            </picture>
          </li>
        ))}
      </ul>
    </div>
  );
};
