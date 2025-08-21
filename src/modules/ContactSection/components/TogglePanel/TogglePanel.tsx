'use client';
import React from 'react';
import type { TogglePanelProps } from '../../types';
import styles from './TogglePanel.module.scss';

export function TogglePanel({ onToggleToClient, onToggleToCompany }: TogglePanelProps) {
  return (
    <div className={styles['toggle-box']}>
      <div className={`${styles['toggle-panel']} ${styles['toggle-panel--left']}`}>
        <h1 className={styles['toggle-panel__title']}>Hello, Welcome!</h1>
        <p className={styles['toggle-panel__text']}>Choose the form that fits your case.</p>
        <button type="button" className={styles['toggle-btn']} onClick={onToggleToClient}>
          Client Form
        </button>
      </div>
      <div className={`${styles['toggle-panel']} ${styles['toggle-panel--right']}`}>
        <h1 className={styles['toggle-panel__title']}>Need a quote?</h1>
        <p className={styles['toggle-panel__text']}>Tell me about your project and goals.</p>
        <button type="button" className={styles['toggle-btn']} onClick={onToggleToCompany}>
          Company Form
        </button>
      </div>
    </div>
  );
}
