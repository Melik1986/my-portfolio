import React from 'react';
import styles from '../styles/AiContentSection.module.css';

interface ContentSectionProps {
  subtitle: string;
  title: string;
  description: string;
  className?: string;
}

export function ContentSection({ 
  subtitle, 
  title, 
  description, 
  className = '' 
}: ContentSectionProps) {
  return (
    <div className={`${styles.contentSmall} ${className}`}>
      <h2 className={styles.contentSubtitle}>{subtitle}</h2>
      <div className={styles.spacer15}></div>
      <div className={styles.contentTitle}>{title}</div>
      <div className={styles.spacer30}></div>
      <p className={styles.contentParagraph}>{description}</p>
    </div>
  );
}
