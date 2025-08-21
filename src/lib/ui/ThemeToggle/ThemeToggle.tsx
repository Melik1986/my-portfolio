'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = theme ?? resolvedTheme;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className={styles.themeToggle}
    >
      {current === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}

export default ThemeToggle;
