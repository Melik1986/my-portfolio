import React from 'react';
import { SpriteIcon } from '@/lib/ui/SpriteIcon';
import styles from './GalleryNavigation.module.scss';

interface GalleryNavigationProps {
  prevSlide: () => void;
  nextSlide: () => void;
  displayedIndex: number;
  totalItems: number;
}

export function GalleryNavigation({ prevSlide, nextSlide, displayedIndex, totalItems }: GalleryNavigationProps) {
  return (
    <div
      className={styles['gallery-arrows']}
      data-animation="fade-up"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0.3"
    >
      <button className={styles['gallery-arrows__button']} onClick={prevSlide} title="Previous slide">
        <SpriteIcon
          id="icon-arrow-left"
          className={styles['gallery-arrows__icon']}
          sprite="/images/icons/tech-icons.svg"
        />
      </button>
      <button className={styles['gallery-arrows__button']} onClick={nextSlide} title="Next slide">
        <SpriteIcon
          id="icon-arrow-right"
          className={styles['gallery-arrows__icon']}
          sprite="/images/icons/tech-icons.svg"
        />
      </button>
      <div className={styles['gallery-arrows__slide-number']}>
        {displayedIndex + 1}/{totalItems}
      </div>
    </div>
  );
}
