'use client';

import React, { useRef } from 'react';
import { SkillsContent, SkillsCharts } from './components/index';
import styles from './SkillsSection.module.scss';
import { useI18n } from '@/i18n';

interface SkillsSectionWrapperProps {
  isMobile?: boolean;
  part?: 'content' | 'charts' | 'full';
}

// Рендер полной версии секции
function FullSection({ title }: { title: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section ref={sectionRef} className={styles.skills} id="skills" data-group-delay="5.0">
      <h2 className={`${styles.skills__title} visually-hidden`}>{title}</h2>
      <div className={`${styles['skills__content']} ${styles['skills__content-left']}`}>
        <SkillsContent />
      </div>
      <div className={`${styles['skills__content']} ${styles['skills__content-right']}`}>
        <SkillsCharts />
      </div>
    </section>
  );
}

// Рендер только контента для мобильной версии
function MobileContentSection({ title }: { title: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section
      ref={sectionRef}
      className={styles.skills}
      id="skills-content"
      data-section-index="2.1"
      data-group-delay="0"
    >
      <h2 className={`${styles.skills__title} visually-hidden`}>{title}</h2>
      <div
        className={`${styles['skills__content']} ${styles['skills__content-left']}`}
        style={{ width: '100%' }}
        data-animation="fade-up"
        data-delay="0.2"
      >
        <SkillsContent />
      </div>
    </section>
  );
}

// Рендер только графиков для мобильной версии
function MobileChartsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section
      ref={sectionRef}
      className={styles.skills}
      id="skills-charts"
      data-section-index="2.2"
      data-group-delay="0"
    >
      <div
        className={`${styles['skills__content']} ${styles['skills__content-right']}`}
        style={{ width: '100%', height: '100%' }}
        data-animation="fade-up"
        data-delay="0.2"
      >
        <SkillsCharts />
      </div>
    </section>
  );
}

export function SkillsSectionWrapper({
  isMobile = false,
  part = 'full',
}: SkillsSectionWrapperProps) {
  const { t } = useI18n();
  const title = t('section.skills.title');

  if (!isMobile || part === 'full') {
    return <FullSection title={title} />;
  }

  if (part === 'content') {
    return <MobileContentSection title={title} />;
  }

  if (part === 'charts') {
    return <MobileChartsSection />;
  }

  return null;
}
