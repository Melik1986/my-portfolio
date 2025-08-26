'use client';

import { SkillsText, SkillsAnimation } from '../index';
import styles from './SkillsContent.module.scss';
import { useI18n } from '@/i18n';

export function SkillsContent() {
  const { t } = useI18n();
  return (
    <>
      <h3
        className={styles['skills__heading']}
        data-animation="slide-left"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0"
      >
        {t('skills.heading')}
      </h3>
      <SkillsText />
      <SkillsAnimation />
    </>
  );
}
