import { useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { AnimationConfig, CardPosition } from '@/modules/ProjectsSection/types/projects-catalog';

// Хук для расчета позиций карточек и анимаций (позиционирование, hover).
export const useCardAnimation = (config: AnimationConfig, totalCards: number) => {
  const positions = useMemo(() => calculatePositions(totalCards, config), [totalCards, config]);

  const animateToPosition = useCallback(
    (element: HTMLElement, position: Partial<CardPosition>) => {
      // Проверяем, что карточка НЕ в полноэкранном режиме
      const isFullscreen = element.getAttribute('data-fullscreen') === 'true';
      if (isFullscreen) return;
      
      gsap.to(element, {
        duration: config.fanDuration,
        ...position,
        ease: 'power3.out',
      });
    },
    [config.fanDuration],
  );

  const animateHover = useCallback(
    (element: HTMLElement, lifted: boolean) => {
      // Проверяем, что карточка НЕ в полноэкранном режиме
      const isFullscreen = element.getAttribute('data-fullscreen') === 'true';
      if (isFullscreen) return;
      
      const currentPosition = getCurrentPosition(element, positions);
      gsap.to(element, {
        duration: config.hoverDuration,
        y: currentPosition.y + (lifted ? config.hoverLift : 0),
        boxShadow: lifted ? config.hoverShadow : config.cardShadow,
        zIndex: Number(element.dataset.index) * config.zStep,
      });
    },
    [config, positions],
  );

  return { positions, animateToPosition, animateHover };
};

function calculatePositions(count: number, config: AnimationConfig): CardPosition[] {
  return Array.from({ length: count }, (_, i) => ({
    x: i * config.xStep,
    y: i * config.yStep,
    zIndex: i * config.zStep,
    filter: `hue-rotate(${i * 30}deg)`,
  }));
}

function getCurrentPosition(element: HTMLElement, positions: CardPosition[]): CardPosition {
  const index = Number(element.dataset.index) || 0;
  return positions[index] || { x: 0, y: 0, zIndex: 0, filter: '' };
}
