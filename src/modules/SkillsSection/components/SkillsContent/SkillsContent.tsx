'use client';

import { SkillsText, SkillsAnimation } from '../index';


export function SkillsContent() {
  return (
    <div className="skills__content-left">
      <h2 className="skills__title">Skills</h2>
      <p className="skills__heading" data-animation="slide-left" data-duration="0.8" data-ease="power2.out" data-delay="0.2">
      Skills &amp;&nbsp;Expertise
      </p>
      <SkillsText />
      <SkillsAnimation />
    </div>
  );
}