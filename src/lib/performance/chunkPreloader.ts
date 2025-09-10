/**
 * Утилита для предзагрузки чанков при взаимодействии пользователя
 * Оптимизирует загрузку тяжёлых компонентов
 */

type PreloadFunction = () =>
  | Promise<{ default: React.ComponentType<Record<string, unknown>> }>
  | Promise<Record<string, React.ComponentType<Record<string, unknown>>>>;

interface PreloadConfig {
  /** Функция импорта компонента */
  importFn: PreloadFunction;
  /** Задержка перед предзагрузкой (мс) */
  delay?: number;
  /** Условие для предзагрузки */
  condition?: () => boolean;
}

/**
 * Кэш предзагруженных модулей
 */
const preloadCache = new Set<string>();

/**
 * Предзагрузка чанка с дебаунсом
 */
export function preloadChunk(key: string, config: PreloadConfig): () => void {
  return () => {
    // Проверяем, не загружен ли уже модуль
    if (preloadCache.has(key)) {
      return;
    }

    // Проверяем условие загрузки
    if (config.condition && !config.condition()) {
      return;
    }

    // Добавляем задержку если указана
    const executePreload = () => {
      preloadCache.add(key);
      config.importFn().catch((error) => {
        console.warn(`Failed to preload chunk ${key}:`, error);
        preloadCache.delete(key); // Удаляем из кэша при ошибке
      });
    };

    if (config.delay) {
      setTimeout(executePreload, config.delay);
    } else {
      executePreload();
    }
  };
}

/**
 * Хук для предзагрузки при наведении
 */
export function useHoverPreload(key: string, importFn: PreloadFunction, delay = 100) {
  const preload = preloadChunk(key, { importFn, delay });

  return {
    onMouseEnter: preload,
    onFocus: preload, // Для доступности
  };
}

/**
 * Хук для предзагрузки при скролле в область видимости
 */
export function useIntersectionPreload(key: string, importFn: PreloadFunction, threshold = 0.1) {
  const preload = preloadChunk(key, { importFn });

  return (element: HTMLElement | null) => {
    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preload();
            observer.disconnect();
          }
        });
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  };
}

/**
 * Предзагрузка критических чанков
 */
export const criticalChunks = {
  avatar3D: () => import('@/modules/AboutSection/components/3DAvatar/3DAvatar'),
  skillsCharts: () => import('@/modules/SkillsSection/components/SkillsCharts/SkillsCharts'),
  videoMarquee: () =>
    import('@/modules/AiVideoContentSection/component/VideoMarqueeGroup/VideoMarqueeGroup'),
  magnifierCursor: () => import('@/lib/ui/MagnifierCursor/MagnifierCursor'),
};

/**
 * Инициализация предзагрузки критических чанков
 */
export function initCriticalPreloading() {
  // Предзагружаем самые важные компоненты с задержкой
  if (typeof window !== 'undefined') {
    // Предзагрузка 3D аватара через 2 секунды после загрузки
    setTimeout(() => {
      preloadChunk('avatar3D', {
        importFn: criticalChunks.avatar3D,
        condition: () => window.innerWidth > 768, // Только на десктопе
      })();
    }, 2000);

    // Предзагрузка графиков навыков через 3 секунды
    setTimeout(() => {
      preloadChunk('skillsCharts', {
        importFn: criticalChunks.skillsCharts,
      })();
    }, 3000);
  }
}
