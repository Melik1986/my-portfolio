'use client';

import React from 'react';
import Image from 'next/image';
import './ProjectCardPrev.module.scss';

interface ProjectCardPreviewProps {
  number: number;
  previewImage: string;
  title: string;
}

export function ProjectCardPreview({ number, previewImage, title }: ProjectCardPreviewProps) {
  return (
    <>
      <span className="projects-card__number">{number}</span>
      <Image
        className="projects-card__img projects-card__img--small"
        src={previewImage}
        alt={title}
        width={300}
        height={200}
        loading="lazy"
      />
    </>
  );
}
