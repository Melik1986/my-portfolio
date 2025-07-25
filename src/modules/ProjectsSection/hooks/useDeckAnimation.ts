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
      if (!card.classList.contains('fullscreen') && positions[i]) {
        animateToPosition(card as HTMLElement, positions[i]);
      }
    });
  }, [animateToPosition, positions]);

  const collapseDeck = useCallback(() => {
    isExpandedRef.current = false;
    const cards = document.querySelectorAll('.projects-card');

    cards.forEach((card) => {
      if (!card.classList.contains('fullscreen')) {
        animateToPosition(card as HTMLElement, { x: 0, y: 0, zIndex: 0 });
      }
    });
  }, [animateToPosition]);

  return { expandDeck, collapseDeck, isExpanded: isExpandedRef };
};
