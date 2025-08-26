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

  const cardIndex = animationController.getCardIndexBySectionId(sectionId);

  if (cardIndex !== -1) {
    // Ensure master is initialized if user navigates very early
    if (!animationController.isReady()) {
      animationController.initializeMaster();
    }
    const ok = animationController.navigateToCard(cardIndex);
    if (ok) return;
    // Retry once on next frame if ScrollTrigger attaches a moment later
    requestAnimationFrame(() => {
      animationController.navigateToCard(cardIndex);
    });
  }

  const element = document.getElementById(sectionId);
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
