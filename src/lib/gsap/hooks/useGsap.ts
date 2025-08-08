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
 * Использует правильный синтаксис SplitText.create() согласно документации GSAP
 */
function addTextRevealAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params } = config;
  if (!element || !element.textContent?.trim()) return;
  
  gsap.set(element, { opacity: 1 });
  
  const splitText = SplitText.create(element, {
    type: 'lines',
    linesClass: 'line',
    autoSplit: true,
    mask: 'lines',
  });
  
  // Добавляем анимацию в timeline с правильными параметрами
  timeline.from(
    splitText.lines,
    {
      duration: params.duration,
      yPercent: 100,
      opacity: 0,
      stagger: 0.15,
      ease: params.ease,
    },
    `>=${params.delay}`,
  );
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
