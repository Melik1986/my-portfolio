'use client';

import React from 'react';
import { SkillsContent, SkillsCharts } from './components/index';
import styles from './SkillsSection.module.scss';
import { useRef } from 'react';
import { useI18n } from '@/i18n';

interface SkillsSectionWrapperProps {
  isMobile?: boolean;
  part?: 'content' | 'charts' | 'full';
}

export function SkillsSectionWrapper({ isMobile = false, part = 'full' }: SkillsSectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Для десктопа или полной версии
  if (!isMobile || part === 'full') {
    return (
      <section ref={sectionRef} className={styles.skills} id="skills" data-group-delay="5.0">
        <h2 className={`${styles.skills__title} visually-hidden`}>{t('section.skills.title')}</h2>
        <div className={`${styles['skills__content']} ${styles['skills__content-left']}`}>
          <SkillsContent />
        </div>
        <div className={`${styles['skills__content']} ${styles['skills__content-right']}`}>
          <SkillsCharts />
        </div>
      </section>
    );
  }

  // Для мобильной версии - только контент
  if (part === 'content') {
    return (
      <section ref={sectionRef} className={styles.skills} id="skills-content" data-group-delay="0">
        <h2 className={`${styles.skills__title} visually-hidden`}>{t('section.skills.title')}</h2>
        <div className={`${styles['skills__content']} ${styles['skills__content-left']}`} style={{ width: '100%' }} data-animation="fade-up" data-delay="0.2">
          <SkillsContent />
        </div>
      </section>
    );
  }

  // Для мобильной версии - только графики
  if (part === 'charts') {
    return (
      <section ref={sectionRef} className={styles.skills} id="skills-charts" data-group-delay="0">
        <div className={`${styles['skills__content']} ${styles['skills__content-right']}`} style={{ width: '100%', height: '100%' }} data-animation="fade-up" data-delay="0.2">
          <SkillsCharts />
        </div>
      </section>
    );
  }

  return null;
}