'use client';

import { gsap } from 'gsap';
import { SplitText as GsapSplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type {
  AnimationType,
  GlobalSplitTextStorage,
  SplitText as SplitTextInstance,
} from '../types/gsap.types';
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
  stagger?: number;
  groupDelay?: number;
  sectionId?: string;
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

// Функция для парсинга элементов
const parseElements = (elements: Element[], container: HTMLElement) => {
  return elements
    .map((element) => {
      const config = parseAnimationData(element);
      // Используем переданный container как источник sectionId
      // Это исправляет проблему с дублированием data-section-index
      const sectionId =
        container.getAttribute('data-section') ||
        container.getAttribute('data-section-index') ||
        container.id ||
        'default';
      return {
        element,
        config,
        delay: config?.delay ?? 0,
        groupDelay: config?.groupDelay ?? 0,
        stagger: config?.stagger ?? 0,
        sectionId,
      };
    })
    .filter((item) => item.config);
};

// Функция для группировки по секциям
const groupBySections = (parsedElements: ReturnType<typeof parseElements>) => {
  const sections = new Map<string, typeof parsedElements>();
  parsedElements.forEach((item) => {
    if (!sections.has(item.sectionId)) {
      sections.set(item.sectionId, []);
    }
    sections.get(item.sectionId)!.push(item);
  });
  return sections;
};

// Функция для сортировки секций
const sortSections = (sections: Map<string, ReturnType<typeof parseElements>>) => {
  return Array.from(sections.entries()).sort(([, a], [, b]) => {
    const minGroupDelayA = Math.min(...a.map((item) => item.groupDelay));
    const minGroupDelayB = Math.min(...b.map((item) => item.groupDelay));
    return minGroupDelayA - minGroupDelayB;
  });
};

// Функция для обработки одной секции
const processSection = (
  timeline: gsap.core.Timeline,
  sectionElements: ReturnType<typeof parseElements>,
  sectionStartTime: number,
) => {
  // В каждой секции группируем по groupDelay
  const groups = new Map<number, typeof sectionElements>();
  sectionElements.forEach((item) => {
    if (!groups.has(item.groupDelay)) {
      groups.set(item.groupDelay, []);
    }
    groups.get(item.groupDelay)!.push(item);
  });

  // Сортируем группы по groupDelay
  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a - b);

  sortedGroups.forEach(([groupDelay, groupElements]) => {
    const groupStartTime = sectionStartTime + groupDelay;

    // Сортируем элементы в группе по delay
    const sortedGroupElements = groupElements.sort((a, b) => a.delay - b.delay);

    sortedGroupElements.forEach((item, index) => {
      const params = {
        duration: item.config!.duration ?? 1,
        delay: item.delay,
        ease: item.config!.ease ?? 'power1.out',
        stagger: item.stagger,
        groupDelay: item.groupDelay,
      };

      // Определяем позицию в timeline с учетом stagger
      const staggerDelay = item.stagger > 0 ? index * item.stagger : 0;
      const elementPosition = groupStartTime + item.delay + staggerDelay;

      addAnimationToTimeline(
        timeline,
        {
          element: item.element,
          animationType: item.config!.animation,
          params,
        },
        elementPosition,
      );
    });
  });

  // Возвращаем время для следующей секции
  const maxGroupDelay = Math.max(...sectionElements.map((item) => item.groupDelay));
  const maxElementTime = Math.max(
    ...sectionElements.map((item) => item.delay + (item.config?.duration ?? 1)),
  );
  return maxGroupDelay + maxElementTime;
};

/**
 * Функция для создания timeline с анимациями элементов в контейнере
 * Создает timeline без ScrollTrigger для управления извне
 */
export function createElementTimeline(
  container: HTMLElement,
  selector = '[data-animate], [data-animation]',
): gsap.core.Timeline {
  // Ищем элементы только внутри переданного контейнера для изоляции анимаций
  const elements = Array.from(container.querySelectorAll(selector));

  if (elements.length === 0) {
    return gsap.timeline({ paused: true });
  }

  const tl = gsap.timeline({ paused: true });

  // Парсим элементы и группируем по секциям
  const parsedElements = parseElements(elements, container);
  const sections = groupBySections(parsedElements);
  const sortedSections = sortSections(sections);

  let sectionStartTime = 0;

  sortedSections.forEach(([, sectionElements]) => {
    const sectionDuration = processSection(tl, sectionElements, sectionStartTime);
    sectionStartTime += sectionDuration;
  });

  return tl;
}

/**
 * Добавляет анимацию для одного элемента в timeline по типу анимации
 * Выбирает подходящий метод анимации в зависимости от типа
 */
