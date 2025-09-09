import { AnimationConfig, ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';

export const ANIMATION_CONFIG: AnimationConfig = {
  zStep: -60,
  yStep: 80, // Больше вверх - эффект ступенек
  xStep: -40, // Минимальное смещение влево
  hoverLift: -80, // Увеличил подъем при наведении
  fanDuration: 0.6, // Увеличена продолжительность анимации раскрытия
  hoverDuration: 0.15,
  hoverShadow: '0 0 50px #64ff74, inset 0 0 120px #64ff74',
  cardShadow: '0 8px 32px rgba(0,0,0,0.2)',
  // Настройки задержки и скорости анимации
  initialDelay: 1.2, // Задержка 1.2 секунды перед началом анимации
  fastFanDuration: 0.25, // Быстрая анимация раскрытия за 0.25 секунды
  // Настройки для сжатия последних карточек
  compactLastCards: true,
  compactStartIndex: 10, // Начинать сжатие с 6-й карточки (индекс 5) - исправлено позиционирование
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
  fanDuration: 0.83, // Увеличена продолжительность анимации раскрытия для мобильных
  hoverDuration: 0.25, // Увеличенная длительность для лучшей обратной связи
  hoverShadow: '0 0 40px #64ff74, inset 0 0 100px #64ff74', // Более контрастные тени
  cardShadow: '0 16px 48px rgba(0,0,0,0.4)', // Усиленные тени для мобильных экранов
  touchFeedbackScale: 1.05, // Масштабирование при касании
  fanAngle: 15, // Базовый угол поворота для веерного расположения
  fanAngleStep: 5, // Шаг угла между карточками (15-20° между карточками)
  // Настройки задержки и скорости анимации
  initialDelay: 1.8, // Увеличенная задержка 1.5 секунды для мобильных устройств
  fastFanDuration: 0.3, // Быстрая анимация раскрытия за 0.3 секунды
  // Настройки для сжатия последних карточек
  compactLastCards: true,
  compactStartIndex: 10, // Начинать сжатие с ?-й карточки (индекс 5) - исправлено позиционирование
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
    image: '/images/catalog/project1.webp',
    previewImage: '/images/catalog/project1.webp',
    fullImage: '/images/catalog/project10_full.webp',
    mobileFullImage: '/images/catalog/project1_full_mobile.webp',
    title: 'Algora',
    text:
      'A modern website on Next.js for small and medium-sized businesses. ' +
      'The project was implemented with an emphasis on adaptability, animation and usability. ' +
      'The work applied modern approaches to the development and optimization of the interface.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/algora',
    theme: {
      textColor: '#292929',
      titleColor: '#292929',
      closeButtonColor: '#292929',
    },
  },
  {
    image: '/images/catalog/project2.webp',
    previewImage: '/images/catalog/project2.webp',
    fullImage: '/images/catalog/project2_full.webp',
    mobileFullImage: '/images/catalog/project2_full_mobile.webp',
    title: 'VK Marusya',
    text: 'A modern TypeScript React application for watching movies and trailers with genre filtering, search functionality, and user authentication.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/ВК-Маруся',
    theme: {
      textColor: '#ffffff',
      titleColor: '#ffffff',
      closeButtonColor: '#ffffff',
    },
  },
  {
    image: '/images/catalog/project3.webp',
    previewImage: '/images/catalog/project3.webp',
    fullImage: '/images/catalog/project3_full.webp',
    mobileFullImage: '/images/catalog/project3_full_mobile.webp',
    title: 'Houzzy',
    text: 'Complete furniture e-commerce platform with shopping cart, advanced filters, product search, and recently viewed items.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/Houzzy',
    theme: {
      textColor: '#292929',
      titleColor: '#292929',
      closeButtonColor: '#292929',
    },
  },
  {
    image: '/images/catalog/project4.webp',
    previewImage: '/images/catalog/project4.webp',
    fullImage: '/images/catalog/project4_full.webp',
    mobileFullImage: '/images/catalog/project4_full_mobile.webp',
    title: 'Format Archive',
    text: 'A Next.js site combining a product catalog, editorial stories, smooth scroll, and a persisted cart.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/Format Archive',
    theme: {
      textColor: '#ffffff',
      titleColor: '#ffffff',
      closeButtonColor: '#ffffff',
    },
  },
  {
    image: '/images/catalog/project5.webp',
    previewImage: '/images/catalog/project5.webp',
    fullImage: '/images/catalog/project5_full.webp',
    mobileFullImage: '/images/catalog/project5_full_mobile.webp',
    title: 'Nico Palmer',
    text: 'A cinematic React + Vite portfolio with smooth scroll, route transitions, and editorial sections.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/nico-palmer',
    theme: {
      textColor: '#292929',
      titleColor: '#292929',
      closeButtonColor: '#292929',
    },
  },
  {
    image: '/images/catalog/project6.webp',
    previewImage: '/images/catalog/project6.webp',
    fullImage: '/images/catalog/project6_full.webp',
    mobileFullImage: '/images/catalog/project6_full_mobile.webp',
    title: 'Aiden-Brooks',
    text:
      ' Design & Art Direction Portfolio ' +
      'A fast, minimal, motion‑driven portfolio built with React + Vite.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/aiden-brooks',
    theme: {
      textColor: '#ffffff',
      titleColor: '#ffffff',
      closeButtonColor: '#ffffff',
    },
  },
  {
    image: '/images/catalog/project7.webp',
    previewImage: '/images/catalog/project7.webp',
    fullImage: '/images/catalog/project7_full.webp',
    mobileFullImage: '/images/catalog/project7_full_mobile.webp',
    title: 'Origin',
    text:
      'Motion‑first React Starter' +
      'A minimal React + Vite starter with smooth scroll, 3D (three.js), and modern routing.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/origin',
    theme: {
      textColor: '#292929',
      titleColor: '#292929',
      closeButtonColor: '#292929',
    },
  },
  {
    image: '/images/catalog/project8.webp',
    previewImage: '/images/catalog/project8.webp',
    fullImage: '/images/catalog/project8_full.webp',
    mobileFullImage: '/images/catalog/project8_full_mobile.webp',
    title: 'Otis Valen ',
    text:
      'Creative Portfolio ' +
      'Lightweight portfolio with GSAP animations, smooth scroll, and static pages powered by Vite. ',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/otis-valen',
    theme: {
      textColor: '#ffffff',
      titleColor: '#ffffff',
      closeButtonColor: '#ffffff',
    },
  },
  {
    image: '/images/catalog/project9.webp',
    previewImage: '/images/catalog/project9.webp',
    fullImage: '/images/catalog/project9_full.webp',
    mobileFullImage: '/images/catalog/project9_full_mobile.webp',
    title: 'Car Marketplace',
    text:
      'Car Marketplace — Buy & Rent Platform. ' +
      'A modern car marketplace with car listings, user authentication, and car booking.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/car-marketplace',
    theme: {
      textColor: '#292929',
      titleColor: '#292929',
      closeButtonColor: '#292929',
    },
  },
  {
    image: '/images/catalog/project10.webp',
    previewImage: '/images/catalog/project10.webp',
    fullImage: '/images/catalog/project10_full.webp',
    mobileFullImage: '/images/catalog/project10_full_mobile.webp',
    title: 'CG Karim ',
    text: 'CG Karim Saab Scroll Animation.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/cg-karim-saab-scroll-animation',
    theme: {
      textColor: '#ffffff',
      titleColor: '#ffffff',
      closeButtonColor: '#ffffff',
    },
  },
];
