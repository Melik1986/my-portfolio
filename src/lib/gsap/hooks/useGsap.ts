'use client';

import { gsap } from 'gsap';
import { SplitText as GsapSplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AnimationConfig, AnimationType, GlobalSplitTextStorage, SplitText as SplitTextInstance } from '../types/gsap.types';
import { parseAnimationData } from '@/lib/gsap/utils/parseAnimationData';
import { getAnimationDefinition, AnimationDefinition } from '@/lib/gsap/config/animation.config';

gsap.registerPlugin(GsapSplitText, ScrollTrigger);

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
 * Очищает SplitText экземпляры для указанного контейнера
 * Должна вызываться при размонтировании компонента
 */
export function cleanupSplitTextInstances(container: HTMLElement): void {
  const globalStorage = globalThis as GlobalSplitTextStorage;
  if (!globalStorage.__splitTextInstances) return;

  const instances = globalStorage.__splitTextInstances;
  const textElements = container.querySelectorAll('[data-animation="text-reveal"]');
  textElements.forEach((element) => {
    const splitTextInstance = instances.get(element);
    if (splitTextInstance) {
      splitTextInstance.revert();
      instances.delete(element);
      
      // Сбрасываем инлайн-стили, которые могли остаться от GSAP
      gsap.set(element, { clearProps: 'all' });
    }
  });
}

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

    // Text-reveal анимации обрабатываются специальным образом

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

  // Если delay равен 0, используем "0" для одновременного старта
  const position = params.delay === 0 ? "0" : `${params.delay}`;

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
      position,
    );
  });
}

/**
 * Добавляет анимацию reveal для текстовых элементов
 * Использует SplitText.create() для совместимости с gsap.context
 */
function addTextRevealAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params } = config;
  if (!element || !element.textContent?.trim()) return;
  
  // Получаем или создаем SplitText для элемента, избегаем повторного сплита
  const storage = ((globalThis as unknown) as GlobalSplitTextStorage).__splitTextInstances ??= new WeakMap<Element, SplitTextInstance>();
  let splitText = storage.get(element);
  if (!splitText) {
    const gsapSplitText = new GsapSplitText(element, {
      type: 'lines',
      linesClass: 'line',
    });
    // Нормализуем тип для совместимости
    splitText = gsapSplitText as SplitTextInstance;
    storage.set(element, splitText);
  }
  
  // Показываем контейнер после создания SplitText
  gsap.set(element, { opacity: 1, visibility: 'visible' });
  
  const position = params.delay === 0 ? '0' : `${params.delay}`;
  
  // Проверяем наличие lines перед использованием
  if (splitText.lines && splitText.lines.length > 0) {
    // Устанавливаем начальное состояние для lines
    gsap.set(splitText.lines, { yPercent: 100, autoAlpha: 0 });
    
    timeline.to(
      splitText.lines,
      {
        duration: params.duration,
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.15,
        ease: params.ease,
      },
      position,
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

  // Если delay равен 0, используем "0" для одновременного старта
  // Иначе используем "${params.delay}" для абсолютного времени от начала таймлайна
  const position = params.delay === 0 ? "0" : `${params.delay}`;

  timeline.fromTo(
    element,
    {
      ...animationDef.from,
      autoAlpha: 0,
    },
    {
      ...animationDef.to,
      autoAlpha: 1,
      duration: animationDef.duration,
      ease: animationDef.ease,
    },
    position,
  );
}
