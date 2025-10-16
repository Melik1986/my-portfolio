import React from 'react';
import Link from 'next/link';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { useI18n } from '@/i18n';
import styles from './ProjectCardFull.module.scss';

interface ProjectLinksProps {
  project: ProjectData;
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  const { t } = useI18n();

  return (
    <div className={styles['projects-card__links-container']}>
      <Link
        className={styles['projects-card__link']}
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('projects.repositories')}
      </Link>
      {project.preview && (
        <Link
          className={styles['projects-card__link']}
          href={project.preview}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('projects.preview')}
        </Link>
      )}
    </div>
  );
}