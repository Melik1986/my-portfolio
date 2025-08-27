'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import styles from './ThemeToggle.module.scss';
import { useI18n } from '@/i18n';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = theme ?? resolvedTheme;
  const { t } = useI18n();

  return (
    <button
      type="button"
      aria-label={t('a11y.toggleTheme')}
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className={styles.themeToggle}
    >
      {current === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    </button>
  );
}

export default ThemeToggle;
