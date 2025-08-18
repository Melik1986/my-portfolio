import { AI_CONTENT_CONFIG } from '../config/AiContent.config';

/**
 * Генерирует уникальный ключ для элементов списка
 * @param index - Индекс элемента
 * @param prefix - Префикс для ключа
 * @returns Уникальный ключ
 */
export const generateKey = (index: number, prefix: string = ''): string => {
  return `${prefix}${index}`;
};

/**
 * Проверяет, является ли элемент последним в массиве
 * @param index - Индекс элемента
 * @param arrayLength - Длина массива
 * @returns true, если элемент последний
 */
export const isLastElement = (index: number, arrayLength: number): boolean => {
  return index === arrayLength - 1;
};

/**
 * Получает CSS переменные для анимации
 * @param duration - Длительность анимации в секундах
 * @returns Объект с CSS переменными
 */
export const getAnimationVariables = (duration: number) => ({
  '--animation-duration': `${duration}s`,
});

/**
 * Форматирует размеры согласно конфигурации
 * @param width - Ширина в пикселях
 * @param height - Высота в пикселях или vw
 * @returns Объект с размерами
 */
export const getIconDimensions = (width: number, height: string | number) => ({
  width: `${width}px`,
  height: typeof height === 'string' ? height : `${height}px`,
});

/**
 * Создает массив с повторяющимися элементами
 * @param item - Элемент для повторения
 * @param count - Количество повторений
 * @returns Массив с повторяющимися элементами
 */
export const createRepeatedArray = <T>(item: T, count: number): T[] => {
  return Array(count).fill(item);
};

/**
 * Получает настройки анимации из конфигурации
 * @returns Объект с настройками анимации
 */
export const getAnimationConfig = () => ({
  horizontal: AI_CONTENT_CONFIG.animation.horizontalDuration,
  vertical: AI_CONTENT_CONFIG.animation.verticalDuration,
  threshold: AI_CONTENT_CONFIG.animation.intersectionThreshold,
  rootMargin: AI_CONTENT_CONFIG.animation.intersectionRootMargin,
});
