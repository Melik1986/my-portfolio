'use client';
import React from 'react';
import { GlassCard } from '../GlassCard';
import styles from './SuccessModal.module.scss';
import type { SuccessModalProps } from '@/lib/types/success-modal.types';
import { useSuccessModal } from '@/lib/hooks/useSuccessModal';
import { t } from '@/i18n';

export function SuccessModal({ isOpen, onClose, messageType }: SuccessModalProps) {
  const { content, containerProps } = useSuccessModal(isOpen, messageType);
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} {...containerProps}>
        <GlassCard variant="content-focused" className={styles.card}>
          <div className={styles.content}>
            <div className={styles.icon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.title}>{content.title}</h2>
            <p className={styles.description}>{content.description}</p>
            <button className={styles.closeButton} onClick={onClose}>
              {t('common.close')}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
