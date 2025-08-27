'use client';

import React, { type JSX } from 'react';
import { SpriteIcon } from '@/lib/ui';
import { useLoaderAnimation } from '@/lib/hooks/useLoaderAnimation';
import styles from './Loader.module.scss';

const SPRITE_PATH = '/preloader-icons/sprite-preloader.svg';

type IconDef = { name: string; width: number; height: number };

const COMPANY_ICONS: ReadonlyArray<IconDef> = [
  { name: 'icon-alcon', width: 96, height: 140 },
  { name: 'icon-sminex', width: 163, height: 38 },
  { name: 'icon-aeon', width: 94, height: 100 },
  { name: 'icon-coldy', width: 168, height: 28 },
  { name: 'icon-cutu', width: 156, height: 100 },
  { name: 'icon-etalon', width: 143, height: 26 },
  { name: 'icon-wafi', width: 232, height: 32 },
  { name: 'icon-forma', width: 138, height: 40 },
  { name: 'icon-galc', width: 132, height: 40 },
  { name: 'icon-veren', width: 155, height: 54 },
  { name: 'icon-ingrad', width: 149, height: 74 },
  { name: 'icon-snegiri', width: 189, height: 48 },
];

function PreloaderContent(): JSX.Element {
  return (
    <div className={styles['preloader__wrapper']}>
      <div className={styles['preloader__content']}>
        <SpriteIcon name="logo" width={160} height={160} className={styles['preloader__logo']} />
        {COMPANY_ICONS.map(({ name, width, height }) => (
          <SpriteIcon
            key={name}
            className={styles['preloader__company-icon']}
            name={name}
            sprite={SPRITE_PATH}
            width={width}
            height={height}
            aria-hidden
          />
        ))}
        <div className={styles['preloader__progress']}>
          <div className={styles['preloader__progress-bar']} data-preloader-progress />
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент прелоадера. Повторяет исходную HTML-структуру, классы и размеры.
 * Вся визуальная логика — в SCSS. Здесь только доступность и структура.
 */
export function Loader() {
  const { isHidden, containerProps } = useLoaderAnimation();

  if (isHidden) {
    return null;
  }

  return (
    <div className={styles.preloader} {...containerProps}>
      <PreloaderContent />
    </div>
  );
}
