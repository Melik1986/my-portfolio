# Техническое задание: AiVideoContentSection

## 📋 Обзор проекта

**Цель**: Создать новую секцию `AiVideoContentSection` для портфолио, которая будет демонстрировать видео-контент с анимированными бегущими строками (marquee), аналогично существующей `AiContentSection`, но с видео вместо изображения VerticalMarquee.

## 🎯 Основные требования

### Функциональные требования
1. **Видео-контент**: Отображение видео в горизонтальных трех бегущих дорожках как в  VerticalMarquee но горизонтально 
2. **Анимации**: Плавные, бесшовные анимации прокрутки видео полностю копирует анимацию из VerticalMarquee

3. **Адаптивность**: Корректная работа на всех устройствах
4. **Производительность**: Оптимизированная загрузка и воспроизведение видео
5. **Доступность**: Поддержка `prefers-reduced-motion`

### Технические требования
1. **TypeScript**: Строгая типизация всех компонентов
2. **Модульность**: Переиспользуемые компоненты
3. **BEM**: Методология именования CSS классов
4. **SCSS Modules**: Изолированные стили
5. **Next.js**: Совместимость с SSR/SSG

## 🏗️ Архитектура проекта

### Структура директорий
```
src/modules/AiVideoContentSection/
├── component/
│   ├── HorizontalVideoMarquee/     #
│   │   ├── HorizontalVideoMarquee.tsx
│   │   ├── HorizontalVideoMarquee.module.scss
│   │   └── index.ts
│   ├── VerticalVideoMarquee/       # 🔄 В планах
│   │   ├── VerticalVideoMarquee.tsx
│   │   ├── VerticalVideoMarquee.module.scss
│   │   └── index.ts
│   ├── VerticalVideoMarqueeGroup/  # 🔄 В планах
│   │   ├── VerticalVideoMarqueeGroup.tsx
│   │   ├── VerticalVideoMarqueeGroup.module.scss
│   │   └── index.ts
│   ├── VideoContent/               # 🔄 В планах
│   │   ├── VideoContent.tsx
│   │   ├── VideoContent.module.scss
│   │   └── index.ts
│   └── index.ts                    # Экспорт всех компонентов
├── constants/
│   └── AiVideoContent.constants.ts #
├── hooks/
│   └── useVideoMarqueeAnimation.ts # 🔄 В планах
├── types/
│   └── AiVideoContent.types.ts     # 
└── AiVideoContentSection.tsx       # 
```

## 🔧 Детальный план реализации

### Этап 1: Базовые компоненты 

#### 1.1 Типы данных
- ✅ `VideoItem` - интерфейс для видео элемента
- ✅ `VideoContentSectionProps` - пропсы основного компонента
- ✅ `VideoMarqueeProps` - пропсы для marquee компонентов

#### 1.2 Константы
- ✅ `VIDEO_ITEMS` - массив видео для демонстрации
- ✅ Конфигурация анимаций

#### 1.3 HorizontalVideoMarquee
- ✅ Компонент
- ✅ Стили 
- ✅ Базовая анимация реализована

### Этап 2: Вертикальные компоненты (🔄 Текущий этап)

#### 2.1 VerticalVideoMarquee
**Задача**: Создать компонент для вертикальной прокрутки видео

**Особенности**:
- Вертикальная анимация (transform: translateY)
- Поддержка направления (вверх/вниз)
- Адаптация под высоту контейнера

**Файлы**:
- `VerticalVideoMarquee.tsx`
- `VerticalVideoMarquee.module.scss`
- `index.ts`

#### 2.2 VerticalVideoMarqueeGroup
**Задача**: Группировка нескольких вертикальных marquee

**Особенности**:
- Управление несколькими колонками
- Разные скорости анимации
- Responsive поведение

### Этап 3: Основной контент компонент (🔄 Планируется)

#### 3.1 VideoContent
**Задача**: Центральный компонент с текстом и видео-marquee

**Структура**:
```tsx
<div className="video-content">
  <div className="video-content__marquee-group">
    <VerticalVideoMarqueeGroup />
  </div>
  <div className="video-content__center">
    <h2>Заголовок секции</h2>
    <p>Описание</p>
  </div>
  <div className="video-content__horizontal">
    <HorizontalVideoMarquee />
  </div>
</div>
```

