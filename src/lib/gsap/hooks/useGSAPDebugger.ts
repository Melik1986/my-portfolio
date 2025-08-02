'use client';

import { useEffect } from 'react';
import { gsapDebugger } from '../utils/gsapDebugger';

/**
 * Хук для отладки GSAP анимаций
 * Автоматически запускает анализ при монтировании компонента
 */
export const useGSAPDebugger = (enabled: boolean = process.env.NODE_ENV === 'development') => {
  useEffect(() => {
    if (!enabled) return;

    // Небольшая задержка для инициализации GSAP
    const timer = setTimeout(() => {
      gsapDebugger.runFullAnalysis();
    }, 1000);

    return () => {
      clearTimeout(timer);
      gsapDebugger.removeDebugPanel();
    };
  }, [enabled]);

  return {
    debugger: gsapDebugger,
    analyzeStyles: () => gsapDebugger.analyzePortfolioStyles(),
    logScrollTriggers: () => gsapDebugger.logScrollTriggerDetails(),
    createPanel: () => gsapDebugger.createDebugPanel(),
    removePanel: () => gsapDebugger.removeDebugPanel(),
  };
};