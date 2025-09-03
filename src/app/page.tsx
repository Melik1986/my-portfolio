// серверный компонент
import { Header } from '@/lib/ui';
import { AnimatedCardSection } from '@/modules/AnimatedCardSection/AnimatedCardSection';
import { AdaptiveCardSection } from '@/modules/AnimatedCardSection/AdaptiveCardSection';
import { HeroSection } from '@/modules/HeroSection/HeroSection';
import { AboutSectionWrapper } from '@/modules/AboutSection/AboutSectionWrapper';
import { SkillsSectionWrapper } from '@/modules/SkillsSection/SkillsSectionWrapper';
import { ProjectsSection } from '@/modules/ProjectsSection/ProjectsSection';
import { AiContentSection } from '@/modules/AiContentSection/AiContentSection';
import { AiVideoContentSection } from '@/modules/AiVideoContentSection/AiVideoContentSection';
import { PROJECTS_DATA } from '@/modules/ProjectsSection/config/projects-catalog';
import { ContactSection } from '@/modules/ContactSection/ContactSection';

/**
 * Главная страница портфолио
 * Содержит все секции портфолио с анимированными картами
 */
export const revalidate = 86400; // каждые 24 часа

// Вынесенные компоненты для сокращения основной функции
function AboutCard() {
  return (
    <AdaptiveCardSection 
      id="about-section" 
      title="About" 
      sectionIndex={1}
      mobileConfig={{
        split: true,
        leftContent: <AboutSectionWrapper isMobile={true} part="content" />,
        rightContent: <AboutSectionWrapper isMobile={true} part="avatar" />,
        leftTitle: "About Me",
        rightTitle: "3D Avatar"
      }}
    >
      <AboutSectionWrapper isMobile={false} part="full" />
    </AdaptiveCardSection>
  );
}

function SkillsCard() {
  return (
    <AdaptiveCardSection 
      id="skills-section" 
      title="Skills" 
      sectionIndex={2}
      mobileConfig={{
        split: true,
        leftContent: <SkillsSectionWrapper isMobile={true} part="content" />,
        rightContent: <SkillsSectionWrapper isMobile={true} part="charts" />,
        leftTitle: "Skills Info",
        rightTitle: "Skills Charts"
      }}
    >
      <SkillsSectionWrapper isMobile={false} part="full" />
    </AdaptiveCardSection>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <div className="portfolio__wrapper scroll-section">
        <ul className="portfolio__list">
          <AnimatedCardSection id="hero-section" title="Hero" sectionIndex={0}>
            <HeroSection />
          </AnimatedCardSection>
          <AboutCard />
          <SkillsCard />
          <AnimatedCardSection id="projects-section" title="Projects" sectionIndex={3}>
            <ProjectsSection projects={PROJECTS_DATA} />
          </AnimatedCardSection>
          <AnimatedCardSection id="ai-content-section" title="Ai Content" sectionIndex={4}>
            <AiContentSection />
          </AnimatedCardSection>
          <AnimatedCardSection id="ai-video-section" title="Ai Video" sectionIndex={5}>
            <AiVideoContentSection />
          </AnimatedCardSection>
          <AnimatedCardSection id="contact-section" title="Contact" sectionIndex={6}>
            <ContactSection />
          </AnimatedCardSection>
        </ul>
      </div>
    </>
  );
}
