export interface AiContentSectionConstantsType {
  DEFAULT_TITLE: string;
  DEFAULT_SUBTITLE: string;
  DEFAULT_DESCRIPTION: string;
  DEFAULT_HORIZONTAL_TEXTS: string[];
  DEFAULT_VERTICAL_ICONS: string[];
}

export const AI_CONTENT_CONSTANTS: AiContentSectionConstantsType = {
  DEFAULT_TITLE: 'AI Content Section',
  DEFAULT_SUBTITLE: 'AI-Powered Solutions',
  DEFAULT_DESCRIPTION: 'Discover our cutting-edge AI technologies and innovative solutions that transform the way you work and create.',
  DEFAULT_HORIZONTAL_TEXTS: [
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Neural Networks',
    'Computer Vision',
    'Natural Language Processing',
    'Predictive Analytics',
    'Automation'
  ],
  DEFAULT_VERTICAL_ICONS: [
    '🤖',
    '🧠',
    '💻',
    '🔬',
    '📊',
    '🌐',
    '⚡',
    '🚀'
  ]
};

// Дополнительные значения по умолчанию для вертикальных колонок постеров (совместимо с public/)
export const DEFAULT_VERTICAL_COLUMNS: string[][] = [
  [
    '/images/poster/poster-1.webp',
    '/images/poster/poster-1.webp',
    '/images/poster/poster-1.webp',
    '/images/poster/poster-4.webp',
    '/images/poster/poster-5.webp',
  ],
  [
    '/images/poster/poster-6.webp',
    '/images/poster/poster-6.webp',
    '/images/poster/poster-6.webp',
    '/images/poster/poster-9.webp',
    '/images/poster/poster-10.webp',
  ],
  [
    '/images/poster/poster-11.webp',
    '/images/poster/poster-12.webp',
    '/images/poster/poster-12.webp',
    '/images/poster/poster-12.webp',
    '/images/poster/poster-12.webp',
  ],
];