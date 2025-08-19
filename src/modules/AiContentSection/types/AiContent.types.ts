export interface AiContentProps {
  /** Массив текстов для горизонтальных бегущих строк */
  horizontalTexts?: string[];
  /** Массив колонок с изображениями (каждая колонка — массив путей изображений) */
  verticalColumns?: string[][];
  /** Deprecated: Массив URL иконок для вертикальных бегущих строк (для обратной совместимости) */
  verticalIcons?: string[];
  /** Подзаголовок контента */
  subtitle?: string;
  /** Основной заголовок контента */
  title?: string;
  /** Описание контента */
  description?: string;
  /** Дополнительные CSS классы */
  className?: string;
}

export interface MarqueeAnimationState {
  /** Флаг видимости элемента */
  isVisible: boolean;
  /** Флаг активности анимации */
  isActive: boolean;
}
