'use client';

interface SkillsAnimationProps {
  animation?: string;
}

export function SkillsAnimation({ animation = "slide-left" }: SkillsAnimationProps) {
  return (
    <div className="skills__animation" data-animation={animation}>
      <div id="spiral1" className="spiral" />
      <div id="spiral2" className="spiral" />
    </div>
  );
}