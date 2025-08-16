'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import { initCardDeckScroll } from '../utils/cardDeckAnimation';
import { gsapInitializer, isGSAPReady } from '@/lib/gsap/core/GSAPInitializer';

// Регистрация плагинов будет происходить через GSAPInitializer

// Расширяем типы window для ScrollTrigger
declare global {
  interface Window {
    ScrollTrigger: typeof ScrollTrigger;
  }
}

/**
 * Локальный helper: очищает анимационные стили дочерних элементов секции
 * Используется при реверсе/очистке, чтобы вернуть элементы к исходному состоянию
 */
const clearElementAnimations = (wrapper: HTMLElement): void => {
  const elements = wrapper.querySelectorAll<HTMLElement>('[data-animation]');
  elements.forEach((el) => {
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: 'all' });
  });
};

/**
 * Интерфейс для управления анимациями секций
 */
interface SectionController {
  timeline: Omit<gsap.core.Timeline, 'then'>;
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
  private fallbackActive = false;

  /**
   * Инициализация мастер-анимации (только для Hero секции)
   */
  async initializeMaster(): Promise<gsap.core.Timeline | null> {
    if (this.isInitialized) return this.masterTimeline;

    try {
      // Инициализируем GSAP с улучшенными настройками
      const initResult = await gsapInitializer.initialize({
        timeout: 15000,
        retryAttempts: 3,
        enableFallback: true
      });

      if (initResult.fallbackActive || !initResult.gsapAvailable) {
        console.warn('🔄 GSAP недоступен, используем CSS fallback анимации');
        this.fallbackActive = true;
        this.activateFallbackMode();
        this.isInitialized = true;
        return null;
      }

      const scrollSection = document.querySelector('.scroll-section');
      if (!scrollSection) return null;

      const wrapperElement = (scrollSection.querySelector('.portfolio__wrapper') ||
        scrollSection) as HTMLElement;
      const items = Array.from(wrapperElement.querySelectorAll('li')) as HTMLElement[];

      if (items.length === 0) return null;

      // Создаём мастер timeline для колоды карт
      this.masterTimeline = initCardDeckScroll(wrapperElement, items, (cardIndex) => {
        this.activateCard(cardIndex);
      });

      this.isInitialized = true;
      return this.masterTimeline;
    } catch (error) {
      console.error('❌ Ошибка инициализации master timeline, используем fallback:', error);
      this.fallbackActive = true;
      this.activateFallbackMode();
      this.isInitialized = true;
      return null;
    }
  }

  /**
   * Регистрация секции с автоматическим созданием timeline
   */
  async registerSection(sectionIndex: number, wrapper: HTMLElement): Promise<gsap.core.Timeline | null> {
    // Проверяем, что секция ещё не зарегистрирована
    if (this.sections.has(sectionIndex)) {
      return this.sections.get(sectionIndex)!.timeline;
    }

    try {
      if (this.fallbackActive) {
        return this.registerSectionFallback(sectionIndex, wrapper);
      }

      return await this.registerSectionWithGSAP(sectionIndex, wrapper);
    } catch (error) {
      console.error(`❌ Ошибка регистрации секции ${sectionIndex}, используем fallback:`, error);
      this.activateFallbackForSection(wrapper);
      return this.createFallbackController(sectionIndex, wrapper);
    }
  }

  /**
   * Регистрация секции в fallback режиме
   */
  private registerSectionFallback(sectionIndex: number, wrapper: HTMLElement): null {
    console.log(`🔄 Регистрация секции ${sectionIndex} в fallback режиме`);
    this.activateFallbackForSection(wrapper);
    
    const controller: SectionController = {
      timeline: gsap.timeline() as Omit<gsap.core.Timeline, 'then'>, // Пустой timeline для совместимости
      wrapper,
      isActive: sectionIndex === 0,
    };
    
    this.sections.set(sectionIndex, controller);
    return null;
  }

