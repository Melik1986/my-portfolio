'use client';

/**
 * Waits for document fonts to be ready. Falls back to a timeout if FontFaceSet is unavailable.
 */
export async function waitForFontsReady(timeoutMs = 4000): Promise<void> {
  try {
    if (typeof document === 'undefined') return;
    const anyDoc = document as unknown as { fonts?: { ready?: Promise<void>; status?: string } };
    const fontSet = anyDoc.fonts;
    if (!fontSet) return;
    if (fontSet.status === 'loaded') return;

    await Promise.race([
      fontSet.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);

    // Ensure styles are applied
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  } catch {
    // ignore
  }
}

