import { animationController } from './AnimationController';

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: jest.fn(),
    getAll: jest.fn().mockReturnValue([]),
  },
}));

// Basic DOM structure similar to page.tsx
const setupDOM = () => {
  document.body.innerHTML = `
    <div class="portfolio__wrapper scroll-section">
      <ul class="portfolio__list">
        <li id="hero-section" data-section-index="0"></li>
        <li id="about-section" data-section-index="1"></li>
        <li id="skills-section" data-section-index="2"></li>
      </ul>
    </div>
  `;
};

describe('AnimationController', () => {
  beforeEach(() => {
    // mock matchMedia expected by gsap.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    // rAF shim
    (global as unknown as { requestAnimationFrame?: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
      ((cb: FrameRequestCallback) => {
        cb(0 as unknown as DOMHighResTimeStamp);
        return 0 as unknown as number;
      }) as unknown as (cb: FrameRequestCallback) => number;
    // Reset DOM and controller
    setupDOM();
    animationController.cleanup();
  });

  it('initializes master timeline without resize', () => {
    const tl = animationController.initializeMaster();
    expect(tl).toBeTruthy();
  });

  it('registers sections and activates hero', () => {
    const hero = document.querySelector('#hero-section') as HTMLElement;
    const about = document.querySelector('#about-section') as HTMLElement;

    expect(hero).toBeTruthy();
    expect(about).toBeTruthy();

    animationController.initializeMaster();
    animationController.registerSection(0, hero);
    animationController.registerSection(1, about);

    expect(animationController.getActiveCardIndex()).toBe(0);
  });
});