### Этап 4: Хуки и утилиты (🔄 Планируется)

#### 4.1 useVideoMarqueeAnimation
**Задача**: Управление анимациями видео-marquee

**Функциональность**:
- Пауза/воспроизведение анимации
- Обработка видимости элемента
- Управление состоянием hover/focus

#### 4.2 useVideoIntersection
**Задача**: Оптимизация загрузки видео

**Функциональность**:
- Lazy loading видео
- Пауза видео вне viewport
- Управление autoplay

### Этап 5: Стили и анимации (🔄 Текущий приоритет)

#### 5.1 Keyframes для видео
```scss
@keyframes video-marquee-horizontal {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes video-marquee-vertical {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
```

#### 5.2 Responsive поведение
- Mobile: упрощенная анимация
- Tablet: средняя сложность
- Desktop: полная анимация

#### 5.3 Accessibility
- `prefers-reduced-motion: reduce`
- Keyboard navigation
- Screen reader support

### Этап 6: Интеграция (🔄 Финальный этап)

#### 6.1 Подключение к главной странице
```tsx
// app/page.tsx
import { AiVideoContentSection } from '@/modules/AiVideoContentSection'

export default function HomePage() {
  return (
    <>
      <AiContentSection />
      <AiVideoContentSection />  {/* Новая секция */}
      {/* Остальные секции */}
    </>
  )
}
```

#### 6.2 Оптимизация производительности
- Lazy loading компонентов
- Video preloading стратегии
- Bundle size анализ

## 🎨 Дизайн-система

### Цветовая схема
- Наследование от существующей темы
- Поддержка dark/light режимов
- Акцентные цвета для видео элементов

### Типографика
- Заголовки: существующие стили
- Описания: адаптация под видео-контент
- Подписи к видео: новые стили

### Spacing и Layout
- Grid система: 12 колонок
- Breakpoints: mobile, tablet, desktop
- Отступы: 8px базовая единица

## 🔍 Тестирование

### Unit тесты
- Компоненты рендеринг
- Хуки логика
- Утилиты функции

### Integration тесты
- Анимации работоспособность
- Responsive поведение
- Accessibility compliance

### Performance тесты
- Video loading времена
- Animation smoothness
- Memory usage

## 📱 Кроссбраузерная совместимость

### Поддерживаемые браузеры
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- CSS Grid → Flexbox
- CSS Custom Properties → SCSS переменные
- Intersection Observer → Scroll events

## 🚀 План развертывания

### Этапы внедрения
1. **Alpha**: Базовые компоненты
2. **Beta**: Полная функциональность
3. **RC**: Оптимизация и тесты
4. **Production**: Финальная версия

### Критерии готовности
- ✅ Все компоненты созданы
- ✅ Тесты покрытие >80%
- ✅ Performance audit пройден
- ✅ Accessibility audit пройден
- ✅ Cross-browser тестирование

## 📊 Метрики успеха

### Технические метрики
- Время загрузки секции: <2s
- FPS анимаций: 60fps
- Bundle size увеличение: <50kb
- Lighthouse score: >90

### UX метрики
- Время взаимодействия: <100ms
- Плавность анимаций: без дерганий
- Адаптивность: все breakpoints

## 🔄 Текущий статус

### Выполнено ✅
- [x] Структура типов
- [x] Константы и конфигурация
- [x] HorizontalVideoMarquee компонент
- [x] Базовые стили для горизонтальной анимации
- [x] Основной AiVideoContentSection компонент

### В процессе 🔄
- [ ] VerticalVideoMarquee компонент
- [ ] VerticalVideoMarqueeGroup компонент
- [ ] VideoContent центральный компонент
- [ ] useVideoMarqueeAnimation хук

### Планируется 📋
- [ ] Полные стили для всех анимаций
- [ ] Оптимизация производительности
- [ ] Кроссбраузерное тестирование
- [ ] Интеграция в главную страницу
- [ ] Финальная полировка

---

**Примечание**: Этот план является живым документом и может корректироваться в процессе разработки на основе обратной связи и технических требований.