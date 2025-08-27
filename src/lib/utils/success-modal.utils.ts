import type { SuccessContent } from '@/lib/types/success-modal.types';
import { t } from '@/i18n';

export function getSuccessContent(type: 'client' | 'company'): SuccessContent {
  if (type === 'client') {
    return {
      title: t('form.success.client.title'),
      description: t('form.success.client.description'),
    };
  }
  return {
    title: t('form.success.company.title'),
    description: t('form.success.company.description'),
  };
}
