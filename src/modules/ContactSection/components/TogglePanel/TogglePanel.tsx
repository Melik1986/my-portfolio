'use client';
import React from 'react';
import type { TogglePanelProps } from '../../types';
import styles from './TogglePanel.module.scss';
import { useI18n } from '@/i18n';

export function TogglePanel({ onToggleToClient, onToggleToCompany }: TogglePanelProps) {
  const { t } = useI18n();
  return (
    <div className={styles['toggle-box']}>
      <div className={`${styles['toggle-panel']} ${styles['toggle-panel--left']}`}>
        <h1 className={styles['toggle-panel__title']}>
          {t('section.contact.toggle.welcomeTitle')}
        </h1>
        <p className={styles['toggle-panel__text']}>{t('section.contact.toggle.welcomeText')}</p>
        <button
          type="button"
          className={`${styles['toggle-btn']} ${styles['toggle-panel__btn']}`}
          onClick={onToggleToClient}
        >
          {t('section.contact.toggle.clientForm')}
        </button>
      </div>
      <div className={`${styles['toggle-panel']} ${styles['toggle-panel--right']}`}>
        <h1 className={styles['toggle-panel__title']}>{t('section.contact.toggle.quoteTitle')}</h1>
        <p className={styles['toggle-panel__text']}>{t('section.contact.toggle.quoteText')}</p>
        <button
          type="button"
          className={`${styles['toggle-btn']} ${styles['toggle-panel__btn']}`}
          onClick={onToggleToCompany}
        >
          {t('section.contact.toggle.companyForm')}
        </button>
      </div>
    </div>
  );
}
