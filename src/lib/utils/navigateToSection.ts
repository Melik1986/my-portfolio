import type { ScrollSmootherInstance } from '@/lib/gsap/hooks/useScrollSmoother';
import { animationController } from '@/modules/AnimatedCardSection/core/AnimationController';

export function navigateToSection(
  sectionId: string,
  isReady: boolean,
  smoother: ScrollSmootherInstance | null,
  scrollTo:
    | ((target: string | number | Element, smooth?: boolean, position?: string) => void)
    | null,
): void {
  // Small helper to ensure smoother and triggers are ready before moving
  const ensureReady = async () => {
    if (!isReady) {
      await new Promise((r) => setTimeout(r, 50));
    }
    try {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
    } catch {}
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
  };

  // На мобильных устройствах преобразуем ID секций
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  let targetSectionId = sectionId;

  if (isMobile) {
    // Для мобильных устройств используем левую часть разделенных секций
    const mobileMapping: Record<string, string> = {
      'about-section': 'about-section-left',
      'skills-section': 'skills-section-left',
    };
    targetSectionId = mobileMapping[sectionId] || sectionId;
  }

  const cardIndex = animationController.getCardIndexBySectionId(targetSectionId);

  if (cardIndex !== -1) {
    // Ensure master is initialized if user navigates very early
    if (!animationController.isReady()) {
      animationController.initializeMaster();
    }
    void animationController.navigateToCardAsync(cardIndex);
    return;
  }

  // Fallback: пробуем найти элемент с оригинальным или модифицированным ID
  const element = document.getElementById(targetSectionId) || document.getElementById(sectionId);
  if (!element) return;

  // Fallback smooth scroll with readiness guard
  (async () => {
    await ensureReady();
    if (smoother && scrollTo) {
      try {
        scrollTo(element, true, 'top top');
        return;
      } catch {}
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  })();
}
