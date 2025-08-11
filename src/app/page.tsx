// серверный компонент
import { Header } from '@/lib/ui/Header/Header';
import { AnimatedCardSection } from '@/modules/AnimatedCardSection/AnimatedCardSection';
import { HeroSection } from '@/modules/HeroSection/HeroSection';
import { AboutSection } from '@/modules/AboutSection/AboutSection';
import { SkillsSection } from '@/modules/SkillsSection/SkillsSection';
import { ProjectsSection } from '@/modules/ProjectsSection/ProjectsSection';
import { GallerySection } from '@/modules/GallerySection/GallerySection';
import { PROJECTS_DATA } from '@/modules/ProjectsSection/config/projects-catalog';

/**
 * Главная страница портфолио
 * Содержит все секции портфолио с анимированными картами
 */
export const revalidate = 86400; // каждые 24 часа

export default function Home() {
  return (
    <>
      <Header />

      <div className="portfolio__wrapper scroll-section">
        <ul className="portfolio__list">
          <AnimatedCardSection id="hero-section" title="Hero" sectionIndex={0}>
            <HeroSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="about-section" title="About" sectionIndex={1}>
            <AboutSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="skills-section" title="Skills" sectionIndex={2}>
            <SkillsSection />
          </AnimatedCardSection>

          <AnimatedCardSection id="projects-section" title="Projects" sectionIndex={3}>
            <ProjectsSection projects={PROJECTS_DATA} />
          </AnimatedCardSection>

          <AnimatedCardSection id="gallery-section" title="Gallery" sectionIndex={4}>
            <GallerySection />
          </AnimatedCardSection>
        </ul>
      </div>
    </>
  );
}
