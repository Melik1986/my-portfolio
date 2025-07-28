'use client';

import { Header } from '@/lib/ui/Header/Header';
import { AnimatedCardSection } from '@/modules/AnimatedCardSection/AnimatedCardSection';
import { HeroSection } from '@/modules/HeroSection/HeroSection';
import { AboutSection } from '@/modules/AboutSection/AboutSection';
import { SkillsSection } from '@/modules/SkillsSection/SkillsSection';
import { ProjectsSection } from '@/modules/ProjectsSection/ProjectsSection';
import { GallerySection } from '@/modules/GallerySection/GallerySection';

/**
 * Главная страница портфолио
 * Содержит все секции портфолио с анимированными картами
 */
export default function Home() {
  return (
    <main className="portfolio" id="smooth-wrapper">
      <div className="portfolio__section-wrapper" id="smooth-content">
        <Header />
        
        <ul className="portfolio__wrapper">
          <AnimatedCardSection id="hero-section" title="Hero">
            <HeroSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="about-section" title="About">
            <AboutSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="skills-section" title="Skills">
            <SkillsSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="projects-section" title="Projects" direction="horizontal">
            <ProjectsSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="gallery-section" title="Gallery" direction="horizontal">
            <GallerySection />
          </AnimatedCardSection>
        </ul>
      </div>
    </main>
  );
}