function addAnimationToTimeline(
  timeline: gsap.core.Timeline,
  config: AddAnimationConfig,
  position?: number | string,
) {
  const { element, animationType, params } = config;

  const animationDef = getAnimationDefinition(animationType, params);

  if (!animationDef) {
    return;
  }

  // Если позиция не передана, используем стандартную логику
  const timelinePosition =
    position !== undefined ? position : params.delay === 0 ? '0' : `${params.delay}`;

  if (animationType === 'svg-draw') {
    addSvgDrawAnimation(timeline, { element, params }, timelinePosition);
    return;
  }
  if (animationType === 'text-reveal') {
    addTextRevealAnimation(timeline, { element, params, animationDef }, timelinePosition);
    return;
  }

  addBaseAnimation(timeline, { element, params, animationDef }, timelinePosition);
}

/**
 * Получает или создает SplitText экземпляр для элемента
 */
function getSplitTextInstance(element: HTMLElement): SplitTextInstance | null {
  const storage = ((globalThis as unknown as GlobalSplitTextStorage).__splitTextInstances ??=
    new WeakMap<Element, SplitTextInstance>());
  let splitText = storage.get(element);
  if (!splitText) {
    const gsapSplitText = new GsapSplitText(element, {
      type: 'lines',
      linesClass: 'line',
    });
    splitText = gsapSplitText as SplitTextInstance;
    storage.set(element, splitText);
  }
  return splitText;
}

/**
 * Создает внутренние элементы для анимации text-reveal
 */
function createLineInners(lines: Element[]): HTMLElement[] {
  return lines.map((line) => {
    const inner = document.createElement('div');
    inner.style.display = 'block';
    inner.innerHTML = line.innerHTML;
    line.innerHTML = '';
    line.appendChild(inner);
    return inner;
  });
}

/**
 * Добавляет анимацию рисования SVG элементов
 * Анимирует stroke-dashoffset для эффекта рисования
 */
function addSvgDrawAnimation(
  timeline: gsap.core.Timeline,
  config: ElementAnimationConfig,
  positionOverride?: number | string,
) {
  const { element, params } = config;
  const pathElements = element.querySelectorAll('path');

  // Если delay равен 0, используем "0" для одновременного старта
  const position =
    positionOverride !== undefined
      ? positionOverride
      : params.delay === 0
        ? '0'
        : `${params.delay}`;

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
function addTextRevealAnimation(
  timeline: gsap.core.Timeline,
  config: ElementAnimationConfig,
  positionOverride?: number | string,
) {
  const { element, params, animationDef } = config;
  if (!element || !element.textContent?.trim() || !animationDef) return;

  const splitText = getSplitTextInstance(element as HTMLElement);
  if (!splitText?.lines?.length) return;

  // Убираем прямой set вне таймлайна, чтобы не терять видимость после clearProps
  // gsap.set(element, { opacity: 1, visibility: 'visible' });

  const position = positionOverride ?? (params.delay === 0 ? '0' : `${params.delay}`);

  // Применяем overflow: hidden на строки для правильного эффекта маскирования
  gsap.set(splitText.lines, { overflow: 'hidden' });

  const lineInners = createLineInners(splitText.lines);

  // 0. Делаем контейнер видимым именно в рамках таймлайна
  timeline.set(
    element,
    {
      opacity: 1,
      visibility: 'visible',
    },
    position,
  );

  // 1. Устанавливаем начальное состояние (скрытое)
  timeline.set(
    lineInners,
    {
      yPercent: 100,
      opacity: 1,
    },
    position,
  );

  // 2. Добавляем основную анимацию появления
  timeline.to(
    lineInners,
    {
      yPercent: 0,
      duration: animationDef.duration || 0.8,
      stagger: params.stagger ?? 0.1,
      ease: animationDef.ease || 'expo.out',
      onReverseComplete: () => {
        // При реверсе возвращаем элементы в скрытое состояние
        gsap.set(lineInners, {
          yPercent: 100,
          opacity: 1,
        });
      },
    },
    position,
  );
}

/**
 * Добавляет базовую анимацию элемента
 * Применяет стандартную анимацию from/to с пользовательскими параметрами
 * Теперь GSAP полностью контролирует все свойства включая visibility
 */
function addBaseAnimation(
  timeline: gsap.core.Timeline,
  config: ElementAnimationConfig,
  positionOverride?: number | string,
) {
  const { element, params, animationDef } = config;
  if (!animationDef) return;

  const position =
    positionOverride !== undefined
      ? positionOverride
      : params.delay === 0
        ? '0'
        : `${params.delay}`;

  // Устанавливаем начальное состояние в timeline
  timeline.set(
    element,
    {
      ...animationDef.from,
      autoAlpha: 0,
      visibility: 'hidden', // Явно скрываем элемент
    },
    position,
  );

  // Анимируем к конечному состоянию
  timeline.to(
    element,
    {
      ...animationDef.to,
      autoAlpha: 1,
      visibility: 'visible', // Показываем элемент
      duration: animationDef.duration,
      ease: animationDef.ease,
    },
    position,
  );
}
