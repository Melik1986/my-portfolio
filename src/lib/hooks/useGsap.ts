'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { AnimationType } from '@/types/gsap.types';
import { parseAnimationData } from '@/lib/utils/parseAnimationData';
import { getAnimationDefinition, AnimationDefinition } from '@/lib/config/animation.config';

gsap.registerPlugin(SplitText);

type AnimationParams = {
  duration: number;
  ease: string;
  delay: number;
};

type AnimationConfig = {
  element: Element;
  params: AnimationParams;
  animationDef?: AnimationDefinition;
};

type AddAnimationConfig = {
  element: Element;
  animationType: AnimationType;
  params: AnimationParams;
};

/**
 * Хук для анимации элементов с data-animate внутри контейнера.
 * Возвращает ref и созданный paused timeline.
 */
export function useGsap({
  selector = '[data-animate]',
  dependencies = [],
}: {
  selector?: string;
  dependencies?: React.DependencyList;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = Array.from(containerRef.current.querySelectorAll(selector));
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

    setTimeline(tl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...(dependencies || [])]);

  return { containerRef, timeline };
}

/**
 * Добавляет анимацию для одного элемента в timeline по типу анимации.
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

function addSvgDrawAnimation(timeline: gsap.core.Timeline, config: AnimationConfig) {
  const { element, params } = config;
  const pathElements = element.querySelectorAll('path');
  pathElements.forEach((pathElement) => {
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

function addTextRevealAnimation(timeline: gsap.core.Timeline, config: AnimationConfig) {
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

function addBaseAnimation(timeline: gsap.core.Timeline, config: AnimationConfig) {
  const { element, params, animationDef } = config;
  if (!animationDef) return;
  timeline.fromTo(element, animationDef.from, {
    ...animationDef.to,
    duration: animationDef.duration,
    ease: animationDef.ease,
    delay: params.delay,
  });
}

