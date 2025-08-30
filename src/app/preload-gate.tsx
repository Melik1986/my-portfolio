'use client';

import { useEffect } from 'react';

type PreloadGateProps = {
  children: React.ReactNode;
};

export function PreloadGate({ children }: PreloadGateProps) {
  useEffect(() => {
    const removeBlock = () => {
      try {
        document.documentElement.classList.remove('fouc-block');
      } catch {
        // noop
      }
    };

    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      removeBlock();
    } else {
      window.addEventListener('load', removeBlock, { once: true });
      const t = window.setTimeout(removeBlock, 10000);
      return () => {
        window.removeEventListener('load', removeBlock);
        window.clearTimeout(t);
      };
    }
  }, []);

  return children;
}

