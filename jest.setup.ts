import '@testing-library/jest-dom';

// Мок для window.THREE
global.THREE = {
  REVISION: '160',
} as any;

// Мок для requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(0), 0) as any;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Мок для ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Мок для MutationObserver  
global.MutationObserver = class MutationObserver {
  observe() {}
  disconnect() {}
} as any;

// Мок для IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Мок для window.gc (garbage collection)
(global as any).gc = () => {};

// Отлавливаем необработанные ошибки в тестах
(global as any).__errors = [];
global.window.onerror = (message, source, lineno, colno, error) => {
  (global as any).__errors.push({ message, source, lineno, colno, error });
  return true;
};