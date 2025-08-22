import React from 'react';
import styles from './GalleryList.module.scss';

interface GalleryItem {
  id: string;
  modifier?: string;
  title: string;
  name: string;
  description: string;
}

interface GalleryListProps {
  items: GalleryItem[];
}

export function GalleryList({ items }: GalleryListProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= 767);
    handle();
    window.addEventListener('resize', handle, { passive: true });
    return () => window.removeEventListener('resize', handle);
  }, []);

  const visibleItems = React.useMemo(() => {
    // keep full-width first two always, then at mobile keep only first 3 small ones
    if (!items) return [];
    const firstTwo = items.slice(0, 2);
    const rest = items.slice(2);
    const small = isMobile ? rest.slice(0, 3) : rest;
    return [...firstTwo, ...small];
  }, [items, isMobile]);

  return (
    <ul className={styles['gallery-list']}>
      {visibleItems.map((item, index) => {
        const isFull = index < 2;
        const className = [
          styles['gallery-item'],
          item.modifier ? styles[`gallery-item--${item.modifier}`] : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li key={item.id} className={className}>
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
