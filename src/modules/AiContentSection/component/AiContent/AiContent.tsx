import React from 'react';
import styles from './AiContent.module.scss';

interface ContentSectionProps {
  title: string;
  description: string;
  className?: string;
}

export const ContentSection = React.memo(function ContentSection({ title, description, className = '' }: ContentSectionProps) {
  return (
    <div
      className={`${styles['ai-content__content']} ${styles['ai-content__content-small']} ${className}`}
    >
      <h2
        className={styles['ai-content__content-title']}
        data-animation="slide-right"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0.6"
      >
        {title}
      </h2>
      <p
        className={styles['ai-content__content-paragraph']}
        data-animation="text-reveal"
        data-duration="1.2"
        data-ease="power2.out"
        data-delay="0.2"
      >
        {description}
      </p>
    </div>
  );
});
