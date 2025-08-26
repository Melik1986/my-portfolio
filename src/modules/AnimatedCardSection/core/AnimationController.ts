'use client';

import { gsap } from 'gsap';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import { initCardDeckScroll } from '../utils/cardDeckAnimation';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';

// Централизованная регистрация GSAP плагинов
ensureGSAPRegistered();

// Расширение window теперь выполняется внутри ensureGSAPRegistered

/**
 * Локальный helper: очищает анимационные стили дочерних элементов секции
 * Используется при реверсе/очистке, чтобы вернуть элементы к исходному состоянию
 */
const clearElementAnimations = (wrapper: HTMLElement): void => {
  const elements = wrapper.querySelectorAll<HTMLElement>('[data-animation]');
  elements.forEach((el) => {
    // Не убиваем твины внутри timeline, чтобы повторный запуск не ломался
    gsap.set(el, { clearProps: 'x,y,opacity,autoAlpha,visibility,scale,rotate,filter' });
  });
};

/**
 * Интерфейс для управления анимациями секций
 */
interface SectionController {
  timeline: gsap.core.Timeline;
  wrapper: HTMLElement;
  isActive: boolean;
}

/**
 * Централизованный контроллер анимаций карточек
 * Заменяет глобальный ElementTimelineRegistry с улучшенной архитектурой
 */
export class AnimationController {
  private sections = new Map<number, SectionController>();
  private masterTimeline: gsap.core.Timeline | null = null;
  private activeCardIndex = 0;
  private isInitialized = false;
  private totalCardsCount: number | null = null;

  /**
   * Инициализация мастер-анимации (только для Hero секции)
   */
  initializeMaster(): gsap.core.Timeline | null {
    if (this.isInitialized) return this.masterTimeline;

    // Корректный выбор обёртки: сначала .portfolio__wrapper, затем запасные варианты
    const wrapperElement = (document.querySelector('.portfolio__wrapper') ||
      document.querySelector('.scroll-section') ||
      document.querySelector('#smooth-content')) as HTMLElement | null;

    if (!wrapperElement) return null;

    // Выбираем только прямых детей списка секций, чтобы не захватить внутренние li
    const directCardNodes = wrapperElement.querySelectorAll(':scope > ul.portfolio__list > li');
    const items = Array.from(
      (directCardNodes && directCardNodes.length
        ? directCardNodes
        : wrapperElement.querySelectorAll('li')) as NodeListOf<HTMLElement>,
    );

    if (items.length === 0) return null;

    // Создаём мастер timeline для колоды карт
    this.masterTimeline = initCardDeckScroll(wrapperElement, items, (cardIndex) => {
      this.activateCard(cardIndex);
    });

    this.isInitialized = true;
    this.totalCardsCount = items.length;
    return this.masterTimeline;
  }

  /**
   * Регистрация секции с автоматическим созданием timeline
   */
  registerSection(sectionIndex: number, wrapper: HTMLElement): gsap.core.Timeline {
    // Проверяем, что секция ещё не зарегистрирована
    if (this.sections.has(sectionIndex)) {
      return this.sections.get(sectionIndex)!.timeline;
    }

    // Создаём timeline элементов для секции
    const elementTimeline = createElementTimeline(wrapper, '[data-animation]');

    // Добавляем автоочистку при реверсе
    elementTimeline.eventCallback('onReverseComplete', () => {
      clearElementAnimations(wrapper);
    });

    // Сохраняем контроллер секции
    const controller: SectionController = {
      timeline: elementTimeline,
      wrapper,
      isActive: sectionIndex === 0, // Hero активна по умолчанию
    };

    this.sections.set(sectionIndex, controller);

    // Если это Hero секция, активируем её немедленно
    if (sectionIndex === 0) {
      this.activateCard(0);
    }

    return elementTimeline;
  }

