'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { ProjectCard } from '@/modules/ProjectsSection/components/index';
import { useProjectsAnimation } from '../../hooks/useProjectsAnimation';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import styles from './ProjectsCatalog.module.scss';

interface ProjectsCatalogProps {
  projects: ProjectData[];
}

export function ProjectsCatalog({ projects }: ProjectsCatalogProps) {
  const [isPending] = useTransition();
  const [activeFullscreenIndex, setActiveFullscreenIndex] = useState<number | null>(null);
  const animation = useProjectsAnimation(projects.length);
  const mountHandlers = useMemo(() => projects.map((_, i) => (el: HTMLElement) => animation.registerCard(el, i)), [animation, projects]);
  const unmountHandlers = useMemo(() => projects.map((_, i) => () => animation.unregisterCard(i)), [animation, projects]);

  return (
    <div
      className={`${styles['projects-catalog__container']} ${isPending ? styles['loading'] : ''} ${activeFullscreenIndex !== null ? styles['projects-catalog__container--fullscreen'] : ''}`}
      onMouseEnter={() => animation.expandFan()}
      onMouseLeave={() => animation.collapseFan()}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          index={index}
          totalCards={projects.length}
          isFullscreen={activeFullscreenIndex === index}
          onToggleFullscreen={(next) => {
            if (next) {
              setActiveFullscreenIndex(index);
              animation.setFullscreen(index);
            } else {
              setActiveFullscreenIndex(null);
              animation.setFullscreen(null);
            }
          }}
          onHoverStart={() => animation.hoverCard(index, true)}
          onHoverEnd={() => animation.hoverCard(index, false)}
          onMount={mountHandlers[index]}
          onUnmount={unmountHandlers[index]}
        />
      ))}
    </div>
  );
}
