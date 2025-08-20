import React, { useMemo } from 'react';
import { type GalleryItem, type GalleryClassName } from '../../types/gallery';
import styles from './GalleryList.module.scss';

interface GalleryListProps {
  itemsToRender: GalleryItem[];
  listRef: React.RefObject<HTMLUListElement | null>;
}

export function GalleryList({ itemsToRender, listRef }: GalleryListProps) {
  const modifierClassMap = useMemo((): Record<GalleryClassName, string> => ({
    sunrise: styles['gallery-item--sunrise'],
    rocky: styles['gallery-item--rocky'],
    forest: styles['gallery-item--forest'],
    meadow: styles['gallery-item--meadow'],
    lake: styles['gallery-item--lake'],
    clouds: styles['gallery-item--clouds'],
    riverbank: styles['gallery-item--riverbank'],
    ridges: styles['gallery-item--ridges'],
    cliffs: styles['gallery-item--cliffs'],
    valley: styles['gallery-item--valley'],
  }), []);

  const memoizedList = useMemo(
    () => (
      <ul ref={listRef} className={styles['gallery-list']}>
        {itemsToRender.map(({ className, title, name, description }: GalleryItem, index) => (
          <li
            key={`${className}-${index}`}
            className={`${styles['gallery-item']} ${modifierClassMap[className] ?? ''}`}
          >
            <div className={styles['gallery-item__content']}>
              <div className={styles['gallery-item__title']} data-item={index + 1}>{title}</div>
              <div className={styles['gallery-item__name']}>{name}</div>
              <div className={styles['gallery-item__des']}>{description}</div>
            </div>
          </li>
        ))}
      </ul>
    ),
    [itemsToRender, listRef, modifierClassMap],
  );

  return memoizedList;
}
