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
        priority={number === 1} // Приоритет только для первого изображения
      />
    </>
  );
}
