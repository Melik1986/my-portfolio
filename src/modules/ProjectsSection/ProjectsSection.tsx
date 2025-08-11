'use client';

import { useEffect, useRef } from 'react';
import { ProjectsCatalog } from '@/modules/ProjectsSection/components/index';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import styles from './ProjectsSection.module.scss';

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      createElementTimeline(sectionRef.current);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles['projects-catalog']}
      id="projects-catalog"
      data-group-delay="5.5"
    >
      <h2 className={`${styles['projects__title']} visually-hidden`}>Projects Catalog</h2>
      <div
        data-animation="fade-up"
        data-duration="1.0"
        data-stagger="0.15"
        data-ease="power2.out"
        data-delay="0"
      >
        <ProjectsCatalog />
      </div>
    </section>
  );
}
