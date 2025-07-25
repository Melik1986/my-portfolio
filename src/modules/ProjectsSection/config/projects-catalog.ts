'use client';

import { AnimationConfig, ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';

export const ANIMATION_CONFIG: AnimationConfig = {
  zStep: -180,
  yStep: -45,
  xStep: -50,
  hoverLift: -120,
  fanDuration: 0.7,
  hoverDuration: 0.3,
  hoverShadow: '0 0 50px #64ff74, inset 0 0 120px #64ff74',
  cardShadow: '0 8px 32px rgba(0,0,0,0.2)',
};

export const PROJECTS_DATA: ProjectData[] = [
  {
    image: 'public/images/catalog/project10.webp',
    previewImage: 'public/images/catalog/project10.webp',
    title: 'Algora',
    text:
      'A modern website on Next.js for small and medium-sized businesses. ' +
      'The project was implemented with an emphasis on adaptability, animation and usability. ' +
      'The work applied modern approaches to the development and optimization of the interface.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/algora',
  },
  {
    image: 'public/images/catalog/project9.webp',
    previewImage: 'public/images/catalog/project9.webp',
    title: 'Houzzy',
    text:
      'This is a modern online furniture store with an adaptive design. ' +
      'Adaptive Layout, Pixel Perfect, Responsive Web Design, Cross Browser Compatibility, ' +
      'Clean Code, Well Structured, SEO Friendly, and Valid Code.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/Houzzy',
  },
  {
    image: 'public/images/catalog/project8.webp',
    previewImage: 'public/images/catalog/project8.webp',
    title: 'Format Archive',
    text:
      'A catalog of products and articles with the ability to filter and search. ' +
      'Modern design and smooth animations. Adaptive layout for all devices. ' +
      'Fast page loading and SEO optimization. Simple and intuitive navigation.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/format-archive',
  },
  {
    image: 'public/images/catalog/project7.webp',
    previewImage: 'public/images/catalog/project7.webp',
    title: 'Balanced Pitch',
    text:
      'Modern one-page website for small and medium-sized businesses. ' +
      'The project is implemented with an emphasis on simplicity, functionality and adaptability ' +
      'to ensure the site looks great and works on all devices.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/balanced-pitch',
  },
  {
    image: 'public/images/catalog/project1.webp',
    previewImage: 'public/images/catalog/project1.webp',
    title: 'Проект 6',
    text: 'Описание шестого проекта.',
    link: 'https://example.com/project6',
  },
  {
    image: 'public/images/catalog/project5.webp',
    previewImage: 'public/images/catalog/project5.webp',
    title: 'Aiden-Brooks',
    text:
      'This is a one-page SPA application developed on React and Vite, representing the Aiden Brooks portfolio. ' +
      'The project demonstrates web development skills and uses modern technologies to create an interactive ' +
      'and visually appealing user experience.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/aiden-brooks',
  },
  {
    image: 'public/images/catalog/project4.webp',
    previewImage: 'public/images/catalog/project4.webp',
    title: 'Nico Palmer',
    text: 'A showcase of works, services, and reviews to attract new small and medium-sized business customers.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/nico-palmer',
  },
  {
    image: 'public/images/catalog/project3.webp',
    previewImage: 'public/images/catalog/project3.webp',
    title: 'Origin Studio',
    text:
      'Minimalistic structure and clean code. Instant build and launch thanks to Vite. ' +
      'Support for React/JSX and modern ecosystem features. Flexible linting settings (ESLint, Prettier). ' +
      'Modern plug-ins to increase productivity. Easily expanded to meet the needs of small and medium-sized businesses. ' +
      'Adaptive layout and readiness for SEO optimization.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/origin',
  },
  {
    image: 'public/images/catalog/project2.webp',
    previewImage: 'public/images/catalog/project2.webp',
    title: 'Проект 2',
    text: 'Описание второго проекта.',
    link: 'https://github.com/Melik1986/Projects-catalog/tree/master/social_media_app-main',
  },
  {
    image: 'public/images/catalog/project1-mini.png',
    previewImage: 'public/images/catalog/project1.webp',
    title: 'Проект 1',
    text: 'Описание первого проекта.',
    link: 'https://github.com/Melik1986/Car_Hub',
  },
];
