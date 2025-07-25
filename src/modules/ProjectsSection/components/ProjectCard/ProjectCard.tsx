'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { ProjectCardPreview } from '@/modules/ProjectsSection/components/index';
import { ProjectCardFullscreen } from '@/modules/ProjectsSection/components/index';
import { useCardAnimation } from '@/modules/ProjectsSection/hooks/useProjectsCardAnime';
import { AnimationConfig } from '@/modules/ProjectsSection/types/projects-catalog';
import './ProjectCard.module.scss';

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
) {
  const config = getAnimationConfig();
  const { positions } = useCardAnimation(config, options.totalCards);

  useEffect(() => {
    if (cardRef.current) {
      const effectiveIndex = options.totalCards - 1 - options.index;
      const pos = positions[effectiveIndex] || { x: 0, y: 0, zIndex: 0, filter: '' };
      gsap.set(cardRef.current, {
        x: pos.x,
        y: pos.y,
        zPosition: 0,
        filter: `hue-rotate(${options.index * 30}deg)`,
        zIndex: options.cardNumber,
      });
    }
  }, [cardRef, options, positions]);
}

function useTransitionAnimation(cardRef: React.RefObject<HTMLDivElement | null>) {
  const animateTransition = () => {
    if (cardRef.current) {
      gsap.set(cardRef.current, { opacity: 0 });
      setTimeout(() => {
        gsap.set(cardRef.current, { opacity: 1 });
      }, 100);
    }
  };

  return { animateTransition };
}

function useProjectCardAnimation(
  cardRef: React.RefObject<HTMLDivElement | null>,
  options: { index: number; cardNumber: number; totalCards: number },
) {
  usePositionAnimation(cardRef, options);
  return useTransitionAnimation(cardRef);
}

function getCardContent(isFullscreen: boolean, project: ProjectData, cardNumber: number) {
  return isFullscreen ? (
    <ProjectCardFullscreen project={project} />
  ) : (
    <ProjectCardPreview
      number={cardNumber}
      previewImage={project.previewImage}
      title={project.title}
    />
  );
}

function getHandleClick(
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>,
  animateTransition: () => void,
) {
  return () => {
    setIsFullscreen((prev) => !prev);
    animateTransition();
  };
}

export function ProjectCard(props: ProjectCardProps) {
  const { project, index, totalCards, onHoverStart, onHoverEnd } = props;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardNumber = totalCards - index;

  const { animateTransition } = useProjectCardAnimation(cardRef, { index, cardNumber, totalCards });

  const handleClick = useCallback(getHandleClick(setIsFullscreen, animateTransition), [
    animateTransition,
  ]);

  const content = getCardContent(isFullscreen, project, cardNumber);

  return (
    <div
      ref={cardRef}
      className={`projects-card ${isFullscreen ? 'fullscreen' : ''}`}
      data-index={index}
      onClick={handleClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {content}
    </div>
  );
}
