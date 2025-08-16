'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

/**
 * Интерфейс для конфигурации инициализации GSAP
 */
interface GSAPInitConfig {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableFallback?: boolean;
  plugins?: string[];
}

/**
 * Результат инициализации GSAP
 */
interface GSAPInitResult {
  success: boolean;
  gsapAvailable: boolean;
  pluginsLoaded: string[];
  errors: string[];
  fallbackActive: boolean;
}

/**
 * Класс для централизованной инициализации GSAP с улучшенной обработкой ошибок
 */
export class GSAPInitializer {
  private static instance: GSAPInitializer;
  private isInitialized = false;
  private initPromise: Promise<GSAPInitResult> | null = null;
  private config: Required<GSAPInitConfig>;
  private fallbackMode = false;

  private constructor() {
    this.config = {
      timeout: 10000, // 10 секунд
      retryAttempts: 3,
      retryDelay: 1000,
      enableFallback: true,
      plugins: ['ScrollTrigger', 'SplitText', 'ScrollSmoother', 'ScrollToPlugin'],
    };
  }

  /**
   * Получение singleton экземпляра
   */
  public static getInstance(): GSAPInitializer {
    if (!GSAPInitializer.instance) {
      GSAPInitializer.instance = new GSAPInitializer();
    }
    return GSAPInitializer.instance;
  }

  /**
   * Основной метод инициализации GSAP
   */
  public async initialize(customConfig?: Partial<GSAPInitConfig>): Promise<GSAPInitResult> {
    // Если уже инициализируется, возвращаем существующий промис
    if (this.initPromise) {
      return this.initPromise;
    }

    // Если уже инициализирован, возвращаем успешный результат
    if (this.isInitialized) {
      return this.getSuccessResult();
    }

    // Объединяем конфигурацию
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    // Создаем промис инициализации
    this.initPromise = this.performInitialization();
    
    try {
      const result = await this.initPromise;
      this.isInitialized = result.success;
      return result;
    } catch (error) {
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Выполнение инициализации с повторными попытками
   */
  private async performInitialization(): Promise<GSAPInitResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`🎬 GSAP инициализация - попытка ${attempt}/${this.config.retryAttempts}`);
        
        const result = await this.attemptInitialization();
        
        if (result.success) {
          console.log('✅ GSAP успешно инициализирован');
          return result;
        }
        
        throw new Error(`Инициализация не удалась: ${result.errors.join(', ')}`);
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`⚠️ GSAP инициализация попытка ${attempt} не удалась:`, lastError.message);
        
