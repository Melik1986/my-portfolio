'use client';

import { ProjectsCatalog } from '@/modules/ProjectsSection/components/index';
import styles from './ProjectsSection.module.scss';

export function ProjectsSection() {
  return (
    <section className={styles['projects-catalog']} id="projects-catalog" data-group-delay="6.0">
      <h2 className={`${styles['projects__title']} visually-hidden`}>Projects Catalog</h2>
      <ProjectsCatalog
        data-animation="fade-up"
        data-duration="0.8"
        data-stagger="0.1"
        data-ease="power2.out"
        data-delay="0"
      />
    </section>
  );
}