  /**
   * Регистрация секции с GSAP анимациями
   */
  private async registerSectionWithGSAP(sectionIndex: number, wrapper: HTMLElement): Promise<gsap.core.Timeline | null> {
    const elementTimeline = await createElementTimeline(wrapper, '[data-animation]');

    if (!elementTimeline) {
      console.warn(`Fallback активирован для секции ${sectionIndex}`);
      this.activateFallbackForSection(wrapper);
      return this.createFallbackController(sectionIndex, wrapper);
    }

    this.setupTimelineCallbacks(elementTimeline, wrapper);
    this.createAndStoreSectionController(sectionIndex, wrapper, elementTimeline);
    
    // Если это Hero секция, активируем её немедленно
    if (sectionIndex === 0) {
      this.activateCard(0);
    }

    return elementTimeline;
  }

  /**
   * Создание fallback контроллера
   */
  private createFallbackController(sectionIndex: number, wrapper: HTMLElement): null {
    const controller: SectionController = {
      timeline: gsap.timeline() as Omit<gsap.core.Timeline, 'then'>,
      wrapper,
      isActive: sectionIndex === 0,
    };
    
    this.sections.set(sectionIndex, controller);
    return null;
  }

  /**
   * Настройка колбэков для timeline
   */
  private setupTimelineCallbacks(timeline: Omit<gsap.core.Timeline, 'then'>, wrapper: HTMLElement): void {
    timeline.eventCallback('onReverseComplete', () => {
      clearElementAnimations(wrapper);
    });
  }

  /**
/**
   * Создание и сохранение контроллера секции
   */
  private createAndStoreSectionController(
    sectionIndex: number,
    wrapper: HTMLElement,
    timeline: Omit<gsap.core.Timeline, 'then'>,
  ): void {
    const controller: SectionController = {
      timeline,
      wrapper,
      isActive: sectionIndex === 0, // Hero активна по умолчанию
    };

    this.sections.set(sectionIndex, controller);
  }