  /**
   * Активация карточки с автоматическим управлением timeline
   */
  private activateCard(cardIndex: number): void {
    // Деактивируем предыдущую карточку
    const prevController = this.sections.get(this.activeCardIndex);
    if (prevController && prevController.isActive) {
      prevController.timeline.reverse();
      prevController.isActive = false;
    }

    // Активируем новую карточку
    const currentController = this.sections.get(cardIndex);
    if (currentController && !currentController.isActive) {
      // Проверяем наличие text-reveal элементов в секции
      const hasTextReveal = currentController.wrapper.querySelector(
        '[data-animation="text-reveal"]',
      );

      if (hasTextReveal) {
        // Для text-reveal анимаций делаем плавный переход
        currentController.timeline.invalidate().progress(0);
        // Небольшая задержка позволяет увидеть реверс состояние
        gsap.delayedCall(0.1, () => {
          if (currentController.isActive) {
            currentController.timeline.play();
          }
        });
      } else {
        // Для обычных анимаций используем стандартный подход
        currentController.timeline.invalidate().progress(0).play();
      }

      currentController.isActive = true;
    }

    this.activeCardIndex = cardIndex;
  }

  /**
   * Получить активную карточку
   */
  getActiveCardIndex(): number {
    return this.activeCardIndex;
  }

  /**
   * Программная навигация к карточке по индексу
   */
  navigateToCard(cardIndex: number): boolean {
    if (!this.isInitialized || !this.masterTimeline) {
      console.warn('AnimationController not initialized');
      return false;
    }

    if (!this.sections.has(cardIndex)) {
      console.warn(`Card with index ${cardIndex} not found`);
      return false;
    }

    // Получаем ScrollTrigger из мастер timeline
    const scrollTrigger = this.masterTimeline.scrollTrigger;
    if (!scrollTrigger) {
      console.warn('ScrollTrigger not found in master timeline');
      // Попробуем освежить ScrollTrigger и повторить один раз
      try {
        void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
          setTimeout(() => ScrollTrigger.refresh(), 50);
        });
      } catch {}
      return false;
    }

    // Для первой карточки просто прокручиваем к началу секции
    if (cardIndex === 0) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: scrollTrigger.start,
          autoKill: false,
        },
        ease: 'power2.inOut',
      });
      return true;
    }

    // Для остальных карточек вычисляем позицию
    const denominator = Math.max(1, (this.totalCardsCount ?? this.sections.size) - 1);
    const progress = cardIndex / denominator;

    // Вычисляем позицию по фактическому диапазону ScrollTrigger
    const startPos = scrollTrigger.start;
    const totalScrollDistance = scrollTrigger.end - scrollTrigger.start;
    const targetPosition = startPos + totalScrollDistance * progress;

    // Используем gsap.to для плавной прокрутки к позиции
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: targetPosition,
        autoKill: false,
      },
      ease: 'power2.inOut',
    });
    return true;
  }

  /**
   * Получить индекс карточки по ID секции
   */
  getCardIndexBySectionId(sectionId: string): number {
    // Маппинг ID секций к индексам карточек
    const sectionMapping: Record<string, number> = {
      'hero-section': 0, // Вертикальный скролл
      'about-section': 1, // Вертикальный скролл
      'skills-section': 2, // Вертикальный скролл
      'projects-section': 3, // Горизонтальный скролл
      'gallery-section': 4, // Горизонтальный скролл
      'ai-content-section': 5, // Горизонтальный скролл
      'ai-video-section': 6, // Горизонтальный скролл
      'contact-section': 7, // Горизонтальный скролл
    };

    return sectionMapping[sectionId] ?? -1;
  }

  /**
   * Полная очистка всех анимаций
   */
  cleanup(): void {
    // Очищаем все секции
    this.sections.forEach((controller) => {
      controller.timeline.kill();
      clearElementAnimations(controller.wrapper);
    });

    // Очищаем мастер timeline
    this.masterTimeline?.kill();

    // Сбрасываем состояние
    this.sections.clear();
    this.masterTimeline = null;
    this.activeCardIndex = 0;
    this.isInitialized = false;
  }

  /**
   * Частичная очистка секции (для размонтирования отдельных компонентов)
   */
  cleanupSection(sectionIndex: number): void {
    const controller = this.sections.get(sectionIndex);
    if (controller) {
      controller.timeline.kill();
      clearElementAnimations(controller.wrapper);
      this.sections.delete(sectionIndex);
    }
  }

  /**
   * Проверка инициализации
   */
  isReady(): boolean {
    return Boolean(this.masterTimeline);
  }

  getTotalCardsCount(): number | null {
    return this.totalCardsCount;
  }
}

// Экспортируем singleton для использования в проекте
export const animationController = new AnimationController();
