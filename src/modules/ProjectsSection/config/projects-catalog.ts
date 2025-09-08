import { AnimationConfig, ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';

export const ANIMATION_CONFIG: AnimationConfig = {
  zStep: -60,
  yStep: 80, // Больше вверх - эффект ступенек
  xStep: -40, // Минимальное смещение влево
  hoverLift: -80, // Увеличил подъем при наведении
  fanDuration: 0.3,
  hoverDuration: 0.15,
  hoverShadow: '0 0 50px #64ff74, inset 0 0 120px #64ff74',
  cardShadow: '0 8px 32px rgba(0,0,0,0.2)',
  // Настройки для сжатия последних карточек
  compactLastCards: true,
  compactStartIndex: 4, // Начинать сжатие с 5-й карточки (индекс 4)
  compactZStep: -35, // Уменьшенный шаг по Z для последних карточек
  compactYStep: 50, // Уменьшенный шаг по Y для последних карточек
  lastTwoCardsScale: 0.85, // Масштаб для последних двух карточек (уменьшение на 15%)
};

// Адаптивная конфигурация для мобильных устройств
export const MOBILE_ANIMATION_CONFIG: AnimationConfig = {
  zStep: -60, // Увеличили для лучшего разделения карточек
  yStep: 120, // Больше вертикальное разделение (yStep * 1.5)
  xStep: -20, // Меньше горизонтальное смещение
  hoverLift: -100, // Больше подъем для лучшей видимости
  fanDuration: 0.3, // Оптимальная скорость для touch
  hoverDuration: 0.25, // Увеличенная длительность для лучшей обратной связи
  hoverShadow: '0 0 40px #64ff74, inset 0 0 100px #64ff74', // Более контрастные тени
  cardShadow: '0 16px 48px rgba(0,0,0,0.4)', // Усиленные тени для мобильных экранов
  touchFeedbackScale: 1.05, // Масштабирование при касании
  fanAngle: 15, // Базовый угол поворота для веерного расположения
  fanAngleStep: 5, // Шаг угла между карточками (15-20° между карточками)
  // Настройки для сжатия последних карточек
  compactLastCards: true,
  compactStartIndex: 4, // Начинать сжатие с 5-й карточки (индекс 4)
  compactZStep: -35, // Уменьшенный шаг по Z для последних карточек
  compactYStep: 75, // Уменьшенный шаг по Y для последних карточек
  lastTwoCardsScale: 0.85, // Масштаб для последних двух карточек (уменьшение на 15%)
};

// Функция получения конфигурации в зависимости от устройства
export const getAnimationConfig = (): AnimationConfig => {
  if (typeof window === 'undefined') return ANIMATION_CONFIG;
  
  const isMobile = window.matchMedia?.('(max-width: 1224px)').matches || window.innerWidth <= 1224;
  return isMobile ? MOBILE_ANIMATION_CONFIG : ANIMATION_CONFIG;
};

export const PROJECTS_DATA: ProjectData[] = [
  {
    image: '/images/catalog/project10.webp',
    previewImage: '/images/catalog/project10.webp',
    fullImage: '/images/catalog/project10_full.webp',
    title: 'Algora',
    text:
      'A modern website on Next.js for small and medium-sized businesses. ' +
      'The project was implemented with an emphasis on adaptability, animation and usability. ' +
      'The work applied modern approaches to the development and optimization of the interface.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/algora',
  },
  {
    image: '/images/catalog/project9.webp',
    previewImage: '/images/catalog/project9.webp',
    fullImage: '/images/catalog/project9_full.webp',
    title: 'Houzzy',
    text:
      'This is a modern online furniture store with an adaptive design. ' +
      'Adaptive Layout, Pixel Perfect, Responsive Web Design, Cross Browser Compatibility, ' +
      'Clean Code, Well Structured, SEO Friendly, and Valid Code.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/Houzzy',
  },
  {
    image: '/images/catalog/project8.webp',
    previewImage: '/images/catalog/project8.webp',
    fullImage: '/images/catalog/project8_full.webp',
    title: 'Format Archive',
    text:
      'A catalog of products and articles with the ability to filter and search. ' +
      'Modern design and smooth animations. Adaptive layout for all devices. ' +
      'Fast page loading and SEO optimization. Simple and intuitive navigation.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/format-archive',
  },
  {
    image: '/images/catalog/project7.webp',
    previewImage: '/images/catalog/project7.webp',
    fullImage: '/images/catalog/project7_full.webp',
    title: 'Balanced Pitch',
    text:
      'Modern one-page website for small and medium-sized businesses. ' +
      'The project is implemented with an emphasis on simplicity, functionality and adaptability ' +
      'to ensure the site looks great and works on all devices.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/balanced-pitch',
  },
  {
    image: '/images/catalog/project1.webp',
    previewImage: '/images/catalog/project1.webp',
    fullImage: '/images/catalog/project1_full.webp',
    title: 'Проект 6',
    text: 'Описание шестого проекта.',
    link: 'https://example.com/project6',
  },
  {
    image: '/images/catalog/project5.webp',
    previewImage: '/images/catalog/project5.webp',
    fullImage: '/images/catalog/project5_full.webp',
    title: 'Aiden-Brooks',
    text:
      'This is a one-page SPA application developed on React and Vite, representing the Aiden Brooks portfolio. ' +
      'The project demonstrates web development skills and uses modern technologies to create an interactive ' +
      'and visually appealing user experience.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/aiden-brooks',
  },
  {
    image: '/images/catalog/project4.webp',
    previewImage: '/images/catalog/project4.webp',
    fullImage: '/images/catalog/project4_full.webp',
    title: 'Nico Palmer',
    text: 'A showcase of works, services, and reviews to attract new small and medium-sized business customers.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/nico-palmer',
  },
  {
    image: '/images/catalog/project3.webp',
    previewImage: '/images/catalog/project3.webp',
    fullImage: '/images/catalog/project3_full.webp',
    title: 'Origin Studio',
    text:
      'Minimalistic structure and clean code. Instant build and launch thanks to Vite. ' +
      'Support for React/JSX and modern ecosystem features. Flexible linting settings (ESLint, Prettier). ' +
      'Modern plug-ins to increase productivity. Easily expanded to meet the needs of small and medium-sized businesses. ' +
      'Adaptive layout and readiness for SEO optimization.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/origin',
  },
  {
    image: '/images/catalog/project11.webp',
    previewImage: '/images/catalog/project11.webp',
    fullImage: '/images/catalog/project11_full.webp',
    title: 'Проект 2',
    text: 'Описание второго проекта.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/social_media_app-main',
  },
  {
    image: '/images/catalog/project2.webp',
    previewImage: '/images/catalog/project2.webp',
    fullImage: '/images/catalog/project2_full.webp',
    title: 'Проект 1',
    text: 'Описание первого проекта.',
    link: 'https://github.com/Melik1986/Car_Hub',
  },
];
