'use client';

import React, { useMemo, useState, useTransition, useCallback } from 'react';
import { ProjectCard } from '@/modules/ProjectsSection/components/index';
import { useProjectsAnimation } from '../../hooks/useProjectsAnimation';
import { useVisibilityAnimation } from '../../hooks/useVisibilityAnimation';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import styles from './ProjectsCatalog.module.scss';

interface ProjectsCatalogProps {
  projects: ProjectData[];
}

// Свайп-жесты удалены: логика pointer обработчиков и выполнение свайпов по жестам отключены. Навигация осуществляется только по стрелкам.

// Хук для обработки fullscreen состояния
function useFullscreenState(animation: ReturnType<typeof useProjectsAnimation>) {
  const [activeFullscreenIndex, setActiveFullscreenIndex] = useState<number | null>(null);
  
  const handleToggleFullscreen = useCallback((index: number, next: boolean) => {
    if (next) {
      setActiveFullscreenIndex(index);
      animation.setFullscreen(index);
    } else {
      setActiveFullscreenIndex(null);
      animation.setFullscreen(null);
    }
  }, [animation]);

  return { activeFullscreenIndex, handleToggleFullscreen };
}

// Функция для создания обработчиков карточек
function useCardHandlers(animation: ReturnType<typeof useProjectsAnimation>, projects: ProjectData[]) {
  const mountHandlers = useMemo(
    () => projects.map((_, i) => (el: HTMLElement) => animation.registerCard(el, i)),
    [animation, projects],
  );
  const unmountHandlers = useMemo(
    () => projects.map((_, i) => () => animation.unregisterCard(i)),
    [animation, projects],
  );
  return { mountHandlers, unmountHandlers };
}

// Функция для создания обработчика кликов по стрелкам
function useArrowClickHandler(animation: ReturnType<typeof useProjectsAnimation>, activeFullscreenIndex: number | null) {
  return useCallback((direction: 'forward' | 'backward') => {
    if (activeFullscreenIndex !== null) return;
    if (direction === 'forward') {
      animation.swipeCardForward();
    } else {
      animation.swipeCardBackward();
    }
  }, [animation, activeFullscreenIndex]);
}

// Функция для рендеринга стрелок навигации
function renderNavigationArrows(
  handleArrowClick: (direction: 'forward' | 'backward') => void,
  activeFullscreenIndex: number | null
) {
  return (
    <>
      <button
        className={styles['projects-catalog__arrow-left']}
        onClick={() => handleArrowClick('backward')}
        disabled={activeFullscreenIndex !== null}
        aria-label="Предыдущая карточка"
        type="button"
      />
      <button
        className={styles['projects-catalog__arrow-right']}
        onClick={() => handleArrowClick('forward')}
        disabled={activeFullscreenIndex !== null}
        aria-label="Следующая карточка"
        type="button"
      />
    </>
  );
}

// Функция для рендеринга карточек проектов
function renderProjectCards(
  projects: ProjectData[],
  cardProps: {
    handleToggleFullscreen: (index: number, next: boolean) => void;
    animation: ReturnType<typeof useProjectsAnimation>;
    mountHandlers: ((el: HTMLElement) => void)[];
    unmountHandlers: (() => void)[];
  },
  activeFullscreenIndex: number | null
) {
  const { handleToggleFullscreen, animation, mountHandlers, unmountHandlers } = cardProps;
  
  return projects.map((project, index) => (
    <ProjectCard
      key={index}
      project={project}
      index={index}
      totalCards={projects.length}
      isFullscreen={activeFullscreenIndex === index}
      onToggleFullscreen={(next) => handleToggleFullscreen(index, next)}
      onHoverStart={() => animation.hoverCard(index, true)}
      onHoverEnd={() => animation.hoverCard(index, false)}
      onMount={mountHandlers[index]}
      onUnmount={unmountHandlers[index]}
    />
  ));
}

// Функция для рендеринга контейнера каталога
function renderCatalogContainer(props: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPending: boolean;
  activeFullscreenIndex: number | null;
  handleArrowClick: (direction: 'forward' | 'backward') => void;
  projects: ProjectData[];
  handleToggleFullscreen: (index: number, next: boolean) => void;
  animation: ReturnType<typeof useProjectsAnimation>;
  mountHandlers: ((el: HTMLElement) => void)[];
  unmountHandlers: (() => void)[];
}) {
  const {
    containerRef, isPending, activeFullscreenIndex, handleArrowClick, projects,
    handleToggleFullscreen, animation, mountHandlers, unmountHandlers
  } = props;

  const containerClassName = `${styles['projects-catalog__container']} ${isPending ? styles['loading'] : ''} ${activeFullscreenIndex !== null ? styles['projects-catalog__container--fullscreen'] : ''}`;

  return (
    <div
      ref={containerRef}
      className={containerClassName}
    >
      {renderNavigationArrows(handleArrowClick, activeFullscreenIndex)}
      {renderProjectCards(projects, { handleToggleFullscreen, animation, mountHandlers, unmountHandlers }, activeFullscreenIndex)}
    </div>
  );
}

export function ProjectsCatalog({ projects }: ProjectsCatalogProps) {
  const [isPending] = useTransition();
  const animation = useProjectsAnimation(projects.length);
  const { activeFullscreenIndex, handleToggleFullscreen } = useFullscreenState(animation);
  // Отключены: useSwipeGestures и usePointerUpHandler — жесты свайпа больше не используются
  const handleArrowClick = useArrowClickHandler(animation, activeFullscreenIndex);
  const { mountHandlers, unmountHandlers } = useCardHandlers(animation, projects);

  const containerRef = useVisibilityAnimation({
    onVisible: () => animation.expandFan(),
    onHidden: () => animation.collapseFan(),
  });

  return renderCatalogContainer({
    containerRef,
    isPending,
    activeFullscreenIndex,
    handleArrowClick,
    projects,
    handleToggleFullscreen,
    animation,
    mountHandlers,
    unmountHandlers
  });
}

// Свайп-жесты удалены. Навигация осуществляется только по стрелкам.
