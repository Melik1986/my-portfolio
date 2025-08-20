'use client';

import { ReactNode } from 'react';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';

interface ScrollSmootherProviderProps {
  children: ReactNode;
}

export function ScrollSmootherProvider({ children }: ScrollSmootherProviderProps) {
  ensureGSAPRegistered();
  useScrollSmoother();

  return <>{children}</>;
}
