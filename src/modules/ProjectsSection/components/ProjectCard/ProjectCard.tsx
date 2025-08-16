'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { ProjectCardPreview } from '@/modules/ProjectsSection/components/index';
import { ProjectCardFullscreen } from '@/modules/ProjectsSection/components/index';
import { useCardAnimation } from '@/modules/ProjectsSection/hooks/useProjectsCardAnime';
import { AnimationConfig } from '@/modules/ProjectsSection/types/projects-catalog';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  totalCards: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function getAnimationConfig(): AnimationConfig {
  return {
    zStep: 1,
    yStep: 0,
    xStep: 0,
    hoverLift: -20,
    fanDuration: 0.5,
    hoverDuration: 0.2,
    hoverShadow: '0 10px 30px rgba(0,0,0,0.3)',
    cardShadow: '0 5px 15px rgba(0,0,0,0.2)',
  };
}

function usePositionAnimation(
  cardRef: React.RefObject<HTMLDivElement | null>,
  options: { index: number; cardNumber: number; totalCards: number },
  isFullscreen: boolean,
) {
  const config = getAnimationConfig();
  const { positions } = useCardAnimation(config, options.totalCards);

  useEffect(() => {
    if (!cardRef.current) return;
    
    if (isFullscreen) {
      // Полностью сбрасываем все GSAP трансформации для полноэкранного режима
      gsap.set(cardRef.current, {
        clearProps: "all",
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        skewX: 0,
        skewY: 0,
        filter: 'none',
        zIndex: 9999,
      });
    } else {
      // Применяем позицию только если карточка НЕ в полноэкранном режиме
      const effectiveIndex = options.totalCards - 1 - options.index;
      const pos = positions[effectiveIndex] || { x: 0, y: 0, zIndex: 0, filter: '' };
      
      gsap.set(cardRef.current, {
        x: pos.x,
        y: pos.y,
        z: 0,
        filter: `hue-rotate(${options.index * 30}deg)`,
        zIndex: options.cardNumber,
      });
    }
  }, [cardRef, options, positions, isFullscreen]);
}

function useProjectCardAnimation(
  cardRef: React.RefObject<HTMLDivElement | null>,
  options: { index: number; cardNumber: number; totalCards: number },
  isFullscreen: boolean,
) {
  usePositionAnimation(cardRef, options, isFullscreen);
  return { animateTransition: () => {} };
}

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

export function ProjectCard(props: ProjectCardProps) {
  const { project, index, totalCards, onHoverStart, onHoverEnd } = props;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardNumber = totalCards - index;

  const { animateTransition } = useProjectCardAnimation(cardRef, { index, cardNumber, totalCards }, isFullscreen);

  const handleClick = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

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
