/**
 * Интерфейс конфигурации спиральной анимации
 * Определяет параметры движения и отображения иконок
 */
export interface SpiralConfig {
  numIcons: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  animationDuration: number;
  elementSpacing: number;
}

/**
 * Интерфейс данных иконки
 * Описывает технологическую иконку с идентификатором и цветом
 */
export interface IconData {
  name: string;
  id: string;
  color: string;
}

/**
 * Интерфейс спиральной иконки
 * Описывает SVG элемент иконки с позицией в спирали
 */
export interface SpiralIcon {
  element: SVGElement;
  index: number;
  offset: number;
}

/**
 * Интерфейс состояния спиральной анимации
 * Описывает текущее состояние инициализации и анимации
 */
export interface SpiralState {
  isInitialized: boolean;
  isAnimating: boolean;
  icons: SpiralIcon[];
}
