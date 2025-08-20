'use client';

import { gsap } from 'gsap';
import { SplitText as GsapSplitText } from 'gsap/SplitText';
import type {
  AnimationType,
  GlobalSplitTextStorage,
  SplitText as SplitTextInstance,
} from '../types/gsap.types';
import { parseAnimationData } from '@/lib/gsap/utils/parseAnimationData';
import { getAnimationDefinition, AnimationDefinition } from '@/lib/gsap/config/animation.config';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';

ensureGSAPRegistered();

const IS_DEBUG = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ANIM_DEBUG === '1';

// Diagnostics storage: expected vs started/completed counters per section/groupDelay
const animDiagnostics = new Map<string, { expected: number; started: number; completed: number }>();

type ElementAnimationParams = {
  duration: number;
  ease: string;
  delay: number;
  stagger?: number;
  groupDelay?: number;
  sectionId?: string;
};

type ElementAnimationConfig = {
  element: Element;
  params: ElementAnimationParams;
  animationDef?: AnimationDefinition;
};

type AddAnimationConfig = {
  element: Element;
  animationType: AnimationType;
  params: ElementAnimationParams;
};

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
      gsap.set(element, { clearProps: 'all' });
    }
  });
}

const parseElements = (elements: Element[], container: HTMLElement) => {
  return elements
    .map((element) => {
      const config = parseAnimationData(element);
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

const sortSections = (sections: Map<string, ReturnType<typeof parseElements>>) => {
  return Array.from(sections.entries()).sort(([, a], [, b]) => {
    const minGroupDelayA = Math.min(...a.map((item) => item.groupDelay));
    const minGroupDelayB = Math.min(...b.map((item) => item.groupDelay));
    return minGroupDelayA - minGroupDelayB;
  });
};

const createGroupsByDelay = (sectionElements: ReturnType<typeof parseElements>) => {
  const groups = new Map<number, typeof sectionElements>();
  sectionElements.forEach((item) => {
    if (!groups.has(item.groupDelay)) groups.set(item.groupDelay, []);
    groups.get(item.groupDelay)!.push(item);
  });
  return groups;
};

const sortGroupsByDelay = (
  groups: Map<number, ReturnType<typeof parseElements>>,
) => Array.from(groups.entries()).sort(([a], [b]) => a - b);

const setGroupExpectedDiagnostics = (
  groupElements: ReturnType<typeof parseElements>,
  groupDelay: number,
) => {
  const diagKey = `${groupElements[0]?.sectionId ?? 'default'}::${groupDelay}`;
  animDiagnostics.set(diagKey, { expected: groupElements.length, started: 0, completed: 0 });
};

const addGroupAnimations = (
  timeline: gsap.core.Timeline,
  groupDelay: number,
  groupElements: ReturnType<typeof parseElements>,
  sectionStartTime: number,
) => {
  const groupStartTime = sectionStartTime + groupDelay;
  const sortedGroupElements = groupElements.sort((a, b) => a.delay - b.delay);
  setGroupExpectedDiagnostics(sortedGroupElements, groupDelay);
  sortedGroupElements.forEach((item, index) => {
    const params: ElementAnimationParams = {
      duration: item.config!.duration ?? 1,
      delay: item.delay,
      ease: item.config!.ease ?? 'power1.out',
      stagger: item.stagger,
      groupDelay: item.groupDelay,
      sectionId: item.sectionId,
    };
    const staggerDelay = item.stagger > 0 ? index * item.stagger : 0;
    const elementPosition = groupStartTime + item.delay + staggerDelay;
    addAnimationToTimeline(
      timeline,
      { element: item.element, animationType: item.config!.animation, params },
      elementPosition,
    );
  });
};

const computeSectionDuration = (
  groups: Map<number, ReturnType<typeof parseElements>>,
) => {
  let sectionDuration = 0;
  groups.forEach((groupElems, groupDelay) => {
    const maxDelay = Math.max(...groupElems.map((it) => it.delay));
    const maxDuration = Math.max(...groupElems.map((it) => it.config?.duration ?? 1));
    const maxStagger = Math.max(...groupElems.map((it) => it.stagger ?? 0));
    const count = groupElems.length;
    const groupEnd = groupDelay + maxDelay + maxDuration + maxStagger * Math.max(0, count - 1);
    if (groupEnd > sectionDuration) sectionDuration = groupEnd;
  });
  return sectionDuration;
};

const processSection = (
  timeline: gsap.core.Timeline,
  sectionElements: ReturnType<typeof parseElements>,
  sectionStartTime: number,
) => {
  const groups = createGroupsByDelay(sectionElements);
  const sortedGroups = sortGroupsByDelay(groups);
  sortedGroups.forEach(([groupDelay, groupElements]) => {
    addGroupAnimations(timeline, groupDelay, groupElements, sectionStartTime);
  });
  return computeSectionDuration(groups);
};

export function createElementTimeline(
  container: HTMLElement,
  selector = '[data-animation]',
): gsap.core.Timeline {
  const elements = Array.from(container.querySelectorAll(selector));

  if (elements.length === 0) {
    return gsap.timeline({ paused: true });
  }

  const tl = gsap.timeline({ paused: true });
  const parsedElements = parseElements(elements, container);
  const sections = groupBySections(parsedElements);
  const sortedSections = sortSections(sections);

  let sectionStartTime = 0;
  sortedSections.forEach(([, sectionElements]) => {
    const sectionDuration = processSection(tl, sectionElements, sectionStartTime);
    sectionStartTime += sectionDuration;
  });

  // At the end of this container timeline, summarize diagnostics for its sectionId
  const sectionId =
    container.getAttribute('data-section') ||
    container.getAttribute('data-section-index') ||
    container.id ||
    'default';
  tl.eventCallback('onComplete', () => {
    if (IS_DEBUG) {
      requestAnimationFrame(() => {
        let anyWarn = false;
        animDiagnostics.forEach((val, key) => {
          const [sec] = key.split('::');
          if (sec !== String(sectionId)) return;
          // if any completed, consider group OK for this cycle
          if (val.completed > 0) return;
          if (val.started < val.expected) {
            anyWarn = true;
            console.warn(
              `[ANIM][WARN] group not fully started sec=${sec} started=${val.started}/${val.expected}`,
            );
          }
        });
        if (!anyWarn) {
          console.log(`[ANIM][OK] sec=${sectionId} all groups started`);
        }
        // cleanup keys for this section
        Array.from(animDiagnostics.keys()).forEach((key) => {
          if (key.startsWith(`${sectionId}::`)) animDiagnostics.delete(key);
        });
      });
    }
  });

  return tl;
}

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

  const timelinePosition = position !== undefined ? position : params.delay === 0 ? '0' : `${params.delay}`;

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

const markAnimStart = (params: ElementAnimationParams) => {
  const key = `${params.sectionId ?? 'default'}::${params.groupDelay ?? 0}`;
  const cur = animDiagnostics.get(key);
  if (cur) animDiagnostics.set(key, { ...cur, started: cur.started + 1 });
};

const markAnimComplete = (params: ElementAnimationParams) => {
  const key = `${params.sectionId ?? 'default'}::${params.groupDelay ?? 0}`;
  const cur = animDiagnostics.get(key);
  if (cur) animDiagnostics.set(key, { ...cur, completed: cur.completed + 1 });
};

const setInitialTextRevealState = (
  timeline: gsap.core.Timeline,
  element: Element,
  lineInners: HTMLElement[],
  position: number | string,
) => {
  timeline.set(
    element,
    {
      opacity: 1,
      visibility: 'visible',
    },
    position,
  );

  timeline.set(
    lineInners,
    {
      yPercent: 100,
      opacity: 1,
    },
    position,
  );
};

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

function addSvgDrawAnimation(
  timeline: gsap.core.Timeline,
  config: ElementAnimationConfig,
  positionOverride?: number | string,
) {
  const { element, params } = config;
  const pathElements = element.querySelectorAll('path');
  const position = positionOverride !== undefined ? positionOverride : params.delay === 0 ? '0' : `${params.delay}`;

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
        onStart: () => markAnimStart(params),
        onComplete: () => markAnimComplete(params),
      },
      position,
    );
  });
}

