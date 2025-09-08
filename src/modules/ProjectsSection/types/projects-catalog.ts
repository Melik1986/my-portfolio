// Типы для проектов
export interface ProjectData {
  image: string;
  previewImage: string;
  fullImage: string;
  title: string;
  text: string;
  link: string;
}

export interface CardPosition {
  x: number;
  y: number;
  z: number;
  zIndex: number;
  filter: string;
  rotation?: number; // Угол поворота карточки в градусах
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
  touchFeedbackScale?: number;

  fanAngle?: number; // Угол поворота для веерного расположения
  fanAngleStep?: number; // Шаг угла между карточками
  
  // Настройки для сжатия последних карточек
  compactLastCards?: boolean; // Включить сжатие последних карточек
  compactStartIndex?: number; // Индекс, с которого начинать сжатие
  compactZStep?: number; // Уменьшенный шаг по Z для последних карточек
  compactYStep?: number; // Уменьшенный шаг по Y для последних карточек
  lastTwoCardsScale?: number; // Масштаб для последних двух карточек
}
