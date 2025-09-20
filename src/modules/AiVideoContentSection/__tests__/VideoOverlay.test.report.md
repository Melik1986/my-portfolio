# QA Отчет: Анализ VideoOverlay и конфликтов с Fullscreen

## Дата анализа: 20.09.2025
## QA-инженер: AI Assistant

---

## 🔍 АНАЛИЗ КОМПОНЕНТОВ

### 1. VideoOverlay.tsx
**Статус:** ✅ Безопасный

#### Найденные особенности:
- Использует `position: absolute` вместо `fixed`
- z-index: 10000 (очень высокий приоритет)
- НЕ использует GSAP анимации напрямую
- Простая React-компонента с HTML5 video элементом
- Обработчик ESC клавиши активен только при открытом оверлее

#### Потенциальные проблемы:
- ❌ **НЕТ прямого API для fullscreen** - компонент не имеет встроенной поддержки fullscreen режима
- ⚠️ Использует `position: absolute` с `inset: 0`, что может конфликтовать с fullscreen API

### 2. VideoOverlay.module.scss
**Статус:** ⚠️ Требует внимания

#### Найденные проблемы:
```scss
.overlay {
  position: absolute;  // ⚠️ Может блокировать fullscreen
  inset: 0;
  z-index: 10000;     // ⚠️ Очень высокий z-index
  backdrop-filter: blur(2px); // ⚠️ Может конфликтовать с fullscreen
}
```

### 3. VideoOverlayDynamic.tsx
**Статус:** ✅ Безопасный

#### Особенности:
- Динамический импорт с `ssr: false`
- Предзагрузка при открытии
- НЕ блокирует основной поток выполнения

---

## 🎯 ПРОВЕРКА ГИПОТЕЗ

### ❌ Гипотеза 1: GSAP анимации блокируют fullscreen
**Результат:** НЕ ПОДТВЕРЖДЕНА

**Доказательства:**
- VideoOverlay НЕ использует GSAP напрямую
- Анимации GSAP применяются только к родительскому контейнеру через data-атрибуты
- В AiVideoContentSection.tsx анимация `zoom-in` применена к wrapper, а не к видео

### ⚠️ Гипотеза 2: ScrollSmoother конфликтует с fullscreen
**Результат:** ЧАСТИЧНО ПОДТВЕРЖДЕНА

**Найденные проблемы:**
1. ScrollSmoother создает виртуальный скролл контейнер
2. Использует `position: fixed` для wrapper элементов
3. Может изменять DOM структуру, что конфликтует с fullscreen API

**Критический код в useScrollSmoother.ts:**
```typescript
const smoother = ScrollSmoother.create({
  wrapper: options.wrapperElement,
  content: options.contentElement,
  smooth: options.smooth,
  effects: options.effects,
  normalizeScroll: options.normalizeScroll,
});
```

### ⚠️ Гипотеза 3: ScrollTrigger мешает fullscreen
**Результат:** ВОЗМОЖНО ПОДТВЕРЖДЕНА

**Проблемы:**
- ScrollTrigger обновляется после инициализации ScrollSmoother
- Множественные вызовы `ScrollTrigger.refresh()` могут сбрасывать состояние DOM

### ❌ Гипотеза 4: Асинхронные операции блокируют fullscreen
**Результат:** НЕ ПОДТВЕРЖДЕНА

**Анализ:**
- Динамический импорт происходит корректно
- Нет блокирующих Promise или async/await в критических местах

### ✅ Гипотеза 5: CSS конфликты с GSAP
**Результат:** ПОДТВЕРЖДЕНА

**Найденные конфликты:**
1. **position: absolute vs fullscreen API**
   - Overlay использует `position: absolute` с `inset: 0`
   - Fullscreen API требует прямой доступ к элементу видео

2. **z-index слои**
   - VideoOverlay: z-index: 10000
   - Кнопка закрытия: z-index: 2 (относительно overlay)
   - Может конфликтовать с fullscreen слоем браузера

3. **Родительский контейнер с position: relative**
   - `.ai-content__overlay-anchor` имеет `position: relative`
   - Создает новый stacking context, блокирующий fullscreen

---

## 🐛 ОСНОВНАЯ ПРОБЛЕМА

**Видео элемент находится внутри множественных вложенных контейнеров с CSS трансформациями и позиционированием:**

```
AiVideoContentSection
  └── div[ref=containerRef] (.ai-content__overlay-anchor) // position: relative
      └── VideoOverlay
          └── div.overlay // position: absolute, z-index: 10000
              └── div.overlayContent
                  └── video // ⚠️ Не может войти в fullscreen
```

---

## ✅ РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ

### 1. Добавить поддержку Fullscreen API

```typescript
// В VideoOverlay.tsx добавить:
const handleFullscreen = async () => {
  const video = videoRef.current;
  if (!video) return;
  
  try {
    if (video.requestFullscreen) {
      await video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      await (video as any).webkitRequestFullscreen();
    }
  } catch (err) {
    console.error('Fullscreen failed:', err);
  }
};
```

### 2. Изменить CSS позиционирование

```scss
// Использовать fixed вместо absolute для overlay
.overlay {
  position: fixed; // Изменить на fixed
  inset: 0;
  z-index: 10000;
}

// Добавить класс для fullscreen режима
.overlay--fullscreen {
  z-index: 2147483647; // Максимальный z-index
}
```

### 3. Отключать ScrollSmoother при открытии видео

```typescript
// В useVideoOverlay.ts
useEffect(() => {
  if (isOpen) {
    // Отключить ScrollSmoother
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.paused(true);
    }
  }
  return () => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.paused(false);
    }
  };
}, [isOpen]);
```

### 4. Вынести видео из GSAP контейнера

```typescript
// Рендерить VideoOverlay через React Portal
import { createPortal } from 'react-dom';

export function VideoOverlay({ isOpen, src, onClose, videoRef }: VideoOverlayProps) {
  if (!isOpen || !src) return null;
  
  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      {/* содержимое */}
    </div>,
    document.body // Рендерить в body, вне GSAP контейнеров
  );
}
```

### 5. Добавить кнопку fullscreen в controls

```typescript
// Добавить кастомную кнопку fullscreen
<button 
  onClick={handleFullscreen}
  className={styles.fullscreenButton}
  aria-label="Enter fullscreen"
>
  ⛶
</button>
```

---

## 📊 ПРИОРИТЕТ ИСПРАВЛЕНИЙ

1. **КРИТИЧНО:** Использовать React Portal для рендера overlay вне GSAP контейнеров
2. **ВАЖНО:** Изменить position: absolute на fixed
3. **ВАЖНО:** Добавить поддержку Fullscreen API
4. **ЖЕЛАТЕЛЬНО:** Отключать ScrollSmoother при открытом видео
5. **ОПЦИОНАЛЬНО:** Добавить кастомные контролы для fullscreen

---

## 🧪 ТЕСТОВЫЕ СЦЕНАРИИ

### Тест 1: Fullscreen через браузерные контролы
1. Открыть видео overlay
2. Нажать на кнопку fullscreen в контролах видео
3. **Ожидаемый результат:** Видео открывается в fullscreen
4. **Текущий результат:** ❌ Fullscreen не работает

### Тест 2: Fullscreen через двойной клик
1. Открыть видео overlay
2. Дважды кликнуть на видео
3. **Ожидаемый результат:** Видео открывается в fullscreen
4. **Текущий результат:** ❌ Fullscreen не работает

### Тест 3: ScrollSmoother влияние
1. Прокрутить страницу
2. Открыть видео overlay
3. Попытаться войти в fullscreen
4. **Проблема:** ScrollSmoother может блокировать fullscreen из-за виртуального скролла

---

## 📝 ЗАКЛЮЧЕНИЕ

Основная проблема заключается в конфликте между:
1. CSS позиционированием (absolute + высокий z-index)
2. GSAP ScrollSmoother, создающим виртуальный скролл контейнер
3. Вложенностью видео элемента в множественные контейнеры с трансформациями

**Решение:** Использовать React Portal для рендера VideoOverlay вне основного DOM дерева и GSAP контейнеров, изменить позиционирование на fixed, и добавить явную поддержку Fullscreen API.

---

## 📎 ДОПОЛНИТЕЛЬНЫЕ ФАЙЛЫ ДЛЯ АНАЛИЗА

- `/workspace/src/lib/gsap/hooks/useScrollSmoother.ts` - конфигурация ScrollSmoother
- `/workspace/src/modules/AiVideoContentSection/hooks/useVideoOverlay.ts` - логика управления overlay
- `/workspace/src/modules/AiVideoContentSection/AiVideoContentSection.tsx` - родительский компонент

---

*Отчет подготовлен автоматизированной системой QA-тестирования*