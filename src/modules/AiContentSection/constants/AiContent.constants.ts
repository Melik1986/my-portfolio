export interface AiContentSectionConstantsType {
  DEFAULT_TITLE: string;
  DEFAULT_DESCRIPTION: string;
  DEFAULT_HORIZONTAL_TEXTS: string[];
  DEFAULT_VERTICAL_ICONS: string[];
}

export const AI_CONTENT_CONSTANTS: AiContentSectionConstantsType = {
  DEFAULT_TITLE: 'section.ai.title',
  DEFAULT_DESCRIPTION: 'section.ai.description',
  DEFAULT_HORIZONTAL_TEXTS: [
    'GitHub Copilot Cursor AI LLM ChatGPT SORA AI Recraft KREA FLORA',
    'VS Code Cursor GitDesktop GitLab Github React Figma Adobe Tilda Spine Blender',
  ],
  DEFAULT_VERTICAL_ICONS: [
    '/images/poster/poster-1.webp',
    '/images/poster/poster-2.webp',
    '/images/poster/poster-3.webp',
    '/images/poster/poster-4.webp',
    '/images/poster/poster-5.webp',
    '/images/poster/poster-6.webp',
    '/images/poster/poster-7.webp',
    '/images/poster/poster-8.webp',
  ],
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
