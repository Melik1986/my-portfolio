'use client';

export function SkillsCharts() {
  return (
    <div className="skills__content skills__content--right">
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