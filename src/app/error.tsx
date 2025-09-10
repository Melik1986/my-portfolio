'use client';
import { useI18n } from '@/i18n';
import { useRestartApp } from '@/lib/hooks/useRestartApp';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  const { restartApp } = useRestartApp();
  
  console.error('Application error:', error instanceof Error ? error.message : String(error));

  return (
    <div className="error">
      <h2>{t('error.title')}</h2>
      <p>{error.message}</p>
      <button onClick={reset}>{t('error.tryAgain')}</button>
      <button onClick={restartApp}>{t('error.restart')}</button>
    </div>
  );
}
