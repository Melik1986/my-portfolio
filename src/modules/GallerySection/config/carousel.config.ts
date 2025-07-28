/**
 * Конфигурация карусели галереи
 * Содержит все настройки для автопрокрутки, анимаций и поведения карусели
 */
export const CAROUSEL_CONFIG = {
  /** Интервал автопрокрутки в миллисекундах */
  autoSlideInterval: 3500,

  /** Настройки анимации перехода между слайдами */
  animation: {
    duration: 0.5,
    ease: 'power1.out',
  },

  /** Настройки IntersectionObserver для автозапуска при видимости */
  intersection: {
    threshold: 0.1,
  },

  /** Настройки прогресс-бара автопрокрутки */
  progress: {
    duration: 3.5, // autoSlideInterval / 1000
    ease: 'linear',
  },
} as const;

/** Тип конфигурации карусели для типизации */
export type CarouselConfig = typeof CAROUSEL_CONFIG;
