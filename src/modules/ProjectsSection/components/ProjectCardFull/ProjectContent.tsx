import React from 'react';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { GlassCard } from '@/lib/ui';
import { ProjectLinks } from './ProjectLinks';
import styles from './ProjectCardFull.module.scss';

interface ProjectContentProps {
  project: ProjectData;
}

export function ProjectContent({ project }: ProjectContentProps) {
  return (
    <GlassCard className={styles['projects-card__content']} variant="content-focused">
      <h3 className={styles['projects-card__title']}>{project.title}</h3>
      <p className={styles['projects-card__text']}>{project.text}</p>
      <ProjectLinks project={project} />
    </GlassCard>
  );
}