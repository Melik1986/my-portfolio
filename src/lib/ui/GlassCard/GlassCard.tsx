'use client';

import React from 'react';
import styles from './GlassCard.module.scss';

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'content-focused';
  onClick?: () => void;
}

export function GlassCard({ children, className, variant = 'default', onClick }: GlassCardProps) {
  return (
    <div className={`${styles['glass-card']} ${variant !== 'default' ? styles[`glass-card--${variant}`] : ''} ${className || ''}`} onClick={onClick}>
      <div className={styles['glass-card__filter']}></div>
      <div className={styles['glass-card__overlay']}></div>
      <div className={styles['glass-card__specular']}></div>
      <div className={styles['glass-card__content']}>{children}</div>
    </div>
  );
}
