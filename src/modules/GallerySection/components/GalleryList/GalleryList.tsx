import React from 'react';
import styles from './GalleryList.module.scss';
import type { GalleryItem } from '../../types/gallery';

interface GalleryListProps {
  itemsToRender: GalleryItem[];
  listRef: React.RefObject<HTMLUListElement | null>;
}

export function GalleryList({ itemsToRender, listRef }: GalleryListProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= 767);
    handle();
    window.addEventListener('resize', handle, { passive: true });
    return () => window.removeEventListener('resize', handle);
  }, []);

  const visibleItems = React.useMemo(() => {
    // keep full-width first two always, then at mobile keep only first 3 small ones
    if (!itemsToRender) return [];
    const firstTwo = itemsToRender.slice(0, 2);
    const rest = itemsToRender.slice(2);
    const small = isMobile ? rest.slice(0, 3) : rest;
    return [...firstTwo, ...small];
  }, [itemsToRender, isMobile]);

  return (
    <ul ref={listRef} className={styles['gallery-list']}>
      {visibleItems.map((item, index) => {
        const className = [
          styles['gallery-item'],
          item.className ? styles[`gallery-item--${item.className}`] : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li key={`${item.className}-${index}`} className={className}>
            <div className={styles['gallery-item__content']}>
              <h3 className={styles['gallery-item__title']}>{item.title}</h3>
              <p className={styles['gallery-item__name']}>{item.name}</p>
              <p className={styles['gallery-item__des']}>{item.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
