// Основной компонент
export { default as AiContentSection } from './AiContentSection';
export { AiContentSection as AiContentSectionComponent } from './AiContentSection';

// Типы
export type { AiContentProps, MarqueeAnimationState } from './types/AiContent.types';

// Хуки
export { useMarqueeAnimation } from './hooks/useMarqueeAnimation';

// Конфигурация
export { AI_CONTENT_CONFIG } from './config/AiContent.config';
export type { AiContentSectionConfigType } from './config/AiContent.config';

// Утилиты
export {
  generateKey,
  isLastElement,
  getAnimationVariables,
  getIconDimensions,
  createRepeatedArray,
  getAnimationConfig,
} from './utils/AIContent.utils';

// Константы
export { AI_CONTENT_CONSTANTS } from './constants/AiContent.constants';
export type { AiContentSectionConstantsType } from './constants/AiContent.constants';
