import { useEffect, RefObject } from 'react';

type ComputeFn<T extends HTMLElement> = (el: T) => number | null;

/**
 * Устанавливает CSS-переменную на элементе при маунте и при ресайзе (ResizeObserver/resize)
 */
export function useCssVarOnResize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  varName: string,
  compute: ComputeFn<T>,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setVar = () => {
      const val = compute(el);
      if (val != null && !Number.isNaN(val)) {
        el.style.setProperty(varName, `${val}px`);
      }
    };

    setVar();

    let ro: ResizeObserver | undefined;
    let detach: (() => void) | undefined;
    let rafId: number | null = null;

    // Безопасно получаем объект окна для текущего документа
    const win: Window | null =
      el.ownerDocument?.defaultView ?? (typeof window !== 'undefined' ? window : null);

    // Планируем обновление через rAF, чтобы избежать цикла ResizeObserver
    const schedule = () => {
      if (!win) return;
      if (rafId != null) win.cancelAnimationFrame(rafId);
      rafId = win.requestAnimationFrame(() => {
        setVar();
        rafId = null;
      });
    };

    if (win && 'ResizeObserver' in win && win.ResizeObserver) {
      ro = new (win.ResizeObserver as typeof ResizeObserver)(() => schedule());
      ro?.observe(el);
    } else if (win && typeof win.addEventListener === 'function') {
      const onResize = () => schedule();
      win.addEventListener('resize', onResize);
      detach = () => {
        if (win && typeof win.removeEventListener === 'function') {
          win.removeEventListener('resize', onResize);
        }
      };
    }

    return () => {
      if (rafId != null && win) {
        win.cancelAnimationFrame(rafId);
      }
      ro?.disconnect();
      detach?.();
    };
  }, [ref, varName, compute]);
}
