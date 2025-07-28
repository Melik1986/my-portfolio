'use client';

import { useState, useRef, useMemo } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraConfig, AuroraState } from '@/modules/AboutSection/types/about.types';
import { DEFAULT_AURORA_CONFIG } from '@/modules/AboutSection/config/aurora.config';

export const useAuroraState = (config: Partial<AuroraConfig> = {}) => {
  const [state, setState] = useState<AuroraState>({
    isRunning: false,
    isInitialized: false,
    mousePosition: { x: 0, y: 0 },
  });

  const sceneManagerRef = useRef<AuroraSceneManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const countRef = useRef(0);

  const finalConfig = useMemo(() => ({ ...DEFAULT_AURORA_CONFIG, ...config }), [config]);

  return {
    state,
    setState,
    sceneManagerRef,
    animationFrameRef,
    countRef,
    finalConfig,
  };
};
