'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { useProjectTheme } from '@/modules/ProjectsSection/hooks/useProjectTheme';
import { ProjectImage } from './ProjectImage';
import { ProjectContent } from './ProjectContent';
import { CloseButton } from './CloseButton';

interface ProjectCardFullscreenProps {
  project: ProjectData;
  onClose?: () => void;
}

export function ProjectCardFullscreen({ project, onClose }: ProjectCardFullscreenProps) {
  // Применяем цветовую тему проекта
  useProjectTheme(project.theme);

  // Используем портал для рендера вне трансформированного контейнера
  if (typeof window === 'undefined') {
    return null; // SSR защита
  }

  return createPortal(
    <>
      <ProjectImage project={project} />
      <ProjectContent project={project} />
      <CloseButton onClose={onClose} />
    </>,
    document.body,
  );
}