  /**
   * Активация карточки с автоматическим управлением timeline
   */
  private activateCard(cardIndex: number): void {
    if (this.fallbackActive) {
      this.activateFallbackCard(cardIndex);
      return;
    }

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
        currentController.timeline.progress(0);
        // Небольшая задержка позволяет увидеть реверс состояние
        gsap.delayedCall(0.1, () => {
          if (currentController.isActive) {
            currentController.timeline.play();
          }
        });
      } else {
        // Для обычных анимаций используем стандартный подход
        currentController.timeline.progress(0).play();
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
  navigateToCard(cardIndex: number): void {
    if (!this.isInitialized) {
      console.warn('AnimationController not initialized');
      return;
    }

    if (!this.sections.has(cardIndex)) {
      console.warn(`Card with index ${cardIndex} not found`);
      return;
    }

    if (this.fallbackActive || !isGSAPReady() || !this.masterTimeline) {
      this.activateCard(cardIndex);
      return;
    }

    // Получаем ScrollTrigger из мастер timeline
    const scrollTrigger = this.masterTimeline.scrollTrigger;
    if (!scrollTrigger) {
      console.warn('ScrollTrigger not found in master timeline');
      return;
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
      return;
    }

    // Для остальных карточек вычисляем позицию
    const progress = cardIndex / Math.max(1, this.sections.size - 1);

    // Вычисляем позицию с учетом того, что end - это относительное значение
    const startPos = scrollTrigger.start;
    // end вычисляется как start + процент от viewport height
    const viewportHeight = window.innerHeight;
    const totalScrollDistance = (this.sections.size - 1) * viewportHeight;
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
  }

  /**
   * Получить индекс карточки по ID секции
   */
  getCardIndexBySectionId(sectionId: string): number {
    // Маппинг ID секций к индексам карточек
    const sectionMapping: Record<string, number> = {
      'hero-section': 0,
      'about-section': 1,
      'skills-section': 2,
      'projects-section': 3,
      'gallery-section': 4,
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
   * Активирует fallback режим для всех анимаций
   */
  private activateFallbackMode(): void {
    document.documentElement.classList.add('gsap-fallback');
    console.log('🔄 Активирован fallback режим анимаций');
  }

  /**
   * Активирует fallback анимации для конкретной секции
   */
  private activateFallbackForSection(wrapper: HTMLElement): void {
    wrapper.classList.add('fallback-animations');
    const elements = wrapper.querySelectorAll('[data-animation]');
    elements.forEach(el => {
      el.classList.add('animate-fallback');
    });
  }

  /**
   * Активирует карточку в fallback режиме
   */
  private activateFallbackCard(cardIndex: number): void {
    // Деактивируем все секции
    this.sections.forEach((controller, index) => {
      if (controller.isActive && index !== cardIndex) {
        controller.wrapper.classList.remove('active');
        controller.isActive = false;
      }
    });

    // Активируем целевую секцию
    const targetController = this.sections.get(cardIndex);
    if (targetController && !targetController.isActive) {
      targetController.wrapper.classList.add('active');
      targetController.isActive = true;
      this.activeCardIndex = cardIndex;
    }
  }

  /**
   * Проверка инициализации
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Проверка fallback режима
   */
  isFallbackActive(): boolean {
    return this.fallbackActive;
  }

  /**
   * Воспроизведение анимации
   */
  play(): void {
    if (this.fallbackActive) {
      this.triggerFallbackAnimations();
      return;
    }

    if (this.masterTimeline) {
      this.masterTimeline.play();
    }
  }

  /**
   * Пауза анимации
   */
  pause(): void {
    if (this.fallbackActive) {
      return; // CSS анимации не поддерживают паузу
    }

    if (this.masterTimeline) {
      this.masterTimeline.pause();
    }
  }

  /**
   * Перезапуск анимации
   */
  restart(): void {
    if (this.fallbackActive) {
      this.resetFallbackAnimations();
      setTimeout(() => this.triggerFallbackAnimations(), 50);
      return;
    }

    if (this.masterTimeline) {
      this.masterTimeline.restart();
    }
  }

  /**
   * Реверс анимации
   */
  reverse(): void {
    if (this.fallbackActive) {
      this.resetFallbackAnimations();
      return;
    }

    if (this.masterTimeline) {
      this.masterTimeline.reverse();
    }
  }

  /**
   * Настройка ScrollTrigger
   */
  setupScrollTrigger(config: ScrollTrigger.Vars): void {
    if (this.fallbackActive || !isGSAPReady()) {
      console.warn('ScrollTrigger недоступен в fallback режиме');
      return;
    }

    if (this.masterTimeline && window.ScrollTrigger) {
      window.ScrollTrigger.create({
        ...config,
        animation: this.masterTimeline
      });
    }
  }

  /**
   * Запуск fallback анимаций
   */
  private triggerFallbackAnimations(): void {
    this.sections.forEach((controller) => {
      if (controller.isActive) {
        const elements = controller.wrapper.querySelectorAll('[data-animation]');
        elements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animate-fallback');
          }, index * 100);
        });
      }
    });
  }

  /**
   * Сброс fallback анимаций
   */
  private resetFallbackAnimations(): void {
    this.sections.forEach((controller) => {
      const elements = controller.wrapper.querySelectorAll('[data-animation]');
      elements.forEach(el => {
        el.classList.remove('animate-fallback');
      });
    });
  }

  /**
   * Уничтожение контроллера
   */
  destroy(): void {
    if (this.fallbackActive) {
      this.resetFallbackAnimations();
      document.documentElement.classList.remove('gsap-fallback');
    } else {
      if (this.masterTimeline) {
        this.masterTimeline.kill();
      }

      this.sections.forEach((controller) => {
        controller.timeline.kill();
        clearElementAnimations(controller.wrapper);
      });

      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    }

    this.sections.clear();
    this.masterTimeline = null;
    this.isInitialized = false;
    this.fallbackActive = false;
  }
}

// Экспортируем singleton для использования в проекте
export const animationController = new AnimationController();
