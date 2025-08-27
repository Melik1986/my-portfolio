'use client';

import React, { createContext, useContext, useMemo } from 'react';
import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';

type SupportedLocale = 'en' | 'ru';

type Dictionaries = Record<SupportedLocale, Record<string, string>>;

const dictionaries: Dictionaries = {
  en,
  ru,
};

type I18nContextValue = {
  locale: SupportedLocale;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type I18nProviderProps = {
  children: React.ReactNode;
  locale?: SupportedLocale;
};

export function I18nProvider({ children, locale = 'en' }: I18nProviderProps) {
  const messages = dictionaries[locale] ?? dictionaries.en;

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key: string) => messages[key] ?? key,
    }),
    [locale, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}

export function t(key: string): string {
  // Convenience wrapper for usage outside components when context is not easily available.
  // In this minimal setup, default to English if hook is not used.
  // Prefer useI18n().t in components.
  return dictionaries.en[key] ?? key;
}

export type { SupportedLocale };
