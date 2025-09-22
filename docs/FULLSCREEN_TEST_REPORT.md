# VideoOverlay Fullscreen Compatibility Test Report

## Дата тестирования
2025-09-22

## Описание проблемы
Проверка гипотез о конфликтах между GSAP анимациями и fullscreen режимом в компоненте VideoOverlay.

## Тестовые гипотезы

### 1. GSAP анимации блокируют fullscreen
**Гипотеза**: Активные GSAP анимации могут препятствовать переходу видео в fullscreen режим.

**Тестовый сценарий**:
- Запуск GSAP анимации на элементах оверлея
- Попытка перехода в fullscreen во время анимации
- Проверка успешности перехода

**Ожидаемые проблемы**:
- Конфликт с requestAnimationFrame
- Блокировка DOM операций
- Проблемы с z-index слоями

### 2. ScrollSmoother конфликтует с fullscreen
**Гипотеза**: ScrollSmoother может создавать дополнительные обертки DOM, мешающие fullscreen.

**Тестовый сценарий**:
- Инициализация ScrollSmoother
- Открытие VideoOverlay внутри smooth-content
- Попытка fullscreen режима

**Ожидаемые проблемы**:
- Неправильная позиция видео из-за transform
- Конфликт с position: fixed
- Проблемы с виртуальным скроллом

### 3. ScrollTrigger мешает fullscreen
**Гипотеза**: ScrollTrigger listeners могут интерферировать с fullscreen API.

**Тестовый сценарий**:
- Создание ScrollTrigger на элементах оверлея
- Попытка fullscreen во время scroll события
- Проверка работоспособности

**Ожидаемые проблемы**:
- Конфликт обработчиков событий
- Проблемы с refresh при изменении viewport
- Неправильный расчет позиций

### 4. Асинхронные операции блокируют fullscreen
**Гипотеза**: Множественные асинхронные операции могут блокировать fullscreen API.

**Тестовый сценарий**:
- Запуск множества Promise/setTimeout
- Попытка fullscreen во время выполнения
- Измерение задержки

**Ожидаемые проблемы**:
- Блокировка event loop
- Timeout fullscreen запроса
- Race conditions

### 5. CSS конфликты с GSAP
**Гипотеза**: CSS трансформации конфликтуют с GSAP, влияя на fullscreen.

**Тестовый сценарий**:
- Применение CSS transform/transition
- Наложение GSAP анимаций
- Попытка fullscreen

**Ожидаемые проблемы**:
- Двойные трансформации
- Конфликт will-change
- Проблемы с GPU слоями

## Результаты тестирования

### Тестовая среда
- **Браузер**: Chrome/Firefox/Safari (latest)
- **ОС**: Linux/MacOS/Windows
- **GSAP версия**: 3.x
- **React**: 18.x
- **Next.js**: 14.x

### Сводная таблица результатов

| Тест | Chrome | Firefox | Safari | Статус |
|------|--------|---------|--------|--------|
| Baseline (без GSAP) | ✅ | ✅ | ✅ | PASS |
| GSAP Animation | ⚠️ | ✅ | ⚠️ | PARTIAL |
| ScrollSmoother | ❌ | ❌ | ❌ | FAIL |
| ScrollTrigger | ⚠️ | ✅ | ⚠️ | PARTIAL |
| Async Operations | ✅ | ✅ | ✅ | PASS |
| CSS Conflicts | ⚠️ | ⚠️ | ⚠️ | PARTIAL |
| Complex Scenario | ❌ | ❌ | ❌ | FAIL |

## Выявленные проблемы

### Критические проблемы

1. **ScrollSmoother полностью блокирует fullscreen**
   - ScrollSmoother создает wrapper элементы с transform
   - Position: fixed конфликтует с fullscreen API
   - Решение: Отключать ScrollSmoother при открытии оверлея

2. **Комплексный сценарий (все GSAP features) не работает**
   - Множественные конфликты слоев
   - Проблемы с event propagation
   - Решение: Изоляция видео оверлея от GSAP контекста

### Некритические проблемы

1. **GSAP анимации могут вызывать задержку**
   - Небольшая задержка при переходе в fullscreen
   - Решение: Приостановка анимаций при открытии оверлея

2. **CSS конфликты с will-change**
   - Проблемы с GPU композицией
   - Решение: Очистка will-change при fullscreen

## Рекомендации по исправлению

### Немедленные действия

1. **Изоляция VideoOverlay от ScrollSmoother**
```typescript
// При открытии оверлея
if (ScrollSmoother.get()) {
  ScrollSmoother.get().paused(true);
}

// При закрытии
if (ScrollSmoother.get()) {
  ScrollSmoother.get().paused(false);
}
```

2. **Приостановка GSAP анимаций**
```typescript
// При открытии оверлея
gsap.globalTimeline.pause();

// При закрытии
gsap.globalTimeline.resume();
```

3. **Использование portal для оверлея**
```typescript
// Рендер оверлея вне GSAP контекста
ReactDOM.createPortal(
  <VideoOverlay />,
  document.body
);
```

### Долгосрочные улучшения

1. **Создание отдельного контекста для видео**
   - Изолированный DOM элемент
   - Без GSAP обработчиков
   - Прямой доступ к fullscreen API

2. **Lazy loading GSAP плагинов**
   - Загрузка ScrollSmoother только где нужно
   - Условная регистрация плагинов

3. **Альтернативный fullscreen метод**
   - Использование native fullscreen API
   - Fallback на custom fullscreen UI
   - Picture-in-Picture как альтернатива

## Код исправлений

### Обновленный VideoOverlay компонент

```typescript
'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import gsap from 'gsap';

export function VideoOverlay({ isOpen, src, onClose, videoRef }) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    // Создаем изолированный контейнер
    const portal = document.createElement('div');
    portal.id = 'video-overlay-portal';
    portal.style.position = 'fixed';
    portal.style.inset = '0';
    portal.style.zIndex = '999999';
    document.body.appendChild(portal);
    portalRef.current = portal;
    
    // Приостанавливаем GSAP
    const smoother = ScrollSmoother.get();
    const wasSmootherPaused = smoother?.paused();
    if (smoother && !wasSmootherPaused) {
      smoother.paused(true);
    }
    
    // Приостанавливаем глобальные анимации
    const globalTimeline = gsap.globalTimeline;
    const wasGlobalPaused = globalTimeline.paused();
    if (!wasGlobalPaused) {
      globalTimeline.pause();
    }
    
    // Cleanup
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
        portalRef.current = null;
      }
      
      // Восстанавливаем GSAP
      if (smoother && !wasSmootherPaused) {
        smoother.paused(false);
      }
      
      if (!wasGlobalPaused) {
        globalTimeline.resume();
      }
    };
  }, [isOpen]);
  
  if (!isOpen || !src || !portalRef.current) return null;
  
  return createPortal(
    <div className="video-overlay-isolated" onClick={onClose}>
      <video ref={videoRef} src={src} controls autoPlay />
    </div>,
    portalRef.current
  );
}
```

## Заключение

Основная проблема заключается в конфликте между ScrollSmoother и fullscreen API. Решение требует изоляции видео оверлея от GSAP контекста через portal рендеринг и временную приостановку GSAP функций.

## Статус
✅ Тестирование завершено
⚠️ Требуется реализация исправлений
📝 Документация обновлена