import styles from './SkillsText.module.scss';

function SkillsTextDesktop() {
  return (
    <span className={styles['skills__text-desktop']}>
      I&nbsp;bring together a&nbsp;strong technical foundation and a&nbsp;creative design approach,
      building modern, high-performance websites that are both functional and visually engaging.
      My&nbsp;focus is&nbsp;on&nbsp;seamless user experiences, performance optimization, and
      delivering projects that fully align with client goals and user expectations. Core Skills
      &bull; Frontend Development: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, &bull;
      Responsive Design: adaptive layouts, mobile-first, cross-browser compatibility &bull; UI/UX
      Design: user-centered design, wireframing, prototyping (Figma) &bull; Performance: efficient
      code, image optimization, lazy loading &bull; Animation &amp;&nbsp;Interactivity: advanced CSS
      animations, GSAP, Three.js, 3D&nbsp;integrations &bull; Tools: Git, GitHub, Blender, Spline
      Background &amp;&nbsp;Growth Transitioned from a&nbsp;technical career
      in&nbsp;CNC/manufacturing into web development, mastering new technologies through intensive
      courses and real-world projects. I&nbsp;stay up&nbsp;to&nbsp;date through webinars, workshops,
      and continuous learning. Languages: Armenian, Russian, Ukrainian; German (B2&nbsp;Beruf),
      English (A2)
    </span>
  );
}

function SkillsTextMobile() {
  return (
    <span className={styles['skills__text-mobile']}>
      I&nbsp;combine frontend development and UI/UX design to&nbsp;create websites that are fast,
      responsive, and engaging. Skilled in&nbsp;HTML, CSS, JavaScript, React, and animations (GSAP,
      Three.js). Experienced in&nbsp;responsive design, performance optimization, and
      3D&nbsp;visuals with Blender &amp;&nbsp;Spline. Transitioned from engineering to&nbsp;web
      development, continuously upgrading my&nbsp;skills through courses and real projects.
    </span>
  );
}

export function SkillsText() {
  return (
    <p
      className={styles.skills__text}
      data-animation="text-reveal"
      data-duration="1.2"
      data-ease="power2.out"
      data-delay="0.2"
    >
      <SkillsTextDesktop />
      <SkillsTextMobile />
    </p>
  );
}
