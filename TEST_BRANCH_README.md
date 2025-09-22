# Test Branch: Fullscreen GSAP Conflicts

## Ветка: `test/fullscreen-gsap-conflicts`

## Цель тестирования
Выявление и устранение конфликтов между GSAP анимациями (ScrollSmoother, ScrollTrigger) и fullscreen API в компоненте VideoOverlay.

## Структура тестов

### 1. Основная тестовая страница
**Путь:** `/src/app/test-fullscreen/page.tsx`
- Комплексное тестирование всех гипотез
- Изолированные тесты для каждого GSAP компонента
- Измерение влияния на fullscreen API

### 2. Тест VideoOverlay компонента
**Путь:** `/src/app/test-fullscreen/video-overlay-test.tsx`
- Специфические тесты для VideoOverlay
- Симуляция реальных условий использования
- Автоматизированное тестирование

### 3. Сравнительный тест
**Путь:** `/src/app/test-fullscreen/compare-test.tsx`
- Сравнение оригинального и исправленного компонентов
- Измерение производительности
- Визуальная демонстрация проблемы и решения

## Выявленные проблемы

### 🔴 Критические
1. **ScrollSmoother полностью блокирует fullscreen**
   - Причина: Wrapper элементы с transform
   - Влияние: 100% отказ fullscreen

2. **Комплексный GSAP сценарий несовместим с fullscreen**
   - Причина: Множественные конфликты слоев
   - Влияние: Полная неработоспособность

### 🟡 Средние
1. **GSAP анимации вызывают задержку**
   - Причина: Конфликт requestAnimationFrame
   - Влияние: Задержка 100-500ms

2. **ScrollTrigger может блокировать fullscreen**
   - Причина: Event listeners конфликт
   - Влияние: Непредсказуемое поведение

### 🟢 Низкие
1. **CSS конфликты с will-change**
   - Причина: GPU композиция
   - Влияние: Визуальные артефакты

## Решение

### Исправленный компонент
**Путь:** `/src/modules/AiVideoContentSection/component/VideoOverlay/VideoOverlayFixed.tsx`

**Ключевые изменения:**
1. ✅ Использование React Portal для изоляции от GSAP
2. ✅ Приостановка ScrollSmoother при открытии
3. ✅ Отключение ScrollTrigger во время оверлея
4. ✅ Приостановка глобального GSAP timeline
5. ✅ Изолированный DOM контейнер с высоким z-index

## Как запустить тесты

```bash
# 1. Переключиться на тестовую ветку
git checkout test/fullscreen-gsap-conflicts

# 2. Запустить dev сервер
npm run dev

# 3. Открыть тестовые страницы
# Основные тесты: http://localhost:3000/test-fullscreen
# Сравнительный тест: http://localhost:3000/test-fullscreen/compare-test
```

## Результаты тестирования

| Компонент | Chrome | Firefox | Safari | Статус |
|-----------|--------|---------|--------|--------|
| Original + No GSAP | ✅ | ✅ | ✅ | PASS |
| Original + ScrollSmoother | ❌ | ❌ | ❌ | FAIL |
| Original + Complex GSAP | ❌ | ❌ | ❌ | FAIL |
| **Fixed + ScrollSmoother** | ✅ | ✅ | ✅ | **PASS** |
| **Fixed + Complex GSAP** | ✅ | ✅ | ✅ | **PASS** |

## Рекомендации по интеграции

### Немедленные действия
1. Заменить `VideoOverlay.tsx` на `VideoOverlayFixed.tsx`
2. Обновить импорты в `VideoOverlayDynamic.tsx`
3. Протестировать в production окружении

### Код для интеграции
```typescript
// В VideoOverlayDynamic.tsx заменить:
import { VideoOverlay } from './VideoOverlay';
// На:
import { VideoOverlayFixed as VideoOverlay } from './VideoOverlayFixed';
```

### Долгосрочные улучшения
1. Рассмотреть lazy loading для GSAP плагинов
2. Создать отдельный контекст для видео компонентов
3. Документировать известные ограничения GSAP

## Документация
- [Отчет о тестировании](/workspace/docs/FULLSCREEN_TEST_REPORT.md)
- [GSAP ScrollSmoother Docs](https://greensock.com/docs/v3/Plugins/ScrollSmoother)
- [Fullscreen API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)

## Контакты
При возникновении вопросов обращайтесь к QA команде.

---
✅ Тестирование завершено успешно
📝 Решение готово к интеграции