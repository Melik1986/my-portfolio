// Types from @firecms/neat
export interface NeatColor {
  color: string;
  enabled: boolean;
}

export interface NeatConfig {
  colors: NeatColor[];
  speed: number;
  horizontalPressure: number;
  verticalPressure: number;
  waveFrequencyX: number;
  waveFrequencyY: number;
  waveAmplitude: number;
  shadows: number;
  highlights: number;
  colorBrightness: number;
  colorSaturation: number;
  wireframe: boolean;
  colorBlending: number;
  backgroundColor: string;
  backgroundAlpha: number;
  grainScale: number;
  grainIntensity: number;
  grainSpeed: number;
  resolution: number;
  yOffset?: number;
}

// Light theme config
export const lightConfig: NeatConfig = {
  colors: [
    { color: '#FFFFFF', enabled: true },
    { color: '#EFE2CE', enabled: true },
    { color: '#D5ECEB', enabled: true },
    { color: '#E4E4E4', enabled: true },
    { color: '#F6FFFF', enabled: true },
  ],
  speed: 3.5,
  horizontalPressure: 4,
  verticalPressure: 5,
  waveFrequencyX: 4,
  waveFrequencyY: 3,
  waveAmplitude: 2,
  shadows: 4,
  highlights: 7,
  colorBrightness: 1,
  colorSaturation: 0,
  wireframe: false,
  colorBlending: 7,
  backgroundColor: '#00A2FF',
  backgroundAlpha: 1,
  grainScale: 100,
  grainIntensity: 0.05,
  grainSpeed: 0.3,
  resolution: 0.5,
  yOffset: 0,
};

// Dark theme config - exact user config
export const darkConfig: NeatConfig = {
  colors: [
    { color: '#134D80', enabled: true },
    { color: '#29ABE2', enabled: true },
    { color: '#17E7FF', enabled: true },
    { color: '#082026', enabled: true },
    { color: '#f5e1e5', enabled: false },
  ],
  speed: 3.5,
  horizontalPressure: 2,
  verticalPressure: 5,
  waveFrequencyX: 2,
  waveFrequencyY: 2,
  waveAmplitude: 5,
  shadows: 10,
  highlights: 8,
  colorBrightness: 1,
  colorSaturation: 10,
  wireframe: false,
  colorBlending: 6,
  backgroundColor: '#003FFF',
  backgroundAlpha: 1,
  grainScale: 0,
  grainIntensity: 0,
  grainSpeed: 0,
  resolution: 0.95,
  yOffset: 447,
};
