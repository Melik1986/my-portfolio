import React from 'react';
import { render, act } from '@testing-library/react';
import { GlobalPreloader } from './GlobalPreloader';

// Mock gsap ScrollTrigger dynamic import
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: jest.fn(),
  },
}));

describe('GlobalPreloader', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('preload-lock');
    document.body.classList.remove('preload-lock');
    // Provide rAF in JSDOM
    (
      global as unknown as { requestAnimationFrame?: (cb: FrameRequestCallback) => number }
    ).requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0 as unknown as DOMHighResTimeStamp);
      return 0 as unknown as number;
    }) as unknown as (cb: FrameRequestCallback) => number;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('applies scroll lock while visible and removes it on complete', async () => {
    render(<GlobalPreloader />);

    expect(document.documentElement.classList.contains('preload-lock')).toBe(true);
    expect(document.body.classList.contains('preload-lock')).toBe(true);

    // Dispatch completion event
    act(() => {
      document.dispatchEvent(new CustomEvent('preloader:complete'));
      jest.advanceTimersByTime(150);
    });

    expect(document.documentElement.classList.contains('preload-lock')).toBe(false);
    expect(document.body.classList.contains('preload-lock')).toBe(false);
  });

  it('calls ScrollTrigger.refresh after complete', async () => {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const refreshSpy = jest.spyOn(ScrollTrigger, 'refresh');

    render(<GlobalPreloader />);

    act(() => {
      document.dispatchEvent(new CustomEvent('preloader:complete'));
      jest.advanceTimersByTime(150);
    });

    expect(refreshSpy).toHaveBeenCalled();
  });
});
