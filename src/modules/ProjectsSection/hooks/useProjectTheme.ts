'use client';

import { useEffect } from 'react';
import { ProjectTheme } from '../types/projects-catalog';

/**
 * Хук для применения динамических цветовых тем к проекту
 * Устанавливает CSS-переменные для кастомизации цветов текста, заголовков и элементов управления
 */
export function useProjectTheme(theme?: ProjectTheme, containerId?: string) {
  useEffect(() => {
    if (!theme) return;

    // Получаем контейнер для применения стилей
    const container = containerId ? document.getElementById(containerId) : document.documentElement;

    if (!container) return;

    // Применяем CSS-переменные для темы
    const applyThemeVariables = () => {
      if (theme.textColor) {
        container.style.setProperty('--project-text-color', theme.textColor);
      }
      if (theme.titleColor) {
        container.style.setProperty('--project-title-color', theme.titleColor);
      }
      if (theme.closeButtonColor) {
        container.style.setProperty('--project-close-color', theme.closeButtonColor);
      }
    };

    applyThemeVariables();

    // Очистка при размонтировании или изменении темы
    return () => {
      if (containerId) {
        // Для конкретного контейнера очищаем переменные
        container.style.removeProperty('--project-text-color');
        container.style.removeProperty('--project-title-color');
        container.style.removeProperty('--project-close-color');
      }
    };
  }, [theme, containerId]);

  /**
   * Получить объект стилей для прямого применения к элементу
   * Полезно для случаев, когда CSS-переменные недоступны
   */
  const getThemeStyles = () => {
    if (!theme) return {};

    return {
      '--project-text-color': theme.textColor,
      '--project-title-color': theme.titleColor,
      '--project-close-color': theme.closeButtonColor,
    } as React.CSSProperties;
  };

  return { getThemeStyles };
}

/**
 * Предустановленные цветовые темы для быстрого использования
 */
export const PRESET_THEMES = {
  light: {
    textColor: '#292929',
    titleColor: '#292929',
    closeButtonColor: '#292929',
  },
  dark: {
    textColor: '#ffffff',
    titleColor: '#ffffff',
    closeButtonColor: '#ffffff',
  },
  accent: {
    textColor: '#292929',
    titleColor: 'var(--palette-primary)',
    closeButtonColor: 'var(--palette-primary)',
  },
} as const satisfies Record<string, ProjectTheme>;
