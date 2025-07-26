import { SpiralConfig, IconData } from '../types/spiral';

export const DEFAULT_SPIRAL_CONFIG: SpiralConfig = {
  numIcons: 30,
  radiusX: 150,
  radiusY: 40,
  speed: 0.01,
  animationDuration: 4000,
  elementSpacing: 30,
};

export const TECH_ICONS: IconData[] = [
  { name: 'html5', id: 'icon-html5', color: '#E34F26' },
  { name: 'css3-alt', id: 'icon-css3-alt', color: '#1572B6' },
  { name: 'js', id: 'icon-js', color: '#F7DF1E' },
  { name: 'react', id: 'icon-react', color: '#61DAFB' },
  { name: 'node', id: 'icon-node', color: '#339933' },
  { name: 'git-alt', id: 'icon-git-alt', color: '#F05032' },
  { name: 'github', id: 'icon-github', color: '#181717' },
  { name: 'database', id: 'icon-database', color: '#4479A1' },
];

export const SVG_SPRITE_PATH = '@pictures/icons/tech-icons.svg';
