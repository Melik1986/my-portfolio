'use client';

import { SkillsContent } from './components/index';
import { SkillsChartsDynamic } from './components/SkillsCharts/SkillsChartsDynamic';
import styles from './SkillsSection.module.scss';
import { useRef } from 'react';
import { useI18n } from '@/i18n';

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  return (
    <section ref={sectionRef} className={styles.skills} id="skills" data-group-delay="5.0">
      <h2 className={`${styles.skills__title} visually-hidden`}>{t('section.skills.title')}</h2>
      <div className={`${styles['skills__content']} ${styles['skills__content-left']}`}>
        <SkillsContent />
      </div>
      <div className={`${styles['skills__content']} ${styles['skills__content-right']}`}>
        <SkillsChartsDynamic />
      </div>
    </section>
  );
}
