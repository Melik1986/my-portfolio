'use client';

import { AboutContent } from './components/AboutContent/AboutContent';
import { AboutGallery } from './components/AboutGallery/AboutGallery';
import { AboutSectionProps } from '@/types/about.types';
import './About.module.scss';

export const AboutSection: React.FC<AboutSectionProps> = (props) => {
  return (
    <div className="about" id="about">
      <h2 className="about__title">About</h2>
      <AboutContent />
      <AboutGallery />
    </div>
  );
};
