import { AuroraConfig } from '@/modules/AboutSection/types/about.types';

export const DEFAULT_AURORA_CONFIG: AuroraConfig = {
  separation: 100,
  amountX: 100,
  amountY: 70,
  particleColor: 0x1e90ff, // Electric blue
  particleSize: 2.5,
  cameraSpeed: 0.05,
  cameraFov: 75,
  cameraNear: 0.1,
  cameraFar: 1000,
  cameraZ: 1000,
  cameraLerp: 0.1,
  waveSpeed: 0.1,
  waveFrequencyX: 0.3,
  waveFrequencyY: 0.5,
  waveAmplitude: 50,
};

// Alternative color presets
export const AURORA_PRESETS = {
  electricBlue: 0x1e90ff,
  neonCyan: 0x00ffff,
  purpleHaze: 0x9400d3,
  greenAurora: 0x00ff00,
  pinkGlow: 0xff1493,
} as const;
