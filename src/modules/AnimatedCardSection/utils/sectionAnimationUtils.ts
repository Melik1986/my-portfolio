import { gsap } from 'gsap';

import type { ScrollTriggerSettings } from '../types/animated-card-section';

/**
 * Очищает анимации для всех элементов внутри секции
 * @param wrapper - элемент секции
 */
export function clearElementAnimations(wrapper: HTMLElement): void {
  const elements = wrapper.querySelectorAll('[data-animate], [data-animation]');
  elements.forEach((element) => {
    gsap.set(element, { clearProps: 'all' });
  });
}

/**
 * Получает адаптивные параметры ScrollTrigger для мобильных устройств
 */
function getMobileScrollTriggerSettings(): ScrollTriggerSettings {
  return {
    start: 'top 90%', // Более поздний старт для мобильных
    end: 'bottom 10%', // Более ранний конец
    scrub: 0.3, // Более плавная прокрутка
    anticipatePin: 1, // Оптимизация пиннинга
    refreshPriority: -1, // Низкий приоритет обновления
    fastScrollEnd: true, // Быстрое завершение при быстрой прокрутке
  };
}

/**
 * Получает адаптивные параметры ScrollTrigger для планшетов
 */
function getTabletScrollTriggerSettings(): ScrollTriggerSettings {
  return {
    start: 'top 85%',
    end: 'bottom 15%',
    scrub: 0.5,
    anticipatePin: 0.5,
    refreshPriority: 0,
  };
}

/**
 * Получает адаптивные параметры ScrollTrigger для десктопа
 */
function getDesktopScrollTriggerSettings(): ScrollTriggerSettings {
  return {
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    anticipatePin: 0,
    refreshPriority: 1,
  };
}

/**
 * Получает параметры ScrollTrigger для секции с учетом устройства
 * @param sectionIndex - индекс секции
 * @param deviceType - тип устройства ('mobile' | 'tablet' | 'desktop')
 */
export function getScrollTriggerSettings(
  sectionIndex: number,
  deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): ScrollTriggerSettings {
  const baseSettings = (() => {
    switch (deviceType) {
      case 'mobile':
        return getMobileScrollTriggerSettings();
      case 'tablet':
        return getTabletScrollTriggerSettings();
      default:
        return getDesktopScrollTriggerSettings();
    }
  })();

  // Специфичные настройки для разных секций
  const sectionSpecificSettings = (() => {
    if (sectionIndex === 1) {
      return deviceType === 'mobile'
        ? { start: 'top 95%', end: 'bottom 5%' }
        : { start: 'top 80%', end: 'bottom 20%' };
    }
    if (sectionIndex === 2) {
      return deviceType === 'mobile'
        ? { start: 'top 90%', end: 'bottom 10%' }
        : { start: 'top 80%', end: 'bottom 20%' };
    }
    if (sectionIndex === 3) {
      return deviceType === 'mobile'
        ? { start: 'top 85%', end: 'bottom 15%' }
        : { start: 'top 80%', end: 'bottom 20%' };
    }
    if (sectionIndex === 4) {
      return deviceType === 'mobile'
        ? { start: 'top 80%', end: 'bottom 20%' }
        : { start: 'top 80%', end: 'bottom 20%' };
    }
    return deviceType === 'mobile'
      ? { start: 'top 90%', end: 'bottom 10%' }
      : { start: 'top 80%', end: 'bottom 5%' };
  })();

  return {
    ...baseSettings,
    ...sectionSpecificSettings,
  };
}

/**
 * Получает оптимизированные настройки ScrollTrigger с помощью gsap.matchMedia()
 * @param sectionIndex - индекс секции
 * @param trigger - элемент триггера
 * @param additionalSettings - дополнительные настройки
 */
export function getResponsiveScrollTriggerSettings(
  sectionIndex: number,
  trigger: HTMLElement,
  additionalSettings: Partial<ScrollTriggerSettings> = {}
): ScrollTriggerSettings {
  const mm = gsap.matchMedia();
  let scrollTriggerSettings = {} as ScrollTriggerSettings;

  // Мобильные устройства
  mm.add('(max-width: 767px)', () => {
    scrollTriggerSettings = {
      ...getScrollTriggerSettings(sectionIndex, 'mobile'),
      trigger,
      ...additionalSettings,
    };
  });

  // Планшеты
  mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
    scrollTriggerSettings = {
      ...getScrollTriggerSettings(sectionIndex, 'tablet'),
      trigger,
      ...additionalSettings,
    };
  });

  // Десктоп
  mm.add('(min-width: 1025px)', () => {
    scrollTriggerSettings = {
      ...getScrollTriggerSettings(sectionIndex, 'desktop'),
      trigger,
      ...additionalSettings,
    };
  });

  return scrollTriggerSettings;
}
