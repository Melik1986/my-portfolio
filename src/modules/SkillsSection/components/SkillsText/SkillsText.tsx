import { useRef, useEffect } from 'react';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
import './SkillsText.module.scss';

export function SkillsText() {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      createElementTimeline(containerRef.current);
    }
  }, []);

  return (
    <p
      ref={containerRef}
      className="skills__text"
      data-animation="text-reveal"
      data-duration="0.8"
      data-ease="power2.out"
    >
      I&nbsp;bring together a&nbsp;solid technical foundation and a&nbsp;creative design approach,
      enabling me&nbsp;to&nbsp;build modern, high-performance websites that are both functional and
      visually stunning. My&nbsp;focus is&nbsp;on&nbsp;creating seamless user experiences,
      optimizing performance, and ensuring that every project&nbsp;I work on&nbsp;meets client goals
      and user expectations. Core Skills: Frontend Development: HTML5,CSS3, JavaScript (ES6+),
      React.js Responsive Design: Adaptive layouts, mobile-first design, cross-browser compatibility
      UI/UX Design: User-centered design principles, wireframing, prototyping (Figma) Web
      Performance Optimization: Efficient code, image optimization, lazy loading Animation
      &amp;&nbsp;Interactivity: Advanced CSS animations, Three.js, 3D&nbsp;integrations. Technical
      Tools: Version Control: Git, GitHub 3D&nbsp;Design &amp;&nbsp;Animation: Blender, Spline.
      Professional Development: Successfully transitioned from a&nbsp;technical field (CNC and
      manufacturing) to&nbsp;web development, mastering new technologies through intensive courses
      and hands-on projects. Regularly participates in&nbsp;web development webinars and design
      workshops to&nbsp;stay updated with the latest trends. Languages: Armenian, Russian, Ukrainian
      ; German (B2-Beruf) , English (A2)
    </p>
  );
}
