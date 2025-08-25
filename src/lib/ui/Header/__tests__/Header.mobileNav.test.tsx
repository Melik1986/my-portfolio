import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks for GSAP-related hooks and controllers used by Header
jest.mock('@/lib/gsap/hooks/useElementTimeline', () => ({
  createElementTimeline: () => ({
    play: jest.fn(),
    pause: jest.fn(),
  }),
}));

jest.mock('@/lib/gsap/hooks/useScrollSmoother', () => ({
  useScrollSmoother: () => ({
    smoother: null,
    isReady: false,
    scrollTo: jest.fn(),
    scrollTop: jest.fn(),
    kill: jest.fn(),
  }),
}));

jest.mock('@/modules/AnimatedCardSection/core/AnimationController', () => ({
  animationController: {
    getCardIndexBySectionId: jest.fn(() => -1),
    isReady: jest.fn(() => false),
    navigateToCard: jest.fn(),
  },
}));

import { Header } from '@/lib/ui/Header/Header';

const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('Header mobile navigation', () => {
  beforeEach(() => {
    // Ensure clean DOM/body overflow between tests
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  test('opens dropdown on mobile when button is clicked', () => {
    setViewportWidth(600); // <= 768 considered mobile
    render(<Header />);

    const navToggleButton = screen.getByRole('button', { name: 'Contact me' });
    fireEvent.click(navToggleButton);

    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeInTheDocument();

    // overlay should be present and clicking it closes the dropdown
    const overlay = screen.getByRole('button', { name: 'Close navigation' });
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay);
    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeInTheDocument();
  });

  test('closes dropdown on Escape key', () => {
    setViewportWidth(600);
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Contact me' }));
    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeInTheDocument();
  });

  test('closes dropdown when resizing above 768px', async () => {
    setViewportWidth(600);
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Contact me' }));
    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeInTheDocument();

    setViewportWidth(1024);
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('navigation', { name: 'Mobile navigation' }),
      ).not.toBeInTheDocument();
    });
  });

  test('does not open dropdown on desktop click', () => {
    setViewportWidth(1024);
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Contact me' }));

    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeInTheDocument();
  });
});

