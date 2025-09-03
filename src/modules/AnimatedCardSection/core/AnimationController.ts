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
  private pendingCardIndex: number | null = null;
  private whenReadyPromise: Promise<void> | null = null;
  private resolveWhenReady: (() => void) | null = null;

  private waitForMasterReady(): void {
    if (!this.masterTimeline) return;
    const tryNotify = () => {
      const hasTrigger = Boolean(this.masterTimeline && this.masterTimeline.scrollTrigger);
      if (hasTrigger) {
        if (this.pendingCardIndex !== null) {
          const toGo = this.pendingCardIndex;
          this.pendingCardIndex = null;
          this.navigateToCard(toGo);
        }
        // resolve readiness promise
        if (this.resolveWhenReady) {
          this.resolveWhenReady();
          this.whenReadyPromise = null;
          this.resolveWhenReady = null;
        }
        return;
      }
      requestAnimationFrame(tryNotify);
    };
    tryNotify();
  }

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
    // Wait until ScrollTrigger is attached, then process any pending navigation
    if (!this.whenReadyPromise) {
      this.whenReadyPromise = new Promise<void>((resolve) => {
        this.resolveWhenReady = resolve;
      });
    }
    this.waitForMasterReady();
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

    // Если это Hero секция, активируем её после инициализации
    if (sectionIndex === 0) {
      // Используем requestAnimationFrame для гарантии готовности DOM
      requestAnimationFrame(() => {
        if (controller.timeline) {
          controller.timeline.play();
          controller.isActive = true;
        }
      });
    }

    return elementTimeline;
  }

  /**
   * Активация карточки с автоматическим управлением timeline
   */
  private activateCard(cardIndex: number): void {
    // Деактивируем предыдущую карточку
    const prevIndex = this.activeCardIndex;
    const prevController = this.sections.get(prevIndex);
    if (prevController && prevController.isActive) {
      const st = this.masterTimeline?.scrollTrigger;
      // Для hero (prevIndex === 0) или отсутствия ScrollTrigger — реверс сразу (как раньше)
      if (!st || prevIndex === 0 || this.totalCardsCount === null || cardIndex <= prevIndex) {
        prevController.timeline.reverse();
        prevController.isActive = false;
      } else {
        // Отложим реверс предыдущей секции до 25% следующего шага
        const steps = Math.max(1, this.totalCardsCount - 1);
        const step = 1 / steps;
        const reverseThreshold = Math.min(1, prevIndex * step + 0.25 * step);

        let last = st.progress;
        const onTick = () => {
          const cur = st.progress;
          const forward = cur >= last;
          last = cur;
          if (forward && cur >= reverseThreshold) {
            prevController.timeline.reverse();
            prevController.isActive = false;
            gsap.ticker.remove(onTick);
          }
        };
        gsap.ticker.add(onTick);
      }
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
   * Проверка валидности индекса карточки
   */
  private validateCardIndex(cardIndex: number): boolean {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
      const totalCards = document.querySelectorAll('li[data-section-index]').length;
      if (cardIndex >= totalCards) {
        console.warn(`Card index ${cardIndex} exceeds total cards ${totalCards}`);
        return false;
      }
    } else if (!this.sections.has(cardIndex)) {
      console.warn(`Card with index ${cardIndex} not found`);
      return false;
    }
    return true;
  }

  /**
   * Обработка отсутствующего ScrollTrigger
   */
  private handleMissingScrollTrigger(cardIndex: number): void {
    console.debug('ScrollTrigger not found in master timeline');
    try {
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 50);
      });
    } catch {}
    this.pendingCardIndex = cardIndex;
  }

  /**
   * Прокрутка к позиции карточки
   */
  private scrollToPosition(position: number): void {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: position, autoKill: false },
      ease: 'power2.inOut',
    });
  }

  /**
   * Программная навигация к карточке по индексу
   */
  navigateToCard(cardIndex: number): boolean {
    if (!this.isInitialized || !this.masterTimeline) {
      console.warn('AnimationController not initialized');
      return false;
    }

    if (!this.validateCardIndex(cardIndex)) {
      return false;
    }

    const scrollTrigger = this.masterTimeline.scrollTrigger;
    if (!scrollTrigger) {
      this.handleMissingScrollTrigger(cardIndex);
      return false;
    }

    // Для первой карточки
    if (cardIndex === 0) {
      this.scrollToPosition(scrollTrigger.start);
      return true;
    }

    // Для остальных карточек
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const totalCards = isMobile 
      ? document.querySelectorAll('li[data-section-index]').length 
      : (this.totalCardsCount ?? this.sections.size);
    const progress = cardIndex / Math.max(1, totalCards - 1);
    const targetPosition = scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * progress;
    
    this.scrollToPosition(targetPosition);
    return true;
  }

  async navigateToCardAsync(cardIndex: number): Promise<boolean> {
    if (!this.isInitialized || !this.masterTimeline) {
      this.initializeMaster();
    }
    // wait until scrollTrigger attaches
    if (this.whenReadyPromise) {
      await this.whenReadyPromise;
    }
    // As an extra guard, rAF and refresh
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    try {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
    } catch {}
    return this.navigateToCard(cardIndex);
  }

  /**
   * Получить индекс карточки по ID секции
   */
  getCardIndexBySectionId(sectionId: string): number {
    // На мобильных устройствах нужно учитывать разделенные секции
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    if (isMobile) {
      // Находим все карточки в DOM по data-section-index
      const allCards = document.querySelectorAll('li[data-section-index]');
      let targetIndex = -1;
      
      console.log('[Navigation] Looking for section:', sectionId);
      console.log('[Navigation] Total cards found:', allCards.length);
      
      allCards.forEach((card, index) => {
        console.log(`[Navigation] Card ${index}: id="${card.id}"`);
        // Проверяем ID самой карточки
        if (card.id === sectionId) {
          targetIndex = index;
        }
      });
      
      if (targetIndex !== -1) {
        console.log('[Navigation] Found card at index:', targetIndex);
        return targetIndex;
      }
      
      // Fallback маппинг для мобильных
      const mobileSectionMapping: Record<string, number> = {
        'hero-section': 0,
        'about-section': 1, // Будет преобразовано в about-section-left
        'about-section-left': 1,
        'about-section-right': 2,
        'skills-section': 3, // Будет преобразовано в skills-section-left
        'skills-section-left': 3,
        'skills-section-right': 4,
        'projects-section': 5,
        'ai-content-section': 6,
        'ai-video-section': 7,
        'contact-section': 8,
      };
      
      console.log('[Navigation] Using fallback mapping, result:', mobileSectionMapping[sectionId]);
      return mobileSectionMapping[sectionId] ?? -1;
    }
    
    // Для десктопа используем обычный маппинг
    const sectionMapping: Record<string, number> = {
      'hero-section': 0,
      'about-section': 1,
      'skills-section': 2,
      'projects-section': 3,
      'ai-content-section': 4,
      'ai-video-section': 5,
      'contact-section': 6,
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