        // Ждем перед следующей попыткой (кроме последней)
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay);
        }
      }
    }

    // Все попытки не удались - активируем fallback
    if (this.config.enableFallback) {
      console.warn('🔄 Активация fallback режима для анимаций');
      return this.activateFallback(lastError);
    }

    throw lastError || new Error('GSAP инициализация не удалась');
  }

  /**
   * Одна попытка инициализации GSAP
   */
  private async attemptInitialization(): Promise<GSAPInitResult> {
    const result: GSAPInitResult = {
      success: false,
      gsapAvailable: false,
      pluginsLoaded: [],
      errors: [],
      fallbackActive: false,
    };

    // Проверяем доступность GSAP с таймаутом
    const gsapCheck = await this.withTimeout(
      this.checkGSAPAvailability(),
      this.config.timeout,
      'GSAP проверка превысила таймаут'
    );

    if (!gsapCheck.available) {
      result.errors.push(gsapCheck.error || 'GSAP недоступен');
      return result;
    }

    result.gsapAvailable = true;

    // Принудительная инициализация GSAP
    await this.forceGSAPInitialization();

    // Регистрируем плагины
    const pluginResults = await this.registerPlugins();
    result.pluginsLoaded = pluginResults.loaded;
    result.errors.push(...pluginResults.errors);

    // Проверяем готовность DOM
    await this.ensureDOMReady();

    result.success = result.gsapAvailable && result.errors.length === 0;
    return result;
  }

  /**
   * Проверка доступности GSAP
   */
  private async checkGSAPAvailability(): Promise<{ available: boolean; error?: string }> {
    try {
      // Проверяем основной объект GSAP
      if (typeof gsap === 'undefined' || !gsap) {
        return { available: false, error: 'GSAP объект недоступен' };
      }

      // Проверяем ключевые методы
      if (typeof gsap.registerPlugin !== 'function') {
        return { available: false, error: 'GSAP.registerPlugin недоступен' };
      }

      if (typeof gsap.timeline !== 'function') {
        return { available: false, error: 'GSAP.timeline недоступен' };
      }

      // Тестовая анимация для проверки работоспособности
      const testElement = document.createElement('div');
      const testTween = gsap.to(testElement, { duration: 0.01, x: 1 });
      testTween.kill();

      return { available: true };
    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка GSAP'
      };
    }
  }

  /**
   * Принудительная инициализация GSAP
   */
  private async forceGSAPInitialization(): Promise<void> {
    try {
      // Устанавливаем глобальные настройки GSAP
      gsap.config({
        nullTargetWarn: false,

        force3D: true,
      });

      // Устанавливаем значения по умолчанию
      gsap.defaults({
        duration: 0.8,
        ease: 'power2.out',
      });

      console.log('🔧 GSAP принудительно инициализирован');
    } catch (error) {
      console.warn('⚠️ Ошибка принудительной инициализации GSAP:', error);
      throw error;
    }
  }

  /**
   * Регистрация плагинов GSAP
   */
  private async registerPlugins(): Promise<{ loaded: string[]; errors: string[] }> {
    const loaded: string[] = [];
    const errors: string[] = [];

    const pluginMap = {
      ScrollTrigger,
      SplitText,
      ScrollSmoother,
      ScrollToPlugin,
    };

    for (const pluginName of this.config.plugins) {
      try {
        const plugin = pluginMap[pluginName as keyof typeof pluginMap];
        if (plugin) {
          gsap.registerPlugin(plugin);
          loaded.push(pluginName);
          console.log(`✅ Плагин ${pluginName} зарегистрирован`);
        } else {
          errors.push(`Плагин ${pluginName} не найден`);
        }
      } catch (error) {
        const errorMsg = `Ошибка регистрации плагина ${pluginName}: ${error}`;
        errors.push(errorMsg);
        console.warn('⚠️', errorMsg);
      }
    }

    return { loaded, errors };
  }

  /**
   * Обеспечение готовности DOM
   */
  private async ensureDOMReady(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
        return;
      }

      const handleReady = () => {
        document.removeEventListener('DOMContentLoaded', handleReady);
        window.removeEventListener('load', handleReady);
        resolve();
      };

      document.addEventListener('DOMContentLoaded', handleReady);
      window.addEventListener('load', handleReady);

      // Fallback таймаут
      setTimeout(resolve, 5000);
    });
  }

  /**
   * Активация fallback режима
   */
  private activateFallback(error: Error | null): GSAPInitResult {
    this.fallbackMode = true;
    
    // Добавляем CSS класс для fallback анимаций
    document.documentElement.classList.add('gsap-fallback');
    
    console.warn('🔄 Fallback режим активирован. Используются CSS анимации.');
    
    return {
      success: true, // Считаем успешным, так как fallback работает
      gsapAvailable: false,
      pluginsLoaded: [],
      errors: [error?.message || 'GSAP недоступен'],
      fallbackActive: true,
    };
  }

  /**
   * Получение результата для уже инициализированного GSAP
   */
  private getSuccessResult(): GSAPInitResult {
    return {
      success: true,
      gsapAvailable: !this.fallbackMode,
      pluginsLoaded: this.config.plugins,
      errors: [],
      fallbackActive: this.fallbackMode,
    };
  }

  /**
   * Утилита для выполнения промиса с таймаутом
   */
  private withTimeout<T>(promise: Promise<T>, timeout: number, errorMessage: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), timeout);
      }),
    ]);
  }

  /**
   * Утилита для задержки
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Проверка, находится ли система в fallback режиме
   */
  public isFallbackMode(): boolean {
    return this.fallbackMode;
  }

  /**
   * Проверка, инициализирован ли GSAP
   */
  public isGSAPReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Сброс состояния инициализации (для тестов)
   */
  public reset(): void {
    this.isInitialized = false;
    this.initPromise = null;
    this.fallbackMode = false;
    document.documentElement.classList.remove('gsap-fallback');
  }
}

/**
 * Экспорт singleton экземпляра
 */
export const gsapInitializer = GSAPInitializer.getInstance();

/**
 * Хелпер функция для быстрой инициализации
 */
export async function initializeGSAP(config?: Partial<GSAPInitConfig>): Promise<GSAPInitResult> {
  return gsapInitializer.initialize(config);
}

/**
 * Хелпер для проверки готовности GSAP
 */
export function isGSAPReady(): boolean {
  return gsapInitializer.isGSAPReady();
}

/**
 * Хелпер для проверки fallback режима
 */
export function isGSAPFallback(): boolean {
  return gsapInitializer.isFallbackMode();
}