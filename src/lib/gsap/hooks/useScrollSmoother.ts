'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';

// Централизованная регистрация
ensureGSAPRegistered();

export interface ScrollSmootherInstance {
  kill: () => void;
  scrollTop: (value?: number) => number;
  scrollTo: (target: number | string | Element, smooth?: boolean, position?: string) => void;
}

interface UseScrollSmootherOptions {
  wrapper?: string;
  content?: string;
  smooth?: number;
  effects?: boolean;
  normalizeScroll?: boolean;
}

// Тип для ScrollTrigger
interface ScrollTriggerInstance {
  kill: () => void;
  trigger: Element;
}

/**
 * Глобальный хук для управления ScrollSmoother
 * Создает единственный экземпляр на все приложение
 */
// Вспомогательные функции вынесены за пределы хука
const checkElements = (
  wrapper: string,
  content: string,
): { wrapperElement: Element | null; contentElement: Element | null } => {
  const wrapperElement = document.querySelector(wrapper);
  const contentElement = document.querySelector(content);
  return { wrapperElement, contentElement };
};

const createSmoother = (
  options: UseScrollSmootherOptions & { wrapperElement: Element; contentElement: Element },
): ScrollSmootherInstance | null => {
  try {
    // Проверяем, существует ли уже экземпляр
    const existingSmoother = ScrollSmoother.get();
    if (existingSmoother) {
      return existingSmoother;
    }

    const smoother = ScrollSmoother.create({
      wrapper: options.wrapperElement,
      content: options.contentElement,
      smooth: options.smooth,
      effects: options.effects,
      normalizeScroll: options.normalizeScroll,
    });

    return smoother;
  } catch {
    return null;
  }
};

