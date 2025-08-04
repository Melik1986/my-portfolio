'use client';

import { ProjectsCatalog } from '@/modules/ProjectsSection/components/index';
import styles from './ProjectsSection.module.scss';

export function ProjectsSection() {
  return (
    <section className={styles['projects-catalog']} id="projects-catalog">
      <h2 className={`${styles['projects__title']} visually-hidden`}>Projects Catalog</h2>
      <ProjectsCatalog />
    </section>
  );
}
