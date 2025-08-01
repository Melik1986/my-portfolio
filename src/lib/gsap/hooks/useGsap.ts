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
export function createElementTimeline(container: HTMLElement, selector = '[data-animate]'): gsap.core.Timeline {
  const elements = Array.from(container.querySelectorAll(selector));
  
  if (elements.length === 0) {
    return gsap.timeline({ paused: true });
  }

  const tl = gsap.timeline({ paused: true });

  elements.forEach((element) => {
    const config = parseAnimationData(element);
    if (!config) return;
    
    const params = {
      duration: config.duration ?? 1,
      delay: config.delay ?? 0,
      ease: config.ease ?? 'power1.out',
    };
    
    addAnimationToTimeline(tl, { element, animationType: config.animation, params });
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
  gsap.set(element, animationDef.from);

  if (animationType === 'svg-draw') {
    addSvgDrawAnimation(timeline, { element, params });
    return;
  }
  if (animationType === 'text-reveal') {
    addTextRevealAnimation(timeline, { element, params });
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
    timeline.set(pathElement, { strokeDasharray: pathLength, strokeDashoffset: pathLength }, 0);
    timeline.to(pathElement, {
      strokeDashoffset: 0,
      duration: params.duration,
      ease: params.ease,
      delay: params.delay,
    });
  });
}

/**
 * Добавляет анимацию раскрытия текста
 * Разбивает текст на символы и анимирует их появление
 */
function addTextRevealAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params } = config;
  const split = new SplitText(element, { type: 'words,chars' });
  timeline.from(split.chars, {
    duration: params.duration,
    ease: params.ease,
    y: 50,
    opacity: 0,
    stagger: 0.05,
    delay: params.delay,
  });
}

/**
 * Добавляет базовую анимацию элемента
 * Применяет стандартную анимацию from/to с пользовательскими параметрами
 */
function addBaseAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params, animationDef } = config;
  if (!animationDef) return;
  timeline.fromTo(element, animationDef.from, {
    ...animationDef.to,
    duration: animationDef.duration,
    ease: animationDef.ease,
    delay: params.delay,
  });
}
