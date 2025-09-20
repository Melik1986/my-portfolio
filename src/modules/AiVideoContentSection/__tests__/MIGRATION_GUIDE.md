# 📋 Руководство по миграции VideoOverlay → VideoOverlayFixed

## Проблема
Текущая реализация `VideoOverlay` не поддерживает fullscreen режим из-за конфликтов с:
- GSAP ScrollSmoother (виртуальный скролл контейнер)
- CSS позиционирование (`position: absolute` внутри трансформированных контейнеров)
- Высокий z-index стек внутри GSAP контейнеров

## Решение
`VideoOverlayFixed` - исправленная версия с:
- ✅ React Portal для рендера вне GSAP контейнеров
- ✅ Поддержка Fullscreen API
- ✅ Автоматическое отключение ScrollSmoother
- ✅ Fixed позиционирование
- ✅ Кастомная кнопка fullscreen

---

## 🔄 Шаги миграции

### 1. Замените импорт компонента

**Было:**
```typescript
import { VideoOverlay } from './component/VideoOverlay/VideoOverlay';
// или
import { VideoOverlayDynamic } from './component/VideoOverlay/VideoOverlayDynamic';
```

**Стало:**
```typescript
import { VideoOverlayFixed } from './component/VideoOverlay/VideoOverlayFixed';
```

### 2. Обновите использование в AiVideoContentSection.tsx

**Было:**
```typescript
<VideoOverlayDynamic
  isOpen={state.isOpen}
  src={state.activeSrc}
  onClose={closeOverlay}
  videoRef={overlayVideoRef}
/>
```

**Стало:**
```typescript
<VideoOverlayFixed
  isOpen={state.isOpen}
  src={state.activeSrc}
  onClose={closeOverlay}
  videoRef={overlayVideoRef}
/>
```

### 3. Обновите стили (опционально)

Если используете кастомные стили, импортируйте новый файл стилей:

```typescript
import styles from './VideoOverlayFixed.module.scss';
```

---

## 📝 Полный пример миграции

### Файл: `/src/modules/AiVideoContentSection/AiVideoContentSection.tsx`

```diff
'use client';

import React from 'react';
import { AiVideoContentProps } from './types/AiVideoContent.types';
import { VideoMarqueeGroupDynamic } from './component/VideoMarqueeGroup/VideoMarqueeGroupDynamic';
- import { VideoOverlayDynamic } from './component/VideoOverlay/VideoOverlayDynamic';
+ import { VideoOverlayFixed } from './component/VideoOverlay/VideoOverlayFixed';
import {
  DEFAULT_VIDEO_ROWS,
  DEFAULT_VIDEO_DESCRIPTION,
} from './constants/AiVideoContent.constants';

// ... остальной код ...

export function AiVideoContentSection({
  horizontalTexts = AI_CONTENT_CONSTANTS.DEFAULT_HORIZONTAL_TEXTS,
  videoRows = DEFAULT_VIDEO_ROWS,
  title = AI_CONTENT_CONSTANTS.DEFAULT_TITLE,
  description = DEFAULT_VIDEO_DESCRIPTION,
  className = '',
}: AiVideoContentProps) {
  const { t } = useI18n();
  const { containerRef, overlayVideoRef, state, onContainerClick, closeOverlay } =
    useVideoOverlay();
    
  return (
    <section className={`${styles['ai-content']} ${className}`} id="ai-video-content-section">
      {/* ... */}
      
      <div
        ref={containerRef}
        onClick={onContainerClick}
        className={groupStyles['ai-content__overlay-anchor']}
      >
        <VideoMarqueeGroupDynamic rows={videoRows} />
-       <VideoOverlayDynamic
+       <VideoOverlayFixed
          isOpen={state.isOpen}
          src={state.activeSrc}
          onClose={closeOverlay}
          videoRef={overlayVideoRef}
        />
      </div>
      
      {/* ... */}
    </section>
  );
}
```

---

## 🆕 Новые возможности

### 1. Fullscreen через кнопку
```typescript
// Автоматически добавлена кнопка fullscreen в UI
// Пользователь может нажать на неё для входа в полноэкранный режим
```

### 2. Fullscreen через двойной клик
```typescript
// Двойной клик по видео автоматически включает fullscreen
// Стандартное поведение как в YouTube
```

### 3. Автоматическое управление ScrollSmoother
```typescript
// При открытии overlay:
// - ScrollSmoother автоматически ставится на паузу
// - Сохраняется позиция скролла
// - Блокируется скролл body

// При закрытии:
// - ScrollSmoother возобновляется
// - Восстанавливается позиция скролла
```

---

## ⚠️ Важные изменения

### 1. Portal рендеринг
- Overlay теперь рендерится в `document.body`
- Не наследует стили и трансформации родительских элементов
- Может потребоваться обновление e2e тестов

### 2. Z-index
- Изменён с `10000` на `999999` (не максимальный, но очень высокий)
- В fullscreen режиме: `2147483647` (максимальный)

### 3. Позиционирование
- Изменено с `absolute` на `fixed`
- Всегда покрывает весь viewport

---

## 🧪 Тестирование после миграции

### Ручное тестирование:
1. ✅ Открытие видео overlay
2. ✅ Вход в fullscreen через кнопку
3. ✅ Вход в fullscreen через двойной клик
4. ✅ Выход из fullscreen через ESC
5. ✅ Закрытие overlay
6. ✅ Проверка работы скролла после закрытия

### Автоматическое тестирование:
```bash
npm test VideoOverlayFullscreen.test.tsx
```

---

## 🔙 Откат (если необходимо)

Если нужно вернуться к старой версии:

1. Верните импорт `VideoOverlayDynamic`
2. Удалите файлы:
   - `VideoOverlayFixed.tsx`
   - `VideoOverlayFixed.module.scss`
   - `VideoOverlayFullscreen.test.tsx`

---

## 📊 Сравнение версий

| Функция | VideoOverlay (старая) | VideoOverlayFixed (новая) |
|---------|----------------------|---------------------------|
| Fullscreen поддержка | ❌ | ✅ |
| React Portal | ❌ | ✅ |
| Управление ScrollSmoother | ❌ | ✅ |
| Позиционирование | absolute | fixed |
| Z-index | 10000 | 999999 |
| Двойной клик для fullscreen | ❌ | ✅ |
| Кастомная кнопка fullscreen | ❌ | ✅ |
| Блокировка body scroll | ❌ | ✅ |

---

## 💡 Рекомендации

1. **Протестируйте на всех браузерах:**
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari (особенно iOS)

2. **Проверьте мобильные устройства:**
   - iOS Safari
   - Android Chrome
   - Планшеты в landscape режиме

3. **Мониторинг после деплоя:**
   - Следите за ошибками в консоли
   - Проверьте метрики производительности
   - Убедитесь что ScrollSmoother корректно работает

---

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь что GSAP плагины зарегистрированы
3. Проверьте что ScrollSmoother инициализирован
4. Обратитесь к QA отчёту: `VideoOverlay.test.report.md`

---

*Последнее обновление: 20.09.2025*