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
  console.log('🎬 Creating element timeline for container:', {
    container: container.id || container.className,
    containerRect: container.getBoundingClientRect(),
  });

  const elements = Array.from(container.querySelectorAll(selector));

  console.log('🔍 Found elements with data-animation:', {
    count: elements.length,
    elements: elements.map((el) => ({
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      animation: el.getAttribute('data-animation'),
      rect: el.getBoundingClientRect(),
    })),
  });

  if (elements.length === 0) {
    return gsap.timeline({ paused: true });
  }

  const tl = gsap.timeline({ paused: true });

  elements.forEach((element, index) => {
    console.log(`🎯 Processing element ${index + 1}/${elements.length}:`, {
      element: element.tagName,
      className: element.className,
      animation: element.getAttribute('data-animation'),
    });

    const config = parseAnimationData(element);
    if (!config) return;

    const params = {
      duration: config.duration ?? 1,
      delay: config.delay ?? 0,
      ease: config.ease ?? 'power1.out',
    };

    addAnimationToTimeline(tl, { element, animationType: config.animation, params });
  });

  console.log('✅ Timeline created:', {
    duration: tl.duration(),
    paused: tl.paused(),
    progress: tl.progress(),
    totalAnimations: elements.length,
  });

  return tl;
}

/**
 * Добавляет анимацию для одного элемента в timeline по типу анимации
 * Выбирает подходящий метод анимации в зависимости от типа
 */
function addAnimationToTimeline(timeline: gsap.core.Timeline, config: AddAnimationConfig) {
  const { element, animationType, params } = config;

  console.log('🎭 Adding animation to timeline:', {
    element: element.tagName,
    className: element.className,
    animationType,
    delay: params.delay,
    duration: params.duration,
    ease: params.ease,
  });

  const animationDef = getAnimationDefinition(animationType, params);

  if (!animationDef) {
    console.warn(`❌ Animation type "${animationType}" not found in definitions`);
    return;
  }

  console.log('📋 Animation config found:', {
    animationType,
    config: animationDef,
    fromState: animationDef.from,
    toState: animationDef.to,
  });

  // Не устанавливаем начальное состояние заранее - fromTo() сделает это при запуске
  console.log('🎯 Animation will be applied on timeline play:', {
    element: element.tagName,
    fromState: animationDef.from,
  });

  if (animationType === 'svg-draw') {
    addSvgDrawAnimation(timeline, { element, params });
    return;
  }
  if (animationType === 'text-reveal') {
    addTextRevealAnimation(timeline, { element, params });
    return;
  }

  console.log('➕ Adding base animation to timeline:', {
    element: element.tagName,
    timelineDurationBefore: timeline.duration(),
  });

  addBaseAnimation(timeline, { element, params, animationDef });

  console.log('✅ Animation added to timeline:', {
    element: element.tagName,
    timelineDurationAfter: timeline.duration(),
    timelineProgress: timeline.progress(),
  });
}

/**
 * Добавляет анимацию рисования SVG элементов
 * Анимирует stroke-dashoffset для эффекта рисования
 * Анимации добавляются параллельно с учетом индивидуальных задержек
 */
function addSvgDrawAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params } = config;
  const pathElements = element.querySelectorAll('path');
  pathElements.forEach((pathElement: Element) => {
    const pathLength = (pathElement as SVGPathElement).getTotalLength();
    timeline.set(pathElement, { strokeDasharray: pathLength, strokeDashoffset: pathLength }, 0);
    timeline.to(
      pathElement,
      {
        strokeDashoffset: 0,
        duration: params.duration,
        ease: params.ease,
        onComplete: () => {
          console.log('✅ SVG draw animation completed for element:', element);
        },
      },
      params.delay,
    );
  });
}

/**
 * Добавляет анимацию раскрытия текста
 * Разбивает текст на символы и анимирует их появление
 * Анимации добавляются параллельно с учетом индивидуальных задержек
 */
function addTextRevealAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params } = config;
  const split = new SplitText(element, { type: 'words,chars' });
  timeline.from(
    split.chars,
    {
      duration: params.duration,
      ease: params.ease,
      y: 50,
      opacity: 0,
      stagger: 0.05,
      onComplete: () => {
        console.log('✅ Text reveal animation completed for element:', element);
      },
    },
    params.delay,
  );
}

/**
 * Добавляет базовую анимацию элемента
 * Применяет стандартную анимацию from/to с пользовательскими параметрами
 * Анимации добавляются параллельно с учетом индивидуальных задержек
 */
function addBaseAnimation(timeline: gsap.core.Timeline, config: ElementAnimationConfig) {
  const { element, params, animationDef } = config;
  if (!animationDef) return;

  const animationProps = {
    ...animationDef.to,
    duration: animationDef.duration,
    ease: animationDef.ease,
  };

  console.log('🎬 Adding base animation:', {
    element: element.tagName,
    className: element.className,
    animationProps,
    delay: params.delay,
    timelineDurationBefore: timeline.duration(),
  });

  // Добавляем анимацию параллельно с позицией, основанной на задержке
  // Это позволяет анимациям выполняться параллельно, но с разными стартовыми временами
  timeline.fromTo(
    element,
    animationDef.from,
    {
      ...animationProps,
    },
    params.delay,
  );

  console.log('✅ Base animation added:', {
    element: element.tagName,
    timelineDurationAfter: timeline.duration(),
    timelineChildren: timeline.getChildren().length,
  });
}
