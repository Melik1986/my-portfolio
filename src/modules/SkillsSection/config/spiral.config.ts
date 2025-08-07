import { SpiralConfig, SpiralState, IconData } from '../types/spiral';

/** Реэкспорт типов для спиральной анимации */
export type { SpiralConfig, SpiralState, IconData };

/**
 * Конфигурация по умолчанию для спиральной анимации
 * Определяет параметры движения и отображения иконок
 */
export const DEFAULT_SPIRAL_CONFIG: SpiralConfig = {
  numIcons: 30,
  radiusX: 150,
  radiusY: 40,
  speed: 0.01,
  animationDuration: 4000,
  elementSpacing: 30,
} as const;

/**
 * Массив технологических иконок для спиральной анимации
 * Содержит информацию о технологиях с их цветами и идентификаторами
 */
export const TECH_ICONS: IconData[] = [
  { name: 'html5', id: 'icon-html5', color: '#E34F26' },
  { name: 'css3-alt', id: 'icon-css3-alt', color: '#1572B6' },
  { name: 'js', id: 'icon-js', color: '#F7DF1E' },
  { name: 'react', id: 'icon-react', color: '#61DAFB' },
  { name: 'node', id: 'icon-node', color: '#339933' },
  { name: 'git-alt', id: 'icon-git-alt', color: '#F05032' },
  { name: 'github', id: 'icon-github', color: '#181717' },
  { name: 'database', id: 'icon-database', color: '#4479A1' },
];

/**
 * Путь к SVG спрайту с технологическими иконками
 * Используется для загрузки иконок в спиральной анимации
 */
export const SVG_SPRITE_PATH = 'icons/tech-icons.svg';
