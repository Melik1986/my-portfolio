'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { ProjectCardPreview } from '@/modules/ProjectsSection/components/index';
import { ProjectCardFullscreen } from '@/modules/ProjectsSection/components/index';



import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  totalCards: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: (next: boolean) => void;
  onMount?: (element: HTMLElement) => void;
  onUnmount?: () => void;
}



// Убираем все GSAP анимации из ProjectCard - управление только через ProjectsCatalog

function getCardContent(isFullscreen: boolean, project: ProjectData, cardNumber: number, onClose?: () => void) {
  return isFullscreen ? (
    <ProjectCardFullscreen project={project} onClose={onClose} />
  ) : (
    <ProjectCardPreview
      number={cardNumber}
      previewImage={project.previewImage}
      title={project.title}
    />
  );
}

// eslint-disable-next-line max-lines-per-function
export function ProjectCard(props: ProjectCardProps) {
  const { project, index, onHoverStart, onHoverEnd, isFullscreen: isFullscreenProp, onToggleFullscreen, onMount, onUnmount } = props;
  const [isFullscreenLocal, setIsFullscreenLocal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardNumber = index + 1; // Правильная нумерация: первая карточка = 1

  const isFullscreen = isFullscreenProp ?? isFullscreenLocal;

  // Регистрация элемента при монтировании
  useEffect(() => {
    if (cardRef.current && onMount) {
      onMount(cardRef.current);
    }
    return () => {
      onUnmount?.();
    };
  }, [onMount, onUnmount]);

  const handleClick = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen(!isFullscreen);
    } else {
      setIsFullscreenLocal((prev) => !prev);
    }
  }, [onToggleFullscreen, isFullscreen]);

  // Обработка клавиши Escape для выхода из полноэкранного режима
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        handleClick();
      }
    };

    if (isFullscreen) {
      // Блокируем прокрутку страницы
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isFullscreen, handleClick]);

  const content = getCardContent(isFullscreen, project, cardNumber, () => handleClick());

  return (
    <div
      ref={cardRef}
      className={`${styles['projects-card']} ${isFullscreen ? styles['fullscreen'] : ''}`}
      data-index={index}
      data-fullscreen={isFullscreen}
      onClick={handleClick}
      onMouseEnter={isFullscreen ? undefined : onHoverStart}
      onMouseLeave={isFullscreen ? undefined : onHoverEnd}
    >
      {content}
    </div>
  );
}
