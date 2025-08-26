'use client';

import { useDeferredValue } from 'react';
import { useCarousel } from './hooks/useCarousel';
import styles from './GallerySection.module.scss';
import { GalleryList, GalleryNavigation } from './components';
import { useI18n } from '@/i18n';

export function GallerySection() {
  const { t } = useI18n();
  const {
    itemsToRender,
    prevSlide,
    nextSlide,
    displayedIndex,
    progressRef,
    totalItems,
    carouselRef,
    listRef,
  } = useCarousel();

  const deferredItemsToRender = useDeferredValue(itemsToRender);

  return (
    <section ref={carouselRef} className={styles.gallery} id="gallery" data-group-delay="7.5">
      <h2 className="visually-hidden">{t('gallery.title')}</h2>
      <div
        className={styles.gallery__carousel}
        data-animation="fade-up"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0"
      >
        <GalleryList itemsToRender={deferredItemsToRender} listRef={listRef} />
      </div>
      <GalleryNavigation
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        displayedIndex={displayedIndex}
        totalItems={totalItems}
      />
      <div
        className={styles.gallery__timeRunning}
        ref={progressRef}
        data-animation="fade-up"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.6"
      />
    </section>
  );
}
