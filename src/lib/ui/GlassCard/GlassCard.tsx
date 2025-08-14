'use client';

import React from 'react';
import styles from './GlassCard.module.scss';

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div 
      className={`${styles['glass-card']} ${className || ''}`}
      onClick={onClick}
    >
      <div className={styles['glass-card__filter']}></div>
      <div className={styles['glass-card__overlay']}></div>
      <div className={styles['glass-card__specular']}></div>
      <div className={styles['glass-card__content']}>
        {children}
      </div>
    </div>
  );
}