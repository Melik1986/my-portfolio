'use client';

import styles from './AboutGallery.module.scss';
import { useGsap } from '@/lib/gsap/hooks/useGsap';

/**
 * Массив изображений семьи для галереи
 * Содержит пути к изображениям и alt тексты
 */
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

/**
 * Компонент элемента галереи
 * Рендерит изображение с оптимизацией для webp
 */
function GalleryItem({ image, index }: { image: { src: string; alt: string }; index: number }) {
  return (
    <li
      className={styles['about__slider-item']}
      style={{ '--position': index + 1 } as React.CSSProperties}
    >
      <picture>
        <source srcSet={image.src} type="image/webp" />
        <img src={image.src} alt={image.alt} width={200} height={150} />
      </picture>
    </li>
  );
}

/**
 * Галерея изображений семьи с 3D анимацией
 * Отображает вращающуюся карусель с семейными фото
 */
export function AboutGallery() {
  const { containerRef } = useGsap({});

  return (
    <>
      <ul
        ref={containerRef as React.Ref<HTMLUListElement>}
        className={styles['about__slider']}
        style={{ '--quantity': familyImages.length } as React.CSSProperties}
      >
        {familyImages.map((image, index) => (
          <GalleryItem key={index} image={image} index={index} />
        ))}
      </ul>
    </>
  );
}
