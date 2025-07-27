export interface DevelopmentSkill {
  skill: string;
  score: number;
}

export interface DesignSkill {
  name: string;
  value: number;
}

export interface SkillsData {
  development: DevelopmentSkill[];
  design: DesignSkill[];
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  large: number;
}
