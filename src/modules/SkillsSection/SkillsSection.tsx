'use client';

import { SkillsContent, SkillsCharts } from './components/index';

interface SkillsSectionProps {
  id?: string;
  className?: string;
}

export function SkillsSection({ id = "skills", className = "" }: SkillsSectionProps) {
  return (
    <div className={`skills ${className}`} id={id}>
      <h2 className="skills__title">Skills</h2>
      <SkillsContent />
      <SkillsCharts />
    </div>
  );
}