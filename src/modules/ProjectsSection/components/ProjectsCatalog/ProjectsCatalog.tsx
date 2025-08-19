'use client';

import React, { useCallback, useState, useTransition } from 'react';
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

  // Обработчики событий
  const handleContainerMouseEnter = useCallback(() => {
    animation.expandFan();
  }, [animation]);

  const handleContainerMouseLeave = useCallback(() => {
    animation.collapseFan();
  }, [animation]);

  const handleCardHover = useCallback((index: number, isHovering: boolean) => {
    animation.hoverCard(index, isHovering);
  }, [animation]);

  const handleToggleFullscreen = useCallback((index: number, isFullscreen: boolean) => {
    if (isFullscreen) {
      setActiveFullscreenIndex(index);
      animation.setFullscreen(index);
    } else {
      setActiveFullscreenIndex(null);
      animation.setFullscreen(null);
    }
  }, [animation]);

  return (
    <div
      className={`${styles['projects-catalog__container']} ${isPending ? styles['loading'] : ''} ${activeFullscreenIndex !== null ? styles['projects-catalog__container--fullscreen'] : ''}`}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
      style={activeFullscreenIndex !== null ? { transform: 'none' } : undefined}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          index={index}
          totalCards={projects.length}
          isFullscreen={activeFullscreenIndex === index}
          onToggleFullscreen={(next) => handleToggleFullscreen(index, next)}
          onHoverStart={() => handleCardHover(index, true)}
          onHoverEnd={() => handleCardHover(index, false)}
          onMount={(element) => animation.registerCard(element, index)}
          onUnmount={() => animation.unregisterCard(index)}
        />
      ))}
    </div>
  );
}