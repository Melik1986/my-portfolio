'use client';

import React, { useMemo, useState, useTransition, useRef, useCallback } from 'react';
import { ProjectCard } from '@/modules/ProjectsSection/components/index';
import { useProjectsAnimation } from '../../hooks/useProjectsAnimation';
import { useVisibilityAnimation } from '../../hooks/useVisibilityAnimation';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import styles from './ProjectsCatalog.module.scss';

interface ProjectsCatalogProps {
  projects: ProjectData[];
}

// Функция для сброса состояния свайпа
function resetSwipeState(
  pointerStartRef: React.MutableRefObject<{ x: number; y: number } | null>,
  isSwipingRef: React.MutableRefObject<boolean>
) {
  pointerStartRef.current = null;
  isSwipingRef.current = false;
}

// Функция для выполнения свайпа
function executeSwipe(
  deltaX: number,
  animation: ReturnType<typeof useProjectsAnimation>,
  isAnimatingRef: React.MutableRefObject<boolean>,
  lastSwipeTimeRef: React.MutableRefObject<number>
) {
  isAnimatingRef.current = true;
  lastSwipeTimeRef.current = Date.now();
  
  if (deltaX > 0) {
    animation.swipeCardBackward();
  } else {
    animation.swipeCardForward();
  }
  
  setTimeout(() => {
    isAnimatingRef.current = false;
  }, 650);
}

// Хук для обработки swipe-жестов
function useSwipeGestures(animation: ReturnType<typeof useProjectsAnimation>, activeFullscreenIndex: number | null) {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const lastSwipeTimeRef = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (activeFullscreenIndex !== null || isAnimatingRef.current) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isSwipingRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [activeFullscreenIndex]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerStartRef.current || activeFullscreenIndex !== null || isAnimatingRef.current) return;
    const deltaX = Math.abs(e.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartRef.current.y);
    if (deltaX > 15 && deltaX > deltaY * 1.2) {
      isSwipingRef.current = true;
    }
  }, [activeFullscreenIndex]);

  return { handlePointerDown, handlePointerMove, pointerStartRef, isSwipingRef, isAnimatingRef, lastSwipeTimeRef };
}

// Хук для обработки завершения свайпа
function usePointerUpHandler(
  swipeRefs: {
    pointerStartRef: React.MutableRefObject<{ x: number; y: number } | null>;
    isSwipingRef: React.MutableRefObject<boolean>;
    isAnimatingRef: React.MutableRefObject<boolean>;
    lastSwipeTimeRef: React.MutableRefObject<number>;
  },
  activeFullscreenIndex: number | null,
  animation: ReturnType<typeof useProjectsAnimation>
) {
  const { pointerStartRef, isSwipingRef, isAnimatingRef, lastSwipeTimeRef } = swipeRefs;
  
  return useCallback((e: React.PointerEvent) => {
    if (!pointerStartRef.current || !isSwipingRef.current || activeFullscreenIndex !== null || isAnimatingRef.current) {
      resetSwipeState(pointerStartRef, isSwipingRef);
      return;
    }

    const now = Date.now();
    const timeSinceLastSwipe = now - lastSwipeTimeRef.current;
    
    if (timeSinceLastSwipe < 600) {
      resetSwipeState(pointerStartRef, isSwipingRef);
      return;
    }

    const deltaX = e.clientX - pointerStartRef.current.x;
    const minSwipeDistance = 60;
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      executeSwipe(deltaX, animation, isAnimatingRef, lastSwipeTimeRef);
    }
    
    resetSwipeState(pointerStartRef, isSwipingRef);
  }, [activeFullscreenIndex, animation, pointerStartRef, isSwipingRef, isAnimatingRef, lastSwipeTimeRef]);
}

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
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handleArrowClick: (direction: 'forward' | 'backward') => void;
  projects: ProjectData[];
  handleToggleFullscreen: (index: number, next: boolean) => void;
  animation: ReturnType<typeof useProjectsAnimation>;
  mountHandlers: ((el: HTMLElement) => void)[];
  unmountHandlers: (() => void)[];
}) {
  const {
    containerRef, isPending, activeFullscreenIndex, handlePointerDown,
    handlePointerMove, handlePointerUp, handleArrowClick, projects,
    handleToggleFullscreen, animation, mountHandlers, unmountHandlers
  } = props;

  const containerClassName = `${styles['projects-catalog__container']} ${isPending ? styles['loading'] : ''} ${activeFullscreenIndex !== null ? styles['projects-catalog__container--fullscreen'] : ''}`;

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'pan-y' }}
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
  const { handlePointerDown, handlePointerMove, pointerStartRef, isSwipingRef, isAnimatingRef, lastSwipeTimeRef } = useSwipeGestures(animation, activeFullscreenIndex);
  const handlePointerUp = usePointerUpHandler({ pointerStartRef, isSwipingRef, isAnimatingRef, lastSwipeTimeRef }, activeFullscreenIndex, animation);
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
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleArrowClick,
    projects,
    handleToggleFullscreen,
    animation,
    mountHandlers,
    unmountHandlers
  });
}
