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
  const cardIndex = animationController.getCardIndexBySectionId(sectionId);

  if (cardIndex !== -1 && animationController.isReady()) {
    const ok = animationController.navigateToCard(cardIndex);
    if (ok) return;
  }

  const element = document.getElementById(sectionId);
  if (!element) return;

  if (isReady && smoother && scrollTo) {
    try {
      scrollTo(element, true, 'top top');
    } catch {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
