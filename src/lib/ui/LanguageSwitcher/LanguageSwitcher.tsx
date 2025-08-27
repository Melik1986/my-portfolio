'use client';

import React from 'react';
import { useI18n } from '@/i18n';

export function LanguageSwitcher() {
  const { locale } = useI18n();

  const setLocale = (next: 'en' | 'ru') => {
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <div style={{ display: 'inline-flex', gap: 8 }}>
      <button type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'}>
        EN
      </button>
      <button type="button" onClick={() => setLocale('ru')} aria-pressed={locale === 'ru'}>
        RU
      </button>
    </div>
  );
}

export default LanguageSwitcher;
