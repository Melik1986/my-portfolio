export const SELECTORS = {
  DEV_CHART: '#dev-skills-chart',
  DESIGN_CHART: '#design-skills-chart',
};

export const COLOR_PALETTE = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
};

export const SKILLS_DATA = {
  development: [
    { skill: 'HTML', score: 95 },
    { skill: 'CSS/SASS', score: 90 },
    { skill: 'JavaScript', score: 85 },
    { skill: 'TypeScript', score: 80 },
    { skill: 'React', score: 75 },
    { skill: 'Node.js', score: 70 },
    { skill: 'LLM/MCP', score: 65 },
    { skill: 'Git', score: 55 },
  ],
  design: [
    { name: 'UI/UX Design', value: 90 },
    { name: 'Figma', value: 85 },
    { name: 'Adobe Creative', value: 80 },
    { name: 'Prototyping', value: 75 },
    { name: 'User Research', value: 70 },
    { name: 'PixelPerfect', value: 65 },
  ],
};

export const RESPONSIVE_BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440,
};
