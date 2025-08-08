# Руководство по мобильной оптимизации GSAP анимаций

## Обзор изменений

В модуле `AnimatedCardSection` добавлена мобильная оптимизация с использованием `gsap.matchMedia()` для создания адаптивных анимаций.

## Ключевые улучшения

### 1. Адаптивные настройки анимации (`cardDeckAnimation.ts`)

- **Мобильные устройства (≤767px)**:
  - Упрощенные анимации
  - Более быстрая прокрутка (scrub: 0.5)
  - Сокращенная длительность (duration: 0.3)
  - Отключение сложных эффектов на слабых устройствах

- **Планшеты (768px-1024px)**:
  - Умеренные настройки
  - Средняя скорость прокрутки (scrub: 0.8)

- **Десктоп (≥1025px)**:
  - Полные анимации
  - Максимальное качество

### 2. Оптимизированные ScrollTrigger настройки (`sectionAnimationUtils.ts`)

- **Мобильная оптимизация**:
  - `anticipatePin: 1` - улучшенная производительность пиннинга
  - `fastScrollEnd: true` - быстрое завершение при быстрой прокрутке
  - `refreshPriority: -1` - низкий приоритет обновления

- **Адаптивные точки срабатывания**:
  - Мобильные: start 'top 90%', end 'bottom 10%'
  - Планшеты: start 'top 85%', end 'bottom 15%'
  - Десктоп: start 'top 80%', end 'bottom 20%'

## Использование

### Базовые настройки ScrollTrigger

```typescript
import { getScrollTriggerSettings } from './sectionAnimationUtils';

// Автоматическое определение устройства
const settings = getScrollTriggerSettings(sectionIndex);

// Явное указание типа устройства
const mobileSettings = getScrollTriggerSettings(sectionIndex, 'mobile');
const tabletSettings = getScrollTriggerSettings(sectionIndex, 'tablet');
const desktopSettings = getScrollTriggerSettings(sectionIndex, 'desktop');
```

### Адаптивные настройки с matchMedia

```typescript
import { getResponsiveScrollTriggerSettings } from './sectionAnimationUtils';

const responsiveSettings = getResponsiveScrollTriggerSettings(
  sectionIndex,
  triggerElement,
  { pin: true, scrub: true }
);
```

## Преимущества

1. **Производительность**: Упрощенные анимации на мобильных устройствах
2. **UX**: Адаптивные настройки для разных размеров экрана
3. **Батарея**: Оптимизация энергопотребления на мобильных
4. **Совместимость**: Поддержка всех типов устройств

## Рекомендации

- Тестируйте анимации на реальных мобильных устройствах
- Используйте Chrome DevTools для эмуляции разных экранов
- Мониторьте производительность с помощью Performance API
- При необходимости добавляйте дополнительные breakpoints

## Структура файлов

```
AnimatedCardSection/
├── utils/
│   ├── cardDeckAnimation.ts      # Адаптивные анимации колоды
│   ├── sectionAnimationUtils.ts  # Оптимизированные ScrollTrigger
│   └── sectionInitializers.ts    # Инициализация с определением устройства
```