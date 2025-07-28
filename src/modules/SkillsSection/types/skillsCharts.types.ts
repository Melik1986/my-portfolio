/**
 * Интерфейс навыка разработки
 * Описывает технологию и уровень владения в процентах
 */
export interface DevelopmentSkill {
  skill: string;
  score: number;
}

/**
 * Интерфейс навыка дизайна
 * Описывает дизайн-навык и уровень владения в процентах
 */
export interface DesignSkill {
  name: string;
  value: number;
}

/**
 * Интерфейс данных навыков
 * Содержит массивы навыков разработки и дизайна
 */
export interface SkillsData {
  development: DevelopmentSkill[];
  design: DesignSkill[];
}

/**
 * Интерфейс точек перелома для адаптивности
 * Определяет размеры экранов для различных устройств
 */
export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  large: number;
}
