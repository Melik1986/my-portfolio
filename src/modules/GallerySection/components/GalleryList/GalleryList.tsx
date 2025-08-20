import React, { useMemo } from 'react';
import { type GalleryItem } from '../../types/gallery';
import styles from '../../GallerySection.module.scss';

interface GalleryListProps {
  itemsToRender: GalleryItem[];
  listRef: React.RefObject<HTMLUListElement | null>;
}

export function GalleryList({ itemsToRender, listRef }: GalleryListProps) {
  const memoizedList = useMemo(
    () => (
      <ul ref={listRef} className={styles.gallery__list}>
        {itemsToRender.map(({ className, title, name, description }: GalleryItem, index) => (
          <li
            key={`${className}-${index}`}
            className={`${styles.gallery__item} ${styles['gallery__item--' + className]}`}
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
