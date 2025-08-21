'use client';

import React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = theme ?? resolvedTheme;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1000 }}
    >
      {current === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}

export default ThemeToggle;


