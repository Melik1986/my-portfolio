'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { getMobileImage } from '@/modules/ProjectsSection/utils/getMobileImage';
import { useProjectTheme } from '@/modules/ProjectsSection/hooks/useProjectTheme';
import styles from './ProjectCardFull.module.scss';
import { GlassCard } from '@/lib/ui';
import { useI18n } from '@/i18n';

interface ProjectCardFullscreenProps {
  project: ProjectData;
  onClose?: () => void;
}

export function ProjectCardFullscreen({ project, onClose }: ProjectCardFullscreenProps) {
  const { t } = useI18n();
  const imageSource = getMobileImage(project);
  
  // Применяем цветовую тему проекта
  useProjectTheme(project.theme);

  // Используем портал для рендера вне трансформированного контейнера
  if (typeof window === 'undefined') {
    return null; // SSR защита
  }

  return createPortal(
    <>
      <Image
        className={styles['projects-card__img']}
        src={imageSource}
        alt={project.title}
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      <GlassCard className={styles['projects-card__content']} variant="content-focused">
        <h3 className={styles['projects-card__title']}>{project.title}</h3>
        <p className={styles['projects-card__text']}>{project.text}</p>
        <Link
          className={styles['projects-card__link']}
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('projects.repositories')}
        </Link>
      </GlassCard>
      {onClose && (
        <button
          className={styles['projects-card__close']}
          onClick={onClose}
          aria-label={t('projects.closeFullscreen')}
        >
          ✕
        </button>
      )}
    </>,
    document.body,
  );
}
