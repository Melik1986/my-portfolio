'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import { useSkillsCharts } from '../../hooks/useSkillsCharts';
import './SkillsCharts.module.scss';

export function SkillsCharts() {
  const { containerRef } = useGsap({});
  const { playAnimation, hideCharts, resetAnimation } = useSkillsCharts();

  // Пример интеграции: запуск анимации при монтировании
  // Вы можете интегрировать с GSAP или другими хуками по необходимости

  return (
    <div ref={containerRef} className="skills__charts" data-animation="slide-right">
      <div className="skills-charts__container">
        <div className="chart-wrapper" id="dev-skills-chart-wrapper">
          <div id="dev-skills-chart" />
        </div>
        <div className="chart-wrapper" id="design-skills-chart-wrapper">
          <div id="design-skills-chart" />
        </div>
      </div>
    </div>
  );
}
