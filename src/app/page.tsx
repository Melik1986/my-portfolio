'use client';

import { Header } from '../lib/ui/Header/Header';
import AnimatedCardSection from '../modules/AnimatedCardSection/AnimatedCardSection';
import { HeroSection } from '../modules/HeroSection/HeroSection';
import { AboutSection } from '../modules/AboutSection/AboutSection';

export default function Home() {
  return (
    <main className="portfolio" id="smooth-wrapper">
      <div className="portfolio__section-wrapper" id="smooth-content">
        <Header />

        <AnimatedCardSection id="hero-section" title="Hero">
          <HeroSection />
        </AnimatedCardSection>

        <AnimatedCardSection id="about-section" title="About">
          <AboutSection />
        </AnimatedCardSection>
      </div>
    </main>
  );
}
