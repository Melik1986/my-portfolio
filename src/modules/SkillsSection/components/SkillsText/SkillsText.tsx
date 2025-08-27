import styles from './SkillsText.module.scss';
import { useI18n } from '@/i18n';

function SkillsTextDesktop() {
  const { t } = useI18n();
  return <span className={styles['skills__text-desktop']}>{t('section.skills.text.desktop')}</span>;
}

function SkillsTextMobile() {
  const { t } = useI18n();
  return <span className={styles['skills__text-mobile']}>{t('section.skills.text.mobile')}</span>;
}

export function SkillsText() {
  return (
    <p
      className={styles.skills__text}
      data-animation="text-reveal"
      data-duration="1.2"
      data-ease="power2.out"
      data-delay="0.2"
    >
      <SkillsTextDesktop />
      <SkillsTextMobile />
    </p>
  );
}
