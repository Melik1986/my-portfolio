'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText as GsapSplitText } from 'gsap/SplitText';

let isRegistered = false;

/**
 * Гарантирует однократную регистрацию всех используемых GSAP плагинов.
 */
export function ensureGSAPRegistered(): void {
  if (isRegistered) return;
  try {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, GsapSplitText);

    if (typeof window !== 'undefined') {
      // Экспортируем ScrollTrigger в window для совместимости со сторонним кодом/отладкой
      (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
    }

    isRegistered = true;
  } catch {
    // Безопасно игнорируем, если плагины недоступны в текущем окружении
  }
}
