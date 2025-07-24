'use client';

import { SkillsContent, SkillsCharts } from './components/index';
import './SkillsSection.module.scss';

export function SkillsSection() {
  return (
    <div className="skills" id="skills">
      <h2 className="skills__title">Skills</h2>
      <SkillsContent />
      <SkillsCharts />
    </div>
  );
}