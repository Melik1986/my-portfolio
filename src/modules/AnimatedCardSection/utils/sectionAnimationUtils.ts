import { gsap } from 'gsap';
import { cleanupSplitTextInstances } from '@/lib/gsap/hooks/useElementTimeline';

import type { ScrollTriggerSettings } from '../types/animated-card-section';

/**
 * Глобальный реестр timeline'ов для синхронизации элементных анимаций
 */
class ElementTimelineRegistry {
  private timelines = new Map<number, gsap.core.Timeline>();
  private masterTimeline: gsap.core.Timeline | null = null;
  private activeCardIndex = 0;

  /**
   * Регистрирует timeline элементов для секции
   */
  registerTimeline(sectionIndex: number, timeline: gsap.core.Timeline): void {
    this.timelines.set(sectionIndex, timeline);
  }

  /**
   * Устанавливает master timeline для синхронизации
   */
  setMasterTimeline(timeline: gsap.core.Timeline): void {
    this.masterTimeline = timeline;
  }

  /**
   * Обновляет активную карточку и запускает соответствующие анимации
   */
  updateActiveCard(cardIndex: number): void {
    // Останавливаем анимацию предыдущей карточки
    const prevTimeline = this.timelines.get(this.activeCardIndex);
    if (prevTimeline) {
      prevTimeline.reverse();
    }

    // Запускаем анимацию новой активной карточки
    this.activeCardIndex = cardIndex;
    const currentTimeline = this.timelines.get(cardIndex);
    if (currentTimeline) {
      currentTimeline.progress(0).play();
    }
  }

  /**
   * Очищает реестр
   */
  clear(): void {
    this.timelines.forEach(timeline => timeline.kill());
    this.timelines.clear();
    this.masterTimeline = null;
    this.activeCardIndex = 0;
  }

  /**
   * Получает активную карточку
   */
  getActiveCardIndex(): number {
    return this.activeCardIndex;
  }
}

// Синглтон для глобального доступа
export const elementTimelineRegistry = new ElementTimelineRegistry();

/**
 * Очищает анимации для всех элементов внутри секции
 * @param wrapper - элемент секции
 */
export function clearElementAnimations(wrapper: HTMLElement): void {
  // Очищаем SplitText экземпляры перед очисткой GSAP свойств
  cleanupSplitTextInstances(wrapper);

  const elements = wrapper.querySelectorAll('[data-animate], [data-animation]');
  elements.forEach((element) => {
    gsap.set(element, { clearProps: 'all' });
  });
}

/**
 * Получает настройки ScrollTrigger для секций с адаптивностью
 * @param sectionIndex - индекс секции
 * @returns настройки ScrollTrigger
 */
export function getScrollTriggerSettings(sectionIndex: number): ScrollTriggerSettings {
  // Базовые настройки - одинаковые для всех секций
  const baseSettings: ScrollTriggerSettings = {
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: false,
  };

  // Специфичные настройки только для первых секций на мобильных
  if (sectionIndex === 1) {
    return {
      ...baseSettings,
      start: 'top 90%',
      end: 'bottom 10%',
    };
  }

  return baseSettings;
}
