'use client';

import React, { useCallback, useEffect } from 'react';
import { ProjectCard } from '@/modules/ProjectsSection/components/index';
import { useCardAnimation } from '../../hooks/useProjectsCardAnime';
import { useDeckAnimation } from '../../hooks/useDeckAnimation';
import { ANIMATION_CONFIG, PROJECTS_DATA } from '@/modules/ProjectsSection/config/projects-catalog';
import styles from './ProjectsCatalog.module.scss';

export function ProjectsCatalog() {
  const { positions, animateToPosition, animateHover } = useCardAnimation(
    ANIMATION_CONFIG,
    PROJECTS_DATA.length,
  );

  const { expandDeck, collapseDeck, isExpanded } = useDeckAnimation(animateToPosition, positions);

  // Инициализируем карточки в веерном положении при загрузке
  useEffect(() => {
    const cards = document.querySelectorAll('.projects-card');
    cards.forEach((card, i) => {
      if (positions[i]) {
        // Устанавливаем начальное веерное положение
        gsap.set(card as HTMLElement, positions[i]);
      }
    });
  }, [positions]);

  const handleCardHover = useCallback(
    (index: number, isHovering: boolean) => {
      const card = document.querySelector(`[data-index="${index}"]`);
      if (card && isExpanded.current) {
        animateHover(card as HTMLElement, isHovering);
      }
    },
    [animateHover, isExpanded],
  );

  return (
    <div
      className={styles['projects-catalog__container']}
      onMouseEnter={expandDeck}
      onMouseLeave={collapseDeck}
    >
      {PROJECTS_DATA.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          index={index}
          totalCards={PROJECTS_DATA.length}
          onHoverStart={() => handleCardHover(index, true)}
          onHoverEnd={() => handleCardHover(index, false)}
        />
      ))}
    </div>
  );
}