function addTextRevealAnimation(
  timeline: gsap.core.Timeline,
  config: ElementAnimationConfig,
  positionOverride?: number | string,
) {
  const { element, params, animationDef } = config;
  if (!element || !element.textContent?.trim() || !animationDef) return;

  const splitText = getSplitTextInstance(element as HTMLElement);
  if (!splitText?.lines?.length) return;

  const position = positionOverride ?? (params.delay === 0 ? '0' : `${params.delay}`);
  gsap.set(splitText.lines, { overflow: 'hidden' });
  const lineInners = createLineInners(splitText.lines);

  setInitialTextRevealState(timeline, element, lineInners, position);

  timeline.to(
    lineInners,
    {
      yPercent: 0,
      duration: animationDef.duration || 0.8,
      stagger: params.stagger ?? 0.1,
      ease: animationDef.ease || 'expo.out',
      onStart: () => markAnimStart(params),
      onComplete: () => markAnimComplete(params),
      onReverseComplete: () => {
        gsap.set(lineInners, {
          yPercent: 100,
          opacity: 1,
        });
      },
    },
    position,
  );
}

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

  timeline.set(
    element,
    {
      ...animationDef.from,
      autoAlpha: 0,
      visibility: 'hidden',
    },
    position,
  );

  timeline.to(
    element,
    {
      ...animationDef.to,
      autoAlpha: 1,
      visibility: 'visible',
      duration: animationDef.duration,
      ease: animationDef.ease,
      onStart: () => markAnimStart(params),
      onComplete: () => markAnimComplete(params),
    },
    position,
  );
}

