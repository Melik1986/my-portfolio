import React from 'react';
import { useI18n } from '@/i18n';
import styles from './ProjectCardFull.module.scss';

interface CloseButtonProps {
  onClose?: () => void;
}

export function CloseButton({ onClose }: CloseButtonProps) {
  const { t } = useI18n();

  if (!onClose) {
    return null;
  }

  return (
    <button
      className={styles['projects-card__close']}
      onClick={onClose}
      aria-label={t('projects.closeFullscreen')}
    >
      ✕
    </button>
  );
}