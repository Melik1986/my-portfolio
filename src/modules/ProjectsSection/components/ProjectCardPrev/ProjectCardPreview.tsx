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
      <div className={styles['projects-card__img-wrapper']}>
        <Image
          className={styles['projects-card__img']}
          src={previewImage}
          alt={title}
          fill
          priority={number <= 3}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 280px, 300px"
          loading={number <= 3 ? 'eager' : 'lazy'}
        />
      </div>
    </>
  );
}
