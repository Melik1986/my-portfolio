'use client';

import { ReactNode } from 'react';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';

interface ScrollSmootherProviderProps {
  children: ReactNode;
}

export function ScrollSmootherProvider({ children }: ScrollSmootherProviderProps) {
  useScrollSmoother();

  return <>{children}</>;
}
