'use client';

import { useRef, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { getAnimationConfig } from '../config/projects-catalog';

type AnimationState = 'stacked' | 'expanded' | 'fullscreen';

interface CardRef {
  element: HTMLElement;
  index: number;
  tween?: gsap.core.Tween;
}

// eslint-disable-next-line max-lines-per-function
export function useProjectsAnimation(
  totalCards: number,
  containerRef?: React.RefObject<HTMLDivElement | null>,
) {
  const cardsRef = useRef<Map<number, CardRef>>(new Map());
  const mainTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const stateRef = useRef<AnimationState>('stacked');

  // Регистрация карточки
  const registerCard = useCallback(
    (element: HTMLElement, index: number) => {
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
    },
    [totalCards],
  );

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

    const config = getAnimationConfig();
    const isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(max-width: 768px)').matches || window.innerWidth <= 768);

    cardsRef.current.forEach((cardRef, index) => {
      // Определяем, нужно ли использовать сжатые параметры для последних карточек
      const isCompactCard =
        config.compactLastCards &&
        config.compactStartIndex !== undefined &&
        index >= config.compactStartIndex;

      // Выбираем параметры в зависимости от позиции карточки
      const zStep =
        isCompactCard && config.compactZStep !== undefined ? config.compactZStep : config.zStep;
      const yStep =
        isCompactCard && config.compactYStep !== undefined ? config.compactYStep : config.yStep;

      // Масштаб для последних двух карточек
      const isLastTwoCards = config.lastTwoCardsScale !== undefined && index >= totalCards - 2;
      const scale = isLastTwoCards ? config.lastTwoCardsScale : 1;

      // На мобилке — веерное расположение с углами поворота
      const x = isMobile ? 0 : index * config.xStep;
      const y = -index * Math.abs(yStep) * (isMobile ? 0.7 : 1);
      const z = index * zStep * (isMobile ? 1.2 : 1);

      // Веерное расположение для мобильных устройств
      const rotation =
        isMobile && config.fanAngle && config.fanAngleStep
          ? (index - Math.floor(totalCards / 2)) * config.fanAngleStep
          : 0;

      tl.to(
        cardRef.element,
        {
          duration: config.fastFanDuration || config.fanDuration, // Используем быструю анимацию
          x,
          y,
          z,
          rotation,
          scale,
          zIndex: index,
          filter: `hue-rotate(${index * 30}deg)`,
          ease: 'power2.out',
          force3D: true,
        },
        (config.initialDelay || 0) + index * (isMobile ? 0.07 : 0.05), // Добавляем задержку
      );
    });
  }, [totalCards]);

  // Сбор в стопку
  const collapseFan = useCallback(() => {
    if (stateRef.current !== 'expanded') return;
    stateRef.current = 'stacked';

    // Убиваем главный timeline
    mainTimelineRef.current?.kill();

    // Создаем timeline для сбора в обратном порядке
    const tl = gsap.timeline();
    mainTimelineRef.current = tl;

    const config = getAnimationConfig();
    const cards = Array.from(cardsRef.current.values()).reverse();
    cards.forEach((cardRef, reverseIndex) => {
      tl.to(
        cardRef.element,
        {
          duration: config.fastFanDuration || config.fanDuration, // Используем быструю анимацию
          x: 0,
          y: 0,
          z: 0,
          rotation: 0, // Сброс угла поворота
          zIndex: totalCards - cardRef.index,
          filter: '',
          ease: 'power2.out',
          force3D: true,
        },
        reverseIndex * 0.03,
      );
    });
  }, [totalCards]);

  // Hover эффект для отдельной карточки
  const hoverCard = useCallback((index: number, isHovering: boolean) => {
    if (stateRef.current !== 'expanded') return;

    const cardRef = cardsRef.current.get(index);
    if (!cardRef) return;

    // Убиваем индивидуальный tween карточки
    cardRef.tween?.kill();

    // Получаем адаптивную конфигурацию
    const config = getAnimationConfig();
    const isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(max-width: 768px)').matches || window.innerWidth <= 768);

    const baseX = isMobile ? 0 : index * config.xStep;
    const baseY = -index * Math.abs(config.yStep) * (isMobile ? 0.7 : 1);
    const baseZ = index * config.zStep * (isMobile ? 1.2 : 1);
    const hoverXShift = isMobile ? 80 : 120; // увеличили с 24px до 80px для лучших touch-областей
    const hoverLift = isMobile ? config.hoverLift * 1.25 : config.hoverLift;

    cardRef.tween = gsap.to(cardRef.element, {
      duration: config.hoverDuration,
      x: baseX + (isHovering ? hoverXShift : 0),
      y: baseY + (isHovering ? hoverLift : 0),
      z: baseZ + (isHovering ? Math.abs(config.zStep) * 0.5 : 0),
      boxShadow: isHovering ? config.hoverShadow : config.cardShadow,
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

  // Расширение в fullscreen с учетом мобильных устройств
  const expandToFullscreen = useCallback((index: number) => {
    const cardRef = cardsRef.current.get(index);
    if (!cardRef) return;

    const isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(max-width: 768px)').matches || window.innerWidth <= 768);

    // Получаем размеры и позицию контейнера
    let containerRect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }

    // Позиционируем карточку относительно контейнера
    gsap.to(cardRef.element, {
      x: -containerRect.left,
      y: -containerRect.top,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      zIndex: 20000,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    // Скрыть остальные карточки
    cardsRef.current.forEach((otherCardRef, otherIndex) => {
      if (otherIndex !== index) {
        gsap.to(otherCardRef.element, {
          opacity: 0,
          scale: 0.8,
          zIndex: isMobile ? 500 + otherIndex : otherIndex,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  }, [containerRef]);

  // Навигация стрелками - перемещение карточки вперед
  const navigateCardForward = useCallback(() => {
    if (stateRef.current !== 'expanded' || cardsRef.current.size === 0) return;

    const config = getAnimationConfig();
    const cards = Array.from(cardsRef.current.values()).sort((a, b) => a.index - b.index);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Создаем новый порядок: первая карточка идет в конец
    const reorderedCards = [...cards.slice(1), cards[0]];

    // Анимируем все карточки одновременно для плавности
    reorderedCards.forEach((cardRef, newPosition) => {
      // Определяем, нужно ли использовать сжатые параметры для последних карточек
      const isCompactCard =
        config.compactLastCards &&
        config.compactStartIndex !== undefined &&
        newPosition >= config.compactStartIndex;

      // Выбираем параметры в зависимости от позиции карточки
      const zStep =
        isCompactCard && config.compactZStep !== undefined ? config.compactZStep : config.zStep;
      const yStep =
        isCompactCard && config.compactYStep !== undefined ? config.compactYStep : config.yStep;

      // Масштаб для последних двух карточек
      const isLastTwoCards =
        config.lastTwoCardsScale !== undefined && newPosition >= totalCards - 2;
      const scale = isLastTwoCards ? config.lastTwoCardsScale : 1;

      const x = isMobile ? 0 : newPosition * config.xStep;
      const y = -newPosition * Math.abs(yStep) * (isMobile ? 0.7 : 1);
      const z = newPosition * zStep * (isMobile ? 1.2 : 1);
      const rotation =
        isMobile && config.fanAngle && config.fanAngleStep
          ? (newPosition - Math.floor(totalCards / 2)) * config.fanAngleStep
          : 0;

      gsap.to(cardRef.element, {
        duration: (config.fastFanDuration || config.fanDuration) * 0.8, // Используем быструю анимацию
        x,
        y,
        z,
        rotation,
        scale,
        zIndex: newPosition,
        opacity: 1,
        ease: 'power2.inOut',
      });
    });

    // Обновляем индексы в Map для корректного отслеживания
    const newCardsMap = new Map<number, CardRef>();
    reorderedCards.forEach((cardRef, newPosition) => {
      newCardsMap.set(newPosition, { ...cardRef, index: newPosition });
    });
    cardsRef.current = newCardsMap;
  }, [totalCards]);

  // Навигация стрелками - перемещение карточки назад
  const navigateCardBackward = useCallback(() => {
    if (stateRef.current !== 'expanded' || cardsRef.current.size === 0) return;

    const config = getAnimationConfig();
    const cards = Array.from(cardsRef.current.values()).sort((a, b) => a.index - b.index);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Создаем новый порядок: последняя карточка идет в начало
    const reorderedCards = [cards[cards.length - 1], ...cards.slice(0, -1)];

    // Анимируем все карточки одновременно для плавности
    reorderedCards.forEach((cardRef, newPosition) => {
      // Определяем, нужно ли использовать сжатые параметры для последних карточек
      const isCompactCard =
        config.compactLastCards &&
        config.compactStartIndex !== undefined &&
        newPosition >= config.compactStartIndex;

      // Выбираем параметры в зависимости от позиции карточки
      const zStep =
        isCompactCard && config.compactZStep !== undefined ? config.compactZStep : config.zStep;
      const yStep =
        isCompactCard && config.compactYStep !== undefined ? config.compactYStep : config.yStep;

      // Масштаб для последних двух карточек
      const isLastTwoCards =
        config.lastTwoCardsScale !== undefined && newPosition >= totalCards - 2;
      const scale = isLastTwoCards ? config.lastTwoCardsScale : 1;

      const x = isMobile ? 0 : newPosition * config.xStep;
      const y = -newPosition * Math.abs(yStep) * (isMobile ? 0.7 : 1);
      const z = newPosition * zStep * (isMobile ? 1.2 : 1);
      const rotation =
        isMobile && config.fanAngle && config.fanAngleStep
          ? (newPosition - Math.floor(totalCards / 2)) * config.fanAngleStep
          : 0;

      gsap.to(cardRef.element, {
        duration: (config.fastFanDuration || config.fanDuration) * 0.8, // Используем быструю анимацию
        x,
        y,
        z,
        rotation,
        scale,
        zIndex: newPosition,
        opacity: 1,
        ease: 'power2.inOut',
      });
    });

    // Обновляем индексы в Map для корректного отслеживания
    const newCardsMap = new Map<number, CardRef>();
    reorderedCards.forEach((cardRef, newPosition) => {
      newCardsMap.set(newPosition, { ...cardRef, index: newPosition });
    });
    cardsRef.current = newCardsMap;
  }, [totalCards]);

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
    expandToFullscreen,
    navigateCardForward,
    navigateCardBackward,
    currentState: stateRef.current,
  };
}
