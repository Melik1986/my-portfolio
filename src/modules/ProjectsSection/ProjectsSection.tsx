'use client';

import { ProjectsCatalog } from '@/modules/ProjectsSection/components/index';
import './ProjectsSection.module.scss';

export function ProjectsSection() {
  return (
    <div className="projects-catalog" id="projects-catalog">
      <h2 className="projects__title">Projects Catalog</h2>
      <ProjectsCatalog />
    </div>
  );
}
