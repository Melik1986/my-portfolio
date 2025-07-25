'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import './SkillsAnimation.module.scss';

export function SkillsAnimation() {
  const { containerRef } = useGsap({});

  return (
    <div ref={containerRef} className="skills__animation" data-animation="slide-left">
      <div id="spiral1" className="spiral" />
      <div id="spiral2" className="spiral" />
    </div>
  );
}
