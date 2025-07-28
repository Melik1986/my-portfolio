'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import './ProjectCardFull.module.scss';

interface ProjectCardFullscreenProps {
  project: ProjectData;
}

export function ProjectCardFullscreen({ project }: ProjectCardFullscreenProps) {
  return (
    <>
      <Image
        className="projects-card__img projects-card__img--large"
        src={project.image}
        alt={project.title}
        width={800}
        height={600}
        priority
      />
      <div className="projects-card__content">
        <h3 className="projects-card__title">{project.title}</h3>
        <p className="projects-card__text">{project.text}</p>
        <Link
          className="projects-card__link"
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Repositories
        </Link>
      </div>
    </>
  );
}
