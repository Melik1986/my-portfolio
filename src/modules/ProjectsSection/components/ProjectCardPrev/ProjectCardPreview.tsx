'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ProjectCardPrev.module.scss';

interface ProjectCardPreviewProps {
  number: number;
  previewImage: string;
  title: string;
}

export function ProjectCardPreview({ number, previewImage, title }: ProjectCardPreviewProps) {
  return (
    <>
      <span className={styles['projects-card__number']}>{number}</span>
      <Image
        className={styles['projects-card__img']}
        src={previewImage}
        alt={title}
        width={300}
        height={200}
        priority={number <= 3} // Приоритет для первых 3 изображений
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 280px, 300px"
        loading={number <= 3 ? 'eager' : 'lazy'}
      />
    </>
  );
}
