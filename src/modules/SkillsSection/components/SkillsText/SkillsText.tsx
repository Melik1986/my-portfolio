import styles from './SkillsText.module.scss';

function SkillsTextDesktop() {
	return (
		<>
			<p className={styles['skills__text']} data-animation="text-reveal" data-duration="1.2" data-ease="power2.out" data-delay="0.2">
				<span className={styles['skills__text-desktop']}>
					I&nbsp;bring together a&nbsp;strong technical foundation and a&nbsp;creative design approach,
					building modern, high-performance websites that are both functional and visually engaging.
				</span>
				<span className={styles['skills__text-mobile']}>
					I&nbsp;combine frontend development and UI/UX design to&nbsp;create websites that are fast,
					responsive, and engaging.
				</span>
			</p>
			<p className={styles['skills__text']} data-animation="text-reveal" data-duration="1.2" data-ease="power2.out" data-delay="0.25">
				<span className={styles['skills__text-desktop']}>
					My&nbsp;focus is&nbsp;on&nbsp;seamless user experiences, performance optimization, and delivering
					projects that fully align with client goals and user expectations.
				</span>
				<span className={styles['skills__text-mobile']}>
					Skilled in&nbsp;HTML, CSS, JavaScript, React, and animations (GSAP, Three.js).
				</span>
			</p>
			<p className={styles['skills__text']} data-animation="text-reveal" data-duration="1.2" data-ease="power2.out" data-delay="0.3">
				<span className={styles['skills__text-desktop']}>
					Core Skills: Frontend (HTML5, CSS3, JavaScript, React, Next.js), Responsive Design, UI/UX,
					Performance, Animations (GSAP/Three.js), and tools like Git, GitHub, Blender, and Spline.
				</span>
				<span className={styles['skills__text-mobile']}>
					Experienced in responsive design, performance optimization, and 3D visuals with Blender &amp;&nbsp;Spline.
				</span>
			</p>
			<p className={styles['skills__text']} data-animation="text-reveal" data-duration="1.2" data-ease="power2.out" data-delay="0.35">
				<span className={styles['skills__text-desktop']}>
					Background &amp;&nbsp;Growth: transitioned from a technical career in CNC/manufacturing into web development
					and continue to upskill through webinars, workshops, and hands‑on projects.
				</span>
				<span className={styles['skills__text-mobile']}>
					Transitioned from engineering into web development and continuously upgrade skills through real projects.
				</span>
			</p>
			<p className={styles['skills__text']} data-animation="text-reveal" data-duration="1.2" data-ease="power2.out" data-delay="0.4">
				<span className={styles['skills__text-desktop']}>
					Languages: Armenian, Russian, Ukrainian; German (B2&nbsp;Beruf); English (A2).
				</span>
				<span className={styles['skills__text-mobile']}>
					Languages: Armenian, Russian, Ukrainian; German (B2&nbsp;Beruf); English (A2).
				</span>
			</p>
		</>
	);
}

function SkillsTextMobile() {
	return null;
}

export function SkillsText() {
	return <SkillsTextDesktop />;
}
