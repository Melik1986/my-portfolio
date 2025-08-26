import { useMemo } from 'react';
import { getSuccessContent } from '@/lib/utils/success-modal.utils';
import type { SuccessContent } from '@/lib/types/success-modal.types';

export function useSuccessModal(isOpen: boolean, type: 'client' | 'company') {
  const content: SuccessContent = useMemo(() => getSuccessContent(type), [type]);

  // Зарезервировано под расширение (a11y, focus-trap и т.д.)
  const containerProps = useMemo(
    () => ({
      role: 'dialog',
      'aria-modal': true,
      'aria-hidden': isOpen ? undefined : true,
      'aria-label': content.title,
    }),
    [isOpen, content.title],
  );

  return { content, containerProps } as const;
}
