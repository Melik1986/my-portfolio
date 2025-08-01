'use client';

import { type GalleryItem } from './types/gallery';
import { useCarousel } from './hooks/useCarousel';
import { SpriteIcon } from '@/lib/ui/SpriteIcon';
import styles from './GallerySection.module.scss';

export function GallerySection() {
  const { itemsToRender, prevSlide, nextSlide, displayedIndex, progressRef, totalItems } =
    useCarousel();

  return (
    <div className={styles.gallery} id="gallery">
      <h2 className={`${styles.gallery__title} visually-hidden`}>My Portfolio</h2>
      <div className={styles.gallery__carousel}>
        <ul className={styles.gallery__list}>
          {itemsToRender.map(({ className, title, name, description }: GalleryItem, index) => (
            <li
              key={`${className}-${index}`}
              className={`${styles.gallery__item} ${styles[`gallery__item--${className}`]}`}
            >
              <div className={styles.gallery__content}>
                <div className={styles.gallery__title}>{title}</div>
                <div className={styles.gallery__name}>{name}</div>
                <div className={styles.gallery__des}>{description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.gallery__arrows}>
        <button className={styles.gallery__prev} onClick={prevSlide} title="Previous slide">
          <SpriteIcon
            id="arrow-left"
            name="icon-arrow-left"
            className={styles.gallery__arrowIcon}
            sprite="/images/icons/tech-icons.svg"
          />
        </button>
        <button className={styles.gallery__next} onClick={nextSlide} title="Next slide">
          <SpriteIcon
            id="arrow-right"
            name="icon-arrow-right"
            className={styles.gallery__arrowIcon}
            sprite="/images/icons/tech-icons.svg"
          />
        </button>
        <div className={styles.gallery__slideNumber}>
          {displayedIndex + 1}/{totalItems}
        </div>
      </div>
      <div className={styles.gallery__timeRunning} ref={progressRef} />
    </div>
  );
}
