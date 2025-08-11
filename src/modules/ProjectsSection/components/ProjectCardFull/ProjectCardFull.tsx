'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import styles from './ProjectCardFull.module.scss';

interface ProjectCardFullscreenProps {
  project: ProjectData;
}

export function ProjectCardFullscreen({ project }: ProjectCardFullscreenProps) {
  return (
    <>
      <Image
        className={styles['projects-card__img']}
        src={project.image}
        alt={project.title}
        width={800}
        height={600}
        priority
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      <div className={styles['projects-card__content']}>
        <h3 className={styles['projects-card__title']}>{project.title}</h3>
        <p className={styles['projects-card__text']}>{project.text}</p>
        <Link
          className={styles['projects-card__link']}
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Repositories
        </Link>
      </div>
    </>
  );
}
