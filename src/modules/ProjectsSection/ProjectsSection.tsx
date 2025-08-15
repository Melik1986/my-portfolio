import { lazy, Suspense } from 'react';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import styles from './ProjectsSection.module.scss';

// Ленивый импорт тяжёлого каталога с GSAP анимациями
const ProjectsCatalogLazy = lazy(() =>
  import('@/modules/ProjectsSection/components/index').then((mod) => ({
    default: mod.ProjectsCatalog,
  })),
);

interface ProjectsSectionProps {
  projects: ProjectData[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className={styles['projects-catalog']} id="projects-catalog" data-group-delay="5.5">
      <h2 className={`${styles['projects__title']} visually-hidden`}>Projects Catalog</h2>
      <div
        className={styles['projects__container']}
        data-animation="fade-up"
        data-duration="1.0"
        data-stagger="0.15"
        data-ease="power2.out"
        data-delay="0"
      >
        <Suspense fallback={<div className="projects-loading">Loading projects...</div>}>
          <ProjectsCatalogLazy projects={projects} />
        </Suspense>
      </div>
    </section>
  );
}
