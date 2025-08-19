import React from 'react';
import styles from './AiContent/AiContent.module.scss';

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
    <div className={`${styles['ai-content__content']} ${styles['ai-content__content-small']} ${className}`}>
      <h2 className={styles['ai-content__content-title']}>{title}</h2>
      <p className={styles['ai-content__content-paragraph']}>{description}</p>
    </div>
  );
}
