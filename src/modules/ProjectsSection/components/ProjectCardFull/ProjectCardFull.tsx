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
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
