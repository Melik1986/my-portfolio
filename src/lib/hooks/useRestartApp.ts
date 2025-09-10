'use client';

import { useCallback, useEffect } from 'react';

/**
 * Хук для перезапуска приложения в случае критических ошибок
 * Предоставляет безопасный способ перезагрузки страницы с очисткой состояния
 */
export const useRestartApp = () => {
  const restartApp = useCallback(() => {
    try {
      // Очищаем localStorage от потенциально поврежденных данных
      if (typeof window !== 'undefined' && window.localStorage) {
        // Сохраняем только критически важные данные
        const themeData = localStorage.getItem('theme');
        const localeData = localStorage.getItem('locale');

        // Очищаем все данные
        localStorage.clear();

        // Восстанавливаем критически важные данные
        if (themeData) localStorage.setItem('theme', themeData);
        if (localeData) localStorage.setItem('locale', localeData);
      }

      // Очищаем sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.clear();
      }

      // Перезагружаем страницу с принудительной очисткой кэша
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      // Если даже перезагрузка не работает, пытаемся перенаправить на главную
      console.error('Failed to restart app:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }, []);

  // Слушаем критические ошибки анимации
  useEffect(() => {
    const handleAnimationError = () => {
      console.warn('Critical animation error detected, restarting app...');
      restartApp();
    };

    window.addEventListener('animation-critical-error', handleAnimationError);

    return () => {
      window.removeEventListener('animation-critical-error', handleAnimationError);
    };
  }, [restartApp]);

  return { restartApp };
};
