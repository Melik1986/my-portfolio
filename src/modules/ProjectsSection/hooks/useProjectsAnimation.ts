'use client';

import { useRef, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ANIMATION_CONFIG } from '../config/projects-catalog';

type AnimationState = 'stacked' | 'expanded' | 'fullscreen';

interface CardRef {
  element: HTMLElement;
  index: number;
  tween?: gsap.core.Tween;
}

// eslint-disable-next-line max-lines-per-function
export function useProjectsAnimation(totalCards: number) {
  const cardsRef = useRef<Map<number, CardRef>>(new Map());
  const mainTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const stateRef = useRef<AnimationState>('stacked');

  // Регистрация карточки
  const registerCard = useCallback((element: HTMLElement, index: number) => {
    cardsRef.current.set(index, { element, index });
    
    // Устанавливаем начальную позицию в стопке - только GSAP свойства
    gsap.set(element, {
      x: 0,
      y: 0,
      z: 0,
      zIndex: totalCards - index,
      filter: '',
      force3D: true,
    });
  }, [totalCards]);

  // Отмена регистрации карточки
  const unregisterCard = useCallback((index: number) => {
    const cardRef = cardsRef.current.get(index);
    if (cardRef?.tween) {
      cardRef.tween.kill();
    }
    cardsRef.current.delete(index);
  }, []);

  // Раскрытие веера
  const expandFan = useCallback(() => {
    if (stateRef.current !== 'stacked') return;
    stateRef.current = 'expanded';

    // Убиваем главный timeline если существует
    mainTimelineRef.current?.kill();
    
    // Создаем новый timeline для последовательной анимации
    const tl = gsap.timeline();
    mainTimelineRef.current = tl;

    cardsRef.current.forEach((cardRef, index) => {
      // Диагональный веер влево-вверх как ступеньки
      const position = {
        x: index * ANIMATION_CONFIG.xStep, // Небольшое смещение влево
        y: -index * Math.abs(ANIMATION_CONFIG.yStep), // Смещение вверх (отрицательное Y = вверх)
        z: index * ANIMATION_CONFIG.zStep, // Глубина назад
        zIndex: index,
        filter: `hue-rotate(${index * 30}deg)`,
      };

      tl.to(cardRef.element, {
        duration: ANIMATION_CONFIG.fanDuration,
        ...position,
        ease: 'power2.out',
        force3D: true,
      }, index * 0.05); // Stagger delay
    });
  }, []);

  // Сбор в стопку
  const collapseFan = useCallback(() => {
    if (stateRef.current !== 'expanded') return;
    stateRef.current = 'stacked';

    // Убиваем главный timeline
    mainTimelineRef.current?.kill();
    
    // Создаем timeline для сбора в обратном порядке
    const tl = gsap.timeline();
    mainTimelineRef.current = tl;

    const cards = Array.from(cardsRef.current.values()).reverse();
    cards.forEach((cardRef, reverseIndex) => {
      tl.to(cardRef.element, {
        duration: 0.25,
        x: 0,
        y: 0,
        z: 0,
        zIndex: totalCards - cardRef.index,
        filter: '',
        ease: 'power2.out',
        force3D: true,
      }, reverseIndex * 0.03);
    });
  }, [totalCards]);

  // Hover эффект для отдельной карточки
  const hoverCard = useCallback((index: number, isHovering: boolean) => {
    if (stateRef.current !== 'expanded') return;
    
    const cardRef = cardsRef.current.get(index);
    if (!cardRef) return;

    // Убиваем индивидуальный tween карточки
    cardRef.tween?.kill();
    
    const position = {
      x: index * ANIMATION_CONFIG.xStep,
      y: -index * Math.abs(ANIMATION_CONFIG.yStep), // Вверх = отрицательное Y
      z: index * ANIMATION_CONFIG.zStep,
    };

    cardRef.tween = gsap.to(cardRef.element, {
      duration: ANIMATION_CONFIG.hoverDuration,
      x: position.x + (isHovering ? 120 : 0), // Увеличенное смещение вправо при наведении
      y: position.y + (isHovering ? ANIMATION_CONFIG.hoverLift : 0),
      z: position.z + (isHovering ? Math.abs(ANIMATION_CONFIG.zStep) * 0.5 : 0),
      boxShadow: isHovering ? ANIMATION_CONFIG.hoverShadow : ANIMATION_CONFIG.cardShadow,
      zIndex: isHovering ? 10000 : index,
      ease: 'power2.out',
      force3D: true,
      overwrite: 'auto',
    });
  }, []);

  // Переход в fullscreen
  const setFullscreen = useCallback((index: number | null) => {
    if (index !== null) {
      stateRef.current = 'fullscreen';
      // Не трогаем позиционирование - CSS fullscreen класс все сделает
    } else {
      stateRef.current = 'stacked';
      
      // НЕ сбрасываем все карточки - просто меняем состояние
      // Карточки остаются в своих текущих позициях до следующего взаимодействия
    }
  }, []);

  // Cleanup при размонтировании
  useLayoutEffect(() => {
    const currentCards = cardsRef.current;
    return () => {
      mainTimelineRef.current?.kill();
      currentCards.forEach((cardRef) => {
        cardRef.tween?.kill();
      });
      currentCards.clear();
    };
  }, []);

  return {
    registerCard,
    unregisterCard,
    expandFan,
    collapseFan,
    hoverCard,
    setFullscreen,
    currentState: stateRef.current,
  };
}