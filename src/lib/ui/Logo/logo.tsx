import React from 'react';
import { SpriteIcon } from '@/lib/ui/SpriteIcon';
import { LogoProps } from '@/lib/types/logo.types';
import styles from './logo.module.scss';

/**
 * SVG иконка логотипа
 * Рендерит логотип через SpriteIcon компонент
 */
function LogoIcon({ iconClassName }: { iconClassName: string }) {
  return (
    <SpriteIcon
      id="logo"
      className={`${styles.logo__icon} ${iconClassName}`.trim()}
      width={50}
      height={50}
      aria-label="Logo"
    />
  );
}

/**
 * Компонент логотипа с анимацией
 * Отображает кликабельный логотип с переходом на главную
 */
export function Logo({ className = '', iconClassName = '', ...rest }: LogoProps) {
  return (
    <a
      href="#header"
      className={`${styles.logo__link} ${className}`.trim()}
      data-animation="slide-left"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0"
      {...rest}
    >
      <LogoIcon iconClassName={iconClassName} />
    </a>
  );
}
