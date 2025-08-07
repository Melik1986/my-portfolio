import { AnimationType } from '@/lib/gsap/types/gsap.types';

/**
 * Интерфейс для определения свойств анимации
 * Описывает начальное и конечное состояние анимации
 */
export interface AnimationDefinition {
  from: gsap.TweenVars; // Начальное состояние
  to: gsap.TweenVars; // Конечное состояние
  duration?: number; // Длительность анимации (опционально)
  ease?: string; // Функция сглаживания (опционально)
}

/**
 * Предустановки анимаций с from и to свойствами
 * Содержит все доступные типы анимаций с их конфигурацией
 */
export const animationDefinitions: Record<AnimationType, AnimationDefinition> = {
  'slide-left': {
    from: { x: -100, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
  },
  'slide-right': {
    from: { x: 100, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.8,
    ease: 'power2.out',
  },
  'slide-down': {
    from: { y: -50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.6,
    ease: 'power2.out',
  },
  'slide-up': {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.6,
    ease: 'power2.out',
  },
  'fade-up': {
    from: { y: 30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.6,
    ease: 'power2.out',
  },
  'fade-left': {
    from: { x: 30, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.6,
    ease: 'power2.out',
  },
  'fade-right': {
    from: { x: -30, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.6,
    ease: 'power2.out',
  },
  'zoom-in': {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 0.6,
    ease: 'back.out(1.7)',
  },
  'scale-up': {
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 0.6,
    ease: 'back.out(1.7)',
  },
  'slide-left-scale': {
    from: { x: -100, scale: 0.8, opacity: 0 },
    to: { x: 0, scale: 1, opacity: 1 },
    duration: 0.8,
    ease: 'power3.out',
  },
  'slide-down-blur': {
    from: { y: -50, opacity: 0, filter: 'blur(8px)' },
    to: { y: 0, opacity: 1, filter: 'blur(0px)' },
    duration: 0.8,
    ease: 'power3.out',
  },
  'svg-draw': {
    from: { strokeDashoffset: 'auto' }, // Будет вычислено динамически
    to: { strokeDashoffset: 0 },
    duration: 1.0,
    ease: 'power2.out',
  },
  'text-reveal': {
    from: {
      opacity: 0,
      y: 30,
      rotationX: 90,
    },
    to: {
      opacity: 1,
      y: 0,
      rotationX: 0,
    },
    duration: 0.8,
    ease: 'power2.out',
  },
};

/**
 * Функция для получения определения анимации с учетом пользовательских параметров
 * Объединяет базовое определение с пользовательскими настройками
 */
export function getAnimationDefinition(
  type: AnimationType,
  customConfig?: Partial<AnimationDefinition>,
): AnimationDefinition {
  const baseDefinition = animationDefinitions[type];

  if (!baseDefinition) {
    return animationDefinitions['fade-up'];
  }

  return {
    ...baseDefinition,
    from: { ...baseDefinition.from, ...customConfig?.from },
    to: { ...baseDefinition.to, ...customConfig?.to },
    duration: customConfig?.duration ?? baseDefinition.duration ?? 0.6,
    ease: customConfig?.ease ?? baseDefinition.ease ?? 'power2.out',
  };
}
