import React from 'react';
import Image from 'next/image';
import { ProjectData } from '@/modules/ProjectsSection/types/projects-catalog';
import { getMobileImage } from '@/modules/ProjectsSection/utils/getMobileImage';
import styles from './ProjectCardFull.module.scss';

interface ProjectImageProps {
  project: ProjectData;
}

export function ProjectImage({ project }: ProjectImageProps) {
  const imageSource = getMobileImage(project);

  return (
    <Image
      className={styles['projects-card__img']}
      src={imageSource}
      alt={project.title}
      width={1920}
      height={1080}
      priority
      sizes="100vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
}