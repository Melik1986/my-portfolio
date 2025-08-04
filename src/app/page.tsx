'use client';

import { Header } from '@/lib/ui/Header/Header';
import { AnimatedCardSection } from '@/modules/AnimatedCardSection/AnimatedCardSection';
import { HeroSection } from '@/modules/HeroSection/HeroSection';
import { AboutSection } from '@/modules/AboutSection/AboutSection';
import { SkillsSection } from '@/modules/SkillsSection/SkillsSection';
import { ProjectsSection } from '@/modules/ProjectsSection/ProjectsSection';
import { GallerySection } from '@/modules/GallerySection/GallerySection';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';

/**
 * Главная страница портфолио
 * Содержит все секции портфолио с анимированными картами
 */
export default function Home() {
  useScrollSmoother(); // Гарантируем инициализацию ScrollSmoother до ScrollTrigger
  return (
    <>
      <Header />

      <div className="portfolio__wrapper scroll-section">
        <ul className="portfolio__list">
          <AnimatedCardSection
            id="hero-section"
            title="Hero"
            sectionIndex={0}
            direction="vertical"
          >
            <HeroSection />
          </AnimatedCardSection>

          <AnimatedCardSection 
          id="about-section" 
          title="About" 
          sectionIndex={1}>
            <AboutSection />
          </AnimatedCardSection>

          <AnimatedCardSection 
          id="skills-section" 
          title="Skills" 
          sectionIndex={2}>
            <SkillsSection />
          </AnimatedCardSection>

          <AnimatedCardSection
            id="projects-section"
            title="Projects"
            direction="horizontal"
            sectionIndex={3}
          >
            <ProjectsSection />
          </AnimatedCardSection>

          <AnimatedCardSection
            id="gallery-section"
            title="Gallery"
            direction="horizontal"
            sectionIndex={4}
          >
            <GallerySection />
          </AnimatedCardSection>
        </ul>
      </div>
    </>
  );
}
