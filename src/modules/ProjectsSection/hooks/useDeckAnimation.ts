import { useCallback, useRef } from 'react';
import { CardPosition } from '@/modules/ProjectsSection/types/projects-catalog';

// Хук для логики раскрытия/сбора колоды (expand/collapse).
export const useDeckAnimation = (
  animateToPosition: (element: HTMLElement, position: Partial<CardPosition>) => void,
  positions: CardPosition[],
) => {
  const isExpandedRef = useRef(false);

  const expandDeck = useCallback(() => {
    isExpandedRef.current = true;
    const cards = document.querySelectorAll('.projects-card');

    cards.forEach((card, i) => {
      // Проверяем, что карточка НЕ в полноэкранном режиме
      const isFullscreen = card.getAttribute('data-fullscreen') === 'true';
      if (!isFullscreen && positions[i]) {
        // При наведении карточки поднимаются еще выше и немного вперед по Z
        animateToPosition(card as HTMLElement, {
          ...positions[i],
          y: positions[i].y - 50, // Дополнительный подъем
          z: positions[i].z + Math.abs(positions[i].z) * 0.1,
        });
      }
    });
  }, [animateToPosition, positions]);

  const collapseDeck = useCallback(() => {
    isExpandedRef.current = false;
    const cards = document.querySelectorAll('.projects-card');

    cards.forEach((card, i) => {
      // Проверяем, что карточка НЕ в полноэкранном режиме
      const isFullscreen = card.getAttribute('data-fullscreen') === 'true';
      if (!isFullscreen && positions[i]) {
        // Возвращаем в исходную стопку (в центр)
        animateToPosition(card as HTMLElement, { x: 0, y: 0, z: 0, zIndex: i, filter: '' });
      }
    });
  }, [animateToPosition, positions]);

  return { expandDeck, collapseDeck, isExpanded: isExpandedRef };
};
