export const AI_CONTENT_CONFIG = {
  /** Настройки анимации */
  animation: {
    /** Длительность горизонтальной анимации в секундах */
    horizontalDuration: 40,
    /** Длительность вертикальной анимации в секундах */
    verticalDuration: 20,
    /** Порог видимости для Intersection Observer */
    intersectionThreshold: 0.1,
    /** Отступ для Intersection Observer */
    intersectionRootMargin: '50px',
  },

  /** Настройки размеров */
  dimensions: {
    /** Высота горизонтальной бегущей строки */
    horizontalHeight: 60,
    /** Высота вертикальной бегущей строки */
    verticalHeight: 600,
    /** Ширина контейнера иконки */
    iconWidth: 210,
    /** Высота контейнера иконки (в vw) */
    iconHeight: '15vw',
    /** Максимальная ширина основного контейнера */
    maxContainerWidth: 1400,
    /** Отступы контейнера */
    containerPadding: 60,
  },

  /** Настройки цветов */
  colors: {
    /** Основной цвет фона */
    background: '#e4e4e4',
    /** Цвет фона горизонтальной бегущей строки */
    horizontalBackground: '#000',
    /** Цвет текста бегущей строки */
    textColor: '#ffffff',
    /** Цвет границы иконок */
    iconBorder: '#eaeaea',
    /** Цвет фона иконок */
    iconBackground: '#fff',
  },

  /** Настройки типографики */
  typography: {
    /** Основной шрифт */
    fontFamily: "'Roboto', sans-serif",
    /** Размер основного текста */
    fontSize: 16,
    /** Высота строки */
    lineHeight: 1.2,
    /** Размер заголовка */
    titleSize: 40,
    /** Размер подзаголовка */
    subtitleSize: 14,
    /** Размер параграфа */
    paragraphSize: 16,
  },

  /** Настройки отступов */
  spacing: {
    /** Отступ между элементами */
    gap: 30,
    /** Отступ между иконками */
    iconGap: 30,
    /** Отступ между текстом бегущей строки */
    textMargin: '8vw',
  },
} as const;

export type AiContentSectionConfigType = typeof AI_CONTENT_CONFIG;
