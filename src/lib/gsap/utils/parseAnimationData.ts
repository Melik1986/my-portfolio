import { AnimationType, AnimationConfig } from '@/lib/gsap/types/gsap.types';

/**
 * Утилита для парсинга data-атрибутов анимации
 * Извлекает настройки анимации из DOM элемента
 */
export function parseAnimationData(element: Element): AnimationConfig | null {
  const animation = element.getAttribute('data-animation');
  if (!animation) return null;

  const duration = element.getAttribute('data-duration');
  const ease = element.getAttribute('data-ease');
  const delay = element.getAttribute('data-delay');
  const stagger = element.getAttribute('data-stagger');
  const groupDelay = element.getAttribute('data-group-delay');

  return {
    animation: animation as AnimationType,
    duration: duration ? parseFloat(duration) : undefined,
    ease: ease || undefined,
    delay: delay ? parseFloat(delay) : undefined,
    stagger: stagger ? parseFloat(stagger) : undefined,
    groupDelay: groupDelay ? parseFloat(groupDelay) : undefined,
  };
}
