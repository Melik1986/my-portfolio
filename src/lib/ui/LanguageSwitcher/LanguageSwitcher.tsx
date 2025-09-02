'use client';

import React from 'react';
import { useI18n } from '@/i18n';
import styles from './LanguageSwitcher.module.scss';

export function LanguageSwitcher() {
  const { locale } = useI18n();

  return <div className={styles.languageSwitcher}>{locale.toUpperCase()}</div>;
}

export default LanguageSwitcher;
