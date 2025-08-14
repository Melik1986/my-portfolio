import { AboutContent, Avatar } from './components/index';
import styles from './About.module.scss';

export function AboutSection() {
  return (
    <section className={styles.about} id="about" data-section-index="1" data-group-delay="2.5">
      <h2 className={`${styles.about__title} visually-hidden`}>About</h2>
      <div className={`${styles['about__content']} ${styles['about__content-left']}`}>
        <AboutContent />
      </div>
      <div className={`${styles['about__content']} ${styles['about__content-right']}`}>
        <Avatar />
      </div>
    </section>
  );
}
