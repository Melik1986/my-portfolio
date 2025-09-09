'use client';

import { ProjectData } from '../types/projects-catalog';

/**
 * Утилита для выбора подходящего изображения на основе устройства и ориентации
 * @param project - данные проекта
 * @returns путь к изображению (мобильное или обычное)
 */
export function getMobileImage(project: ProjectData): string {
  // Проверяем, что код выполняется в браузере
  if (typeof window === 'undefined') {
    return project.fullImage;
  }

  // Определяем мобильное устройство по ширине экрана
  const isMobile = window.matchMedia?.('(max-width: 1224px)').matches || window.innerWidth <= 1224;

  // Проверяем ориентацию устройства
  const isPortrait = window.innerHeight > window.innerWidth;

  // Используем мобильное изображение если:
  // 1. Устройство мобильное
  // 2. Есть мобильное изображение
  // 3. Устройство в портретной ориентации (оптимально для 9:16)
  const shouldUseMobileImage = isMobile && project.mobileFullImage && isPortrait;

  return shouldUseMobileImage ? project.mobileFullImage! : project.fullImage;
}
