'use client';

import React, { useEffect, useRef } from 'react';
import { setupMagnifier } from '../../utils/magnifier.utils';
import styles from './MagnifierCursor.module.scss';

export interface MagnifierCursorProps {
  containerRef: React.RefObject<HTMLElement | null>;
  zoom?: number; // magnification factor
  size?: number; // diameter in px
  borderWidth?: number;
  borderColor?: string;
}

/**
 * Reusable magnifier glass cursor. Attaches a floating glass element inside containerRef
 * and magnifies the image under pointer, following the W3Schools approach.
 * Inspired by: https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp
 */
export function MagnifierCursor({
  containerRef,
  zoom = 2.5,
  size = 120,
  borderWidth = 3,
  borderColor = '#000',
}: MagnifierCursorProps) {
  const glassRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return setupMagnifier({
      container,
      glassRef,
      zoom,
      size,
      borderWidth,
      borderColor,
      className: styles.magnifierGlass,
    });
  }, [containerRef, zoom, size, borderWidth, borderColor]);

  return null;
}

export default MagnifierCursor;
