"use client";
import Link from 'next/link';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="not-found">
      <h2>{t('notFound.title')}</h2>
      <p>{t('notFound.description')}</p>
      <Link href="/">{t('notFound.backHome')}</Link>
    </div>
  );
}
