// Типы для проектов
export interface ProjectData {
  image: string;
  previewImage: string;
  title: string;
  text: string;
  link: string;
}

export interface CardPosition {
  x: number;
  y: number;
  zIndex: number;
  filter: string;
}

export interface AnimationConfig {
  zStep: number;
  yStep: number;
  xStep: number;
  hoverLift: number;
  fanDuration: number;
  hoverDuration: number;
  hoverShadow: string;
  cardShadow: string;
}
