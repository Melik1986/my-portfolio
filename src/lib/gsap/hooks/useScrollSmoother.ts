'use client';

import { useEffect, useRef } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { gsap } from 'gsap';

// Регистрируем плагин
gsap.registerPlugin(ScrollSmoother);

interface ScrollSmootherInstance {
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
  if (!wrapperElement || !contentElement) {
    console.warn(
      `ScrollSmoother: DOM elements not found. Wrapper: ${wrapper}, Content: ${content}`,
    );
  }
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

    return ScrollSmoother.create({
      wrapper: options.wrapperElement,
      content: options.contentElement,
      smooth: options.smooth,
      effects: options.effects,
      normalizeScroll: options.normalizeScroll,
    });
  } catch (error) {
    console.error('Failed to initialize ScrollSmoother:', error);
    return null;
  }
};

interface InitParams {
  wrapper: string;
  content: string;
  options: UseScrollSmootherOptions;
  smootherRef: React.RefObject<ScrollSmootherInstance | null>;
  isInitializingRef: React.RefObject<boolean>;
}

const initScrollSmoother = ({
  wrapper,
  content,
  options,
  smootherRef,
  isInitializingRef,
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
    // Убираем лишнее логирование
  }
  isInitializingRef.current = false;
};

// Проверка готовности DOM
const checkDOMReady = (wrapper: string, content: string) => {
  const elements = checkElements(wrapper, content);
  return elements.wrapperElement && elements.contentElement;
};

export const useScrollSmoother = (options: UseScrollSmootherOptions = {}) => {
  const smootherRef = useRef<ScrollSmootherInstance | null>(null);
  const isInitializingRef = useRef(false);
  const {
    wrapper = '#smooth-wrapper',
    content = '#smooth-content',
    smooth = 1.5,
    effects = true,
    normalizeScroll = true,
  } = options;

  // eslint-disable-next-line react-hooks/exhaustive-deps // Удаляем, если deps полные
  useEffect(() => {
    const existingSmoother = ScrollSmoother.get();
    if (existingSmoother) {
      smootherRef.current = existingSmoother;
      return;
    }

    const timer = setTimeout(() => {
      if (checkDOMReady(wrapper, content)) {
        initScrollSmoother({
          wrapper,
          content,
          options: { smooth, effects, normalizeScroll },
          smootherRef,
          isInitializingRef,
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [wrapper, content, smooth, effects, normalizeScroll]);

  const scrollTo = (target: string | number | Element, smooth?: boolean, position?: string) => {
    smootherRef.current?.scrollTo(target, smooth, position);
  };

  const scrollTop = (value?: number) => smootherRef.current?.scrollTop(value) ?? 0;

  const kill = () => {
    smootherRef.current?.kill();
    smootherRef.current = null;
  };

  return {
    smoother: smootherRef.current,
    isReady: !!smootherRef.current,
    scrollTo,
    scrollTop,
    kill,
  };
};
