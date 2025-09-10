'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText as GsapSplitText } from 'gsap/SplitText';

let isRegistered = false;

/**
 * Ensures that GSAP plugins are registered only once.
 */
export function ensureGSAPRegistered(): void {
  if (isRegistered) {
    return;
  }

  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    GsapSplitText
  );

  isRegistered = true;
}
