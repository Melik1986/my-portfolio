import React from 'react';
import { SpriteIcon } from '@/lib/ui';
import { LogoProps } from '@/lib/types/logo.types';
import styles from './logo.module.scss';
import { t } from '@/i18n';

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
      aria-label={t('a11y.logo')}
    />
  );
}

/**
 * Компонент логотипа с анимацией
 * Отображает кликабельный логотип с переходом на главную
 */
export function Logo({ className = '', iconClassName = '', ...rest }: LogoProps) {
  return (
    <a href="#header" className={`${styles.logo__link} ${className}`.trim()} {...rest}>
      <LogoIcon iconClassName={iconClassName} />
    </a>
  );
}
