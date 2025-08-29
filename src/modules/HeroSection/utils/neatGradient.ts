import { lightConfig, darkConfig, type NeatConfig } from '../config/neatGradient.config';

interface NeatInstance { destroy: () => void }

function isLightTheme(): boolean {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false;
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light') return true;
  if (theme === 'dark') return false;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false;
}

type NeatState = {
  neatGradient: NeatInstance | null;
  canvas: HTMLCanvasElement | null;
  isInitializing: boolean;
  disposed: boolean;
  reinitTimer: number | null;
  watermarkObserver: MutationObserver | null;
};

const getCurrentConfig = (): NeatConfig => (isLightTheme() ? lightConfig : darkConfig);

function createCanvas(container: HTMLElement): HTMLCanvasElement {
  const canvasEl = document.createElement('canvas');
  canvasEl.setAttribute('data-neat-canvas', 'true');
  container.appendChild(canvasEl);
  return canvasEl;
}

function removeWatermark(container: HTMLElement): void {
  const anchors = Array.from(container.querySelectorAll('a')) as HTMLAnchorElement[];
  anchors.forEach((a) => {
    const href = (a.getAttribute('href') || '').replace(/[`\s]/g, '');
    const text = (a.textContent || '').trim().toUpperCase();
    const matches = href.includes('https://neat.firecms.co') || text === 'NEAT';
    if (matches) a.remove();
  });
}

function startWatermarkObserver(container: HTMLElement, state: NeatState): void {
  removeWatermark(container);
  if (state.watermarkObserver) state.watermarkObserver.disconnect();
  state.watermarkObserver = new MutationObserver(() => removeWatermark(container));
  state.watermarkObserver.observe(container, { childList: true, subtree: true });
}

function destroyCurrent(container: HTMLElement, state: NeatState): void {
  try { state.neatGradient?.destroy(); } catch { /* noop */ }
  state.neatGradient = null;
  const canvases = Array.from(container.querySelectorAll('canvas')) as HTMLCanvasElement[];
  canvases.forEach((c) => c.remove());
  state.canvas = null;
  removeWatermark(container);
  container.removeAttribute('data-neat-active');
}

function scheduleReinit(state: NeatState, init: () => void): void {
  if (state.disposed) return;
  if (state.reinitTimer) window.clearTimeout(state.reinitTimer);
  state.reinitTimer = window.setTimeout(init, 150);
}

async function initGradient(container: HTMLElement, state: NeatState): Promise<void> {
  if (state.disposed || state.isInitializing) return;
  state.isInitializing = true;
  try {
    const mod = await import('@firecms/neat');
    const NeatGradient = mod.NeatGradient as unknown as new (opts: { ref: HTMLCanvasElement } & NeatConfig) => NeatInstance;

    destroyCurrent(container, state);

    if (!container.isConnected) return;

    state.canvas = createCanvas(container);
    const config = getCurrentConfig();
    state.neatGradient = new NeatGradient({ ref: state.canvas, ...config });

    container.setAttribute('data-neat-active', 'true');

    startWatermarkObserver(container, state);
  } catch (error) {
    console.error('Failed to initialize NeatGradient:', error);
  } finally {
    state.isInitializing = false;
  }
}

export function initHeroNeatGradient(container: HTMLElement): () => void {
  if (!container) return () => {};

  if (container.hasAttribute('data-neat-initialized')) {
    return () => {};
  }
  container.setAttribute('data-neat-initialized', 'true');

  const state: NeatState = {
    neatGradient: null,
    canvas: null,
    isInitializing: false,
    disposed: false,
    reinitTimer: null,
    watermarkObserver: null,
  };

  void initGradient(container, state);

  const observer = new MutationObserver(() =>
    scheduleReinit(state, () => { void initGradient(container, state); })
  );
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const onResize = (): void =>
    scheduleReinit(state, () => { void initGradient(container, state); });
  window.addEventListener('resize', onResize);

  return () => {
    state.disposed = true;
    observer.disconnect();
    if (state.watermarkObserver) state.watermarkObserver.disconnect();
    window.removeEventListener('resize', onResize);
    if (state.reinitTimer) window.clearTimeout(state.reinitTimer);
    destroyCurrent(container, state);
    container.removeAttribute('data-neat-initialized');
  };
}