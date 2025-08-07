'use client';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { AnimationType } from '@/lib/gsap/types/gsap.types';
import { parseAnimationData } from '@/lib/gsap/utils/parseAnimationData';
import { getAnimationDefinition, AnimationDefinition } from '@/lib/gsap/config/animation.config';

gsap.registerPlugin(SplitText);

/**
 * Параметры анимации для элементов
 */
type ElementAnimationParams = {
  duration: number;
  ease: string;
  delay: number;
};

/**
 * Конфигурация анимации для одного элемента
 */
type ElementAnimationConfig = {
  element: Element;
  params: ElementAnimationParams;
  animationDef?: AnimationDefinition;
};

/**
 * Конфигурация для добавления анимации в timeline
 */
type AddAnimationConfig = {
  element: Element;
  animationType: AnimationType;
  params: ElementAnimationParams;
};

/**
 * Функция для создания timeline с анимациями элементов в контейнере
 * Создает timeline без ScrollTrigger для управления извне
 */
export function createElementTimeline(
  container: HTMLElement,
  selector = '[data-animate], [data-animation]',
): gsap.core.Timeline {
  const elements = Array.from(container.querySelectorAll(selector));

  if (elements.length === 0) {
    return gsap.timeline({ paused: true });
  }

  const tl = gsap.timeline({ paused: true });

  // Сортируем элементы по задержке для последовательного выполнения
  const sortedElements = elements
    .map((element) => {
      const config = parseAnimationData(element);
      return {
        element,
        config,
        delay: config?.delay ?? 0,
      };
    })
    .filter((item) => item.config)
    .sort((a, b) => a.delay - b.delay);

  sortedElements.forEach((item) => {
    const params = {
      duration: item.config!.duration ?? 1,
      delay: item.delay,
      ease: item.config!.ease ?? 'power1.out',
    };

    // Логируем только text-reveal анимации
    if (item.config!.animation === 'text-reveal') {
      console.log('🎭 Text-reveal animation found:', {
        element: item.element.tagName,
        className: item.element.className,
        textContent: item.element.textContent?.substring(0, 50) + '...',
        params,
      });
    }

    addAnimationToTimeline(tl, {
      element: item.element,
      animationType: item.config!.animation,
      params,
    });
  });

  return tl;
}

/**
 * Добавляет анимацию для одного элемента в timeline по типу анимации
 * Выбирает подходящий метод анимации в зависимости от типа
 */
function addAnimationToTimeline(timeline: gsap.core.Timeline, config: AddAnimationConfig) {
  const { element, animationType, params } = config;

  const animationDef = getAnimationDefinition(animationType, params);

  if (!animationDef) {
    return;
  }

  if (animationType === 'svg-draw') {
    addSvgDrawAnimation(timeline, { element, params });
    return;
  }
  if (animationType === 'text-reveal') {
    console.log('📝 Processing text-reveal animation:', {
      element: element.tagName,
      className: element.className,
      delay: params.delay,
      duration: params.duration,
    });
    addTextRevealAnimation(timeline, { element, params, animationDef });
    return;
  }

  addBaseAnimation(timeline, { element, params, animationDef });
}

/**
 * Добавляет анимацию рисования SVG элементов
 * Анимирует stroke-dashoffset для эффекта рисования
 */
function addSvgDrawAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params } = config;
  const pathElements = element.querySelectorAll('path');

  pathElements.forEach((pathElement: Element) => {
    const pathLength = (pathElement as SVGPathElement).getTotalLength();
    timeline.set(pathElement, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    timeline.to(
      pathElement,
      {
        strokeDashoffset: 0,
        duration: params.duration,
        ease: params.ease,
      },
      `>=${params.delay}`,
    );
  });
}

/**
 * Добавляет анимацию reveal для текстовых элементов
 * Использует правильный синтаксис SplitText согласно документации GSAP
 */
function addTextRevealAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params, animationDef } = config;

  console.log('🔧 Starting SplitText for text-reveal:', {
    element: element.tagName,
    textContent: element.textContent?.substring(0, 50) + '...',
  });

  // Проверяем наличие элемента и текстового содержимого
  if (!element || !element.textContent?.trim()) {
    console.warn('SplitText: элемент не найден или пустой');
    return;
  }

  // Используем состояния из animationDefinitions
  const fromState = animationDef?.from || { opacity: 0, y: 20 };
  const toState = animationDef?.to || { opacity: 1, y: 0 };

  try {
    // Создаем SplitText с правильными опциями согласно документации
    const split = new SplitText(element, {
      type: 'chars,words,lines',
      charsClass: 'char',
      wordsClass: 'word',
      linesClass: 'line',
    });

    console.log('✅ SplitText complete:', {
      charsCount: split.chars?.length || 0,
      wordsCount: split.words?.length || 0,
      linesCount: split.lines?.length || 0,
    });

    // Проверяем успешность разбивки
    if (!split.chars || split.chars.length === 0) {
      console.warn('SplitText: разбивка не удалась');
      split.revert();
      return;
    }

    // Устанавливаем начальное состояние для всех символов
    gsap.set(split.chars, fromState);

    // Вычисляем адаптивный stagger на основе количества символов
    const baseDuration = params.duration || animationDef?.duration || 1;
    const maxStaggerDuration = 0.3; // Максимальная длительность stagger
    const adaptiveStagger = Math.min(maxStaggerDuration / split.chars.length, 0.05);

    console.log('📊 Adding text-reveal to timeline:', {
      charsCount: split.chars.length,
      duration: baseDuration,
      adaptiveStagger,
      delay: params.delay,
    });

    // Добавляем анимацию в timeline
    timeline.to(
      split.chars,
      {
        ...toState,
        duration: baseDuration,
        ease: params.ease || animationDef?.ease || 'power2.out',
        stagger: {
          amount: adaptiveStagger * split.chars.length,
          from: 'start',
        },
      },
      `>=${params.delay || 0}`,
    );

    console.log('✅ Text-reveal animation added to timeline');
  } catch (error) {
    console.error('SplitText ошибка:', error);

    // В случае ошибки применяем обычную анимацию
    timeline.fromTo(
      element,
      fromState,
      {
        ...toState,
        duration: params.duration || animationDef?.duration || 1,
        ease: params.ease || animationDef?.ease || 'power2.out',
      },
      `>=${params.delay || 0}`,
    );
  }
}

/**
 * Добавляет базовую анимацию элемента
 * Применяет стандартную анимацию from/to с пользовательскими параметрами
 */
function addBaseAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params, animationDef } = config;
  if (!animationDef) return;

  timeline.fromTo(
    element,
    animationDef.from,
    {
      ...animationDef.to,
      duration: animationDef.duration,
      ease: animationDef.ease,
    },
    `>=${params.delay}`,
  );
}
