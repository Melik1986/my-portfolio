import React from 'react';
import styles from './Btn.module.scss';
import { ContactButtonProps } from '@/lib/types/btn.types';
import { t } from '@/i18n';

/**
 * SVG иконка для кнопки контакта
 * Рендерит SVG элемент с путями для стилизации
 */
function ContactIcon({ iconClassName }: { iconClassName: string }) {
  return (
    <svg
      className={`${styles.btn__icon} ${iconClassName}`.trim()}
      viewBox="0 0 173.8 48.2"
      aria-hidden="true"
    >
      <path
        className={styles.btn__icon_path}
        d="M151,45H24C12.7,45,3.5,35.8,3.5,24.5v0C3.5,13.2,12.7,4,24,4h127c11.3,0,20.5,9.2,20.5,20.5v0 C171.5,35.8,162.2,45,151,45z"
      />
    </svg>
  );
}

/**
 * Кнопка контакта с анимацией
 * Отображает кнопку с SVG иконкой и текстом для связи
 */
export function ContactButton({
  className = '',
  iconClassName = '',
  children,
  ...rest
}: ContactButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.header__btn} ${className}`.trim()}
      aria-label={t('header.contactMe')}
      data-target="#contact-section"
      translate="no"
      {...rest}
    >
      <ContactIcon iconClassName={iconClassName} />
      {children ?? t('header.contactMe')}
    </button>
  );
}