// Функция для синхронизации ScrollTrigger
const syncScrollTrigger = async (): Promise<void> => {
  try {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    if (ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
      // Обновляем все существующие ScrollTrigger для синхронизации с ScrollSmoother
      ScrollTrigger.refresh();

      // Дополнительная проверка - убеждаемся, что все триггеры синхронизированы
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  } catch {
    // ScrollTrigger может быть не зарегистрирован
  }
};

interface InitParams {
  wrapper: string;
  content: string;
  options: UseScrollSmootherOptions;
  smootherRef: React.RefObject<ScrollSmootherInstance | null>;
  isInitializingRef: React.RefObject<boolean>;
  onReady?: () => void;
}

const initScrollSmoother = ({
  wrapper,
  content,
  options,
  smootherRef,
  isInitializingRef,
  onReady,
}: InitParams) => {
  if (smootherRef.current || isInitializingRef.current) return;

  isInitializingRef.current = true;
  const { wrapperElement, contentElement } = checkElements(wrapper, content);

  if (!wrapperElement || !contentElement) {
    isInitializingRef.current = false;
    return;
  }

  smootherRef.current = createSmoother({
    wrapperElement,
    contentElement,
    ...options,
  });

  if (smootherRef.current) {
    // ✅ ПРАВИЛЬНАЯ СИНХРОНИЗАЦИЯ для CardDeck эффекта
    // 1. Сначала инициализируем ScrollSmoother
    // 2. Затем обновляем ScrollTrigger для синхронизации с виртуальным скроллом
    // 3. Используем больший timeout для полной инициализации
    setTimeout(() => {
      syncScrollTrigger();
      // Уведомляем о готовности после полной инициализации
      onReady?.();
    }, 100);
  }
  isInitializingRef.current = false;
};

// Проверка готовности DOM
const checkDOMReady = (wrapper: string, content: string) => {
  const elements = checkElements(wrapper, content);
  return elements.wrapperElement && elements.contentElement;
};

// Функция для очистки ScrollTrigger
const cleanupScrollTrigger = async (): Promise<void> => {
  try {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    if (ScrollTrigger && typeof ScrollTrigger.getAll === 'function') {
      const triggers = ScrollTrigger.getAll() as ScrollTriggerInstance[];
      triggers.forEach((trigger) => trigger.kill());
    }
  } catch {
    // ScrollTrigger может быть не зарегистрирован
  }
};

// (deprecated) useSmootherInitialization removed in favor of createSmootherEffect

// Helper functions to reduce createSmootherEffect size
const isPreloaderActive = (): boolean =>
  document.documentElement.classList.contains('preload-lock') ||
  document.body.classList.contains('preload-lock');

const setupPreloaderListener = (tryInit: () => void): (() => void) => {
  const onPreloaderDone = () => {
    tryInit();
    document.removeEventListener('preloader:complete', onPreloaderDone);
  };
  document.addEventListener('preloader:complete', onPreloaderDone, { once: true });
  return () => document.removeEventListener('preloader:complete', onPreloaderDone);
};

const setupDelayedInit = (tryInit: () => void): (() => void) => {
  const timer = setTimeout(tryInit, 50);
  return () => clearTimeout(timer);
};

function createSmootherEffect(config: {
  wrapper: string;
  content: string;
  smooth: number;
  effects: boolean;
  normalizeScroll: boolean;
  smootherRef: React.RefObject<ScrollSmootherInstance | null>;
  isInitializingRef: React.RefObject<boolean>;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}): () => void {
  const {
    wrapper,
    content,
    smooth,
    effects,
    normalizeScroll,
    smootherRef,
    isInitializingRef,
    setIsReady,
  } = config;
  
  const existingSmoother = ScrollSmoother.get();
  if (existingSmoother) {
    smootherRef.current = existingSmoother as unknown as ScrollSmootherInstance;
    setIsReady(true);
    return () => {};
  }

  const tryInit = () => {
    if (!checkDOMReady(wrapper, content)) return;
    initScrollSmoother({
      wrapper,
      content,
      options: { smooth, effects, normalizeScroll },
      smootherRef,
      isInitializingRef,
      onReady: () => setIsReady(true),
    });
  };

  const cleanup = isPreloaderActive()
    ? setupPreloaderListener(tryInit)
    : setupDelayedInit(tryInit);

  return () => cleanup();
}

/**
 * Управляет CSS-классами готовности для ScrollSmoother
 */
const useSmootherReadyState = (isReady: boolean) => {
  useEffect(() => {
    if (!isReady) return;
    try {
      document.documentElement.classList.add('smoother-ready');
      document.dispatchEvent(new Event('smoother:ready'));
    } catch {
      // ignore
    }
    return () => {
      try {
        document.documentElement.classList.remove('smoother-ready');
      } catch {
        // ignore
      }
    };
  }, [isReady]);
};

/**
 * Создает методы управления скроллом
 */
const createScrollMethods = (smootherRef: React.RefObject<ScrollSmootherInstance | null>) => {
  const scrollTo = (target: string | number | Element, smooth?: boolean, position?: string) => {
    smootherRef.current?.scrollTo(target, smooth, position);
  };

  const scrollTop = (value?: number) => smootherRef.current?.scrollTop(value) ?? 0;

  const kill = () => {
    if (smootherRef.current) {
      // ИСПРАВЛЕНИЕ: Очищаем связанные ScrollTrigger перед уничтожением
      cleanupScrollTrigger();

      smootherRef.current.kill();
      smootherRef.current = null;
      try {
        document.documentElement.classList.remove('smoother-ready');
      } catch {
        // ignore
      }
    }
  };

  return { scrollTo, scrollTop, kill };
};

export const useScrollSmoother = (options: UseScrollSmootherOptions = {}) => {
  const smootherRef = useRef<ScrollSmootherInstance | null>(null);
  const isInitializingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const {
    wrapper = '#smooth-wrapper',
    content = '#smooth-content',
    smooth = 1.5,
    effects = true,
    normalizeScroll = true,
  } = options;

  useEffect(
    () =>
      createSmootherEffect({
        wrapper,
        content,
        smooth,
        effects,
        normalizeScroll,
        smootherRef,
        isInitializingRef,
        setIsReady,
      }),
    [wrapper, content, smooth, effects, normalizeScroll],
  );

  useSmootherReadyState(isReady);
  const { scrollTo, scrollTop, kill } = createScrollMethods(smootherRef);

  return {
    smoother: smootherRef.current,
    isReady,
    scrollTo,
    scrollTop,
    kill,
  };
};
