'use client';
import { useI18n } from '@/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  console.error('Application error:', error instanceof Error ? error.message : String(error));

  return (
    <div className="error">
      <h2>{t('error.title')}</h2>
      <p>{error.message}</p>
      <button onClick={reset}>{t('error.tryAgain')}</button>
    </div>
  );
}
