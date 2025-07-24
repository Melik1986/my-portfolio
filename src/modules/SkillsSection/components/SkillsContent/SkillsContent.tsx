'use client';

import { SkillsText, SkillsAnimation } from '../index';
import { useGsap } from '@/lib/hooks/useGsap';
import './SkillsContent.module.scss';

export function SkillsContent() {
  const { containerRef } = useGsap({});

  return (
    <div ref={containerRef} className="skills__content-left">
      <h2 className="skills__title">Skills</h2>
      <p
        className="skills__heading"
        data-animation="slide-left"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.2"
      >
        Skills &amp;&nbsp;Expertise
      </p>
      <SkillsText />
      <SkillsAnimation />
    </div>
  );
}
