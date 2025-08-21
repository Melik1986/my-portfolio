'use client';

import React from 'react';

export function ensurePositioning(container: HTMLElement): string {
  const prev = container.style.position;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  return prev;
}

export function createGlassElement(config: {
  container: HTMLElement;
  size: number;
  borderWidth: number;
  borderColor: string;
  glassRef: React.RefObject<HTMLDivElement | null>;
  className: string;
}) {
  const { container, size, borderWidth, borderColor, glassRef, className } = config;
  const glass = document.createElement('div');
  glass.className = className;
  glass.style.width = `${size}px`;
  glass.style.height = `${size}px`;
  glass.style.borderWidth = `${borderWidth}px`;
  glass.style.borderColor = borderColor;
  glass.style.display = 'none';
  container.appendChild(glass);
  glassRef.current = glass;
}

export function getImageUnderPointer(container: HTMLElement, clientX: number, clientY: number) {
  const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
  if (!el) return null as HTMLImageElement | null;
  const img = el.closest('img') as HTMLImageElement | null;
  if (!img) return null;
  return container.contains(img) ? img : null;
}

export function getEventPoint(e: Event): { clientX: number; clientY: number } | null {
  const isTouch = (e as TouchEvent).touches !== undefined;
  if (isTouch) {
    const te = e as TouchEvent;
    if (te.touches.length === 0) return null;
    return { clientX: te.touches[0].clientX, clientY: te.touches[0].clientY };
  }
  const me = e as MouseEvent;
  return { clientX: me.clientX, clientY: me.clientY };
}

export function clampCoord(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function ensureBackground(glassEl: HTMLDivElement, src: string) {
  if ((glassEl.dataset.lastSrc || '') !== src) {
    glassEl.style.backgroundImage = `url('${src}')`;
    glassEl.dataset.lastSrc = src;
  }
}

export function positionAndShowGlass(config: {
  glassEl: HTMLDivElement;
  containerRect: DOMRect;
  imgRect: DOMRect;
  x: number;
  y: number;
  zoom: number;
  half: number;
  borderWidth: number;
}) {
  const { glassEl, containerRect, imgRect, x, y, zoom, half, borderWidth } = config;
  const left = imgRect.left - containerRect.left + x - half;
  const top = imgRect.top - containerRect.top + y - half;
  glassEl.style.left = `${left}px`;
  glassEl.style.top = `${top}px`;

  const bgX = -(x * zoom - half + borderWidth);
  const bgY = -(y * zoom - half + borderWidth);
  glassEl.style.backgroundPosition = `${bgX}px ${bgY}px`;
  glassEl.style.display = 'block';
}

export function attachMagnifierListeners(
  container: HTMLElement,
  move: (e: Event) => void,
  hide: () => void,
) {
  container.addEventListener('mousemove', move, { passive: true });
  container.addEventListener('mouseleave', hide, { passive: true });
  container.addEventListener('touchmove', move, { passive: true });
  container.addEventListener('touchend', hide, { passive: true });
  return () => {
    container.removeEventListener('mousemove', move);
    container.removeEventListener('mouseleave', hide);
    container.removeEventListener('touchmove', move);
    container.removeEventListener('touchend', hide);
  };
}

export function buildMoveHandler(config: {
  container: HTMLElement;
  glassRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  size: number;
  borderWidth: number;
}) {
  const { container, glassRef, zoom, size, borderWidth } = config;
  const half = size / 2;

  return function move(e: Event) {
    const glassEl = glassRef.current;
    if (!glassEl) return;

    const pt = getEventPoint(e);
    if (!pt) return;

    const img = getImageUnderPointer(container, pt.clientX, pt.clientY);
    if (!img) {
      glassEl.style.display = 'none';
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    ensureBackground(glassEl, img.src);
    glassEl.style.backgroundRepeat = 'no-repeat';
    glassEl.style.backgroundSize = `${imgRect.width * zoom}px ${imgRect.height * zoom}px`;

    const min = half / zoom;
    const maxX = imgRect.width - min;
    const maxY = imgRect.height - min;
    const x = clampCoord(pt.clientX - imgRect.left, min, maxX);
    const y = clampCoord(pt.clientY - imgRect.top, min, maxY);

    positionAndShowGlass({
      glassEl,
      containerRect,
      imgRect,
      x,
      y,
      zoom,
      half,
      borderWidth,
    });
  };
}

export function setupMagnifier(params: {
  container: HTMLElement;
  glassRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  size: number;
  borderWidth: number;
  borderColor: string;
  className: string;
}): () => void {
  const { container, glassRef, zoom, size, borderWidth, borderColor, className } = params;
  const prevPosition = ensurePositioning(container);
  createGlassElement({ container, size, borderWidth, borderColor, glassRef, className });
  const move = buildMoveHandler({ container, glassRef, zoom, size, borderWidth });
  const hide = () => {
    const el = glassRef.current;
    if (el) el.style.display = 'none';
  };
  const detach = attachMagnifierListeners(container, move, hide);
  return () => {
    detach();
    if (glassRef.current) {
      glassRef.current.remove();
      glassRef.current = null;
    }
    container.style.position = prevPosition;
  };
}
