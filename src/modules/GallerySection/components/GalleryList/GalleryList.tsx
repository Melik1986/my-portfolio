import React, { useMemo } from 'react';
import { type GalleryItem } from '../../types/gallery';
import styles from '../../GallerySection.module.scss';

interface GalleryListProps {
  itemsToRender: GalleryItem[];
  listRef: React.RefObject<HTMLUListElement | null>;
}

export function GalleryList({ itemsToRender, listRef }: GalleryListProps) {
  const modifierClassMap: Record<string, string> = {
    sunrise: styles['gallery__item--sunrise'],
    rocky: styles['gallery__item--rocky'],
    forest: styles['gallery__item--forest'],
    meadow: styles['gallery__item--meadow'],
    lake: styles['gallery__item--lake'],
    clouds: styles['gallery__item--clouds'],
    riverbank: styles['gallery__item--riverbank'],
    ridges: styles['gallery__item--ridges'],
    cliffs: styles['gallery__item--cliffs'],
    valley: styles['gallery__item--valley'],
  };

  const memoizedList = useMemo(
    () => (
      <ul ref={listRef} className={styles.gallery__list}>
        {itemsToRender.map(({ className, title, name, description }: GalleryItem, index) => (
          <li
            key={`${className}-${index}`}
            className={`${styles.gallery__item} ${modifierClassMap[className] ?? ''}`}
          >
            <div className={styles.gallery__content}>
              <div className={styles.gallery__title} data-item={index + 1}>{title}</div>
              <div className={styles.gallery__name}>{name}</div>
              <div className={styles.gallery__des}>{description}</div>
            </div>
          </li>
        ))}
      </ul>
    ),
    [itemsToRender, listRef],
  );

  return memoizedList;
}
