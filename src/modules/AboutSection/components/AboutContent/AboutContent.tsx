'use client';

import { lazy, Suspense } from 'react';
import styles from './AboutContent.module.scss';
import { QueryFanOut } from '@/lib/ui';

// Ленивый импорт тяжёлой анимации
const AboutAnimationLazy = lazy(() =>
	import('../AboutAnimation/AboutAnimation').then((mod) => ({
		default: mod.AboutAnimation,
	})),
);

/**
 * Содержимое текста "Обо мне"
 * Содержит основной текст описания разработчика
 */
function AboutTextDesktop() {
	return (
		<div className={styles['about__text-desktop']}>
			<h4 className={styles['about__heading']}>Who I am</h4>
			<p className={styles['about__text']}>
				Hi, I&rsquo;m Melik&nbsp;&mdash; a&nbsp;results‑driven frontend developer and UI/UX designer
				with a strong focus on creating modern, high‑performance websites.
			</p>
			<h4 className={styles['about__heading']}>Approach</h4>
			<p className={styles['about__text']}>
				I combine technical expertise with a design‑driven mindset, delivering clean, intuitive
				interfaces that engage users and achieve business goals.
			</p>
			<p className={styles['about__text']} data-nosnippet>
				Every project balances performance, accessibility, and brand expression to drive measurable
				impact while keeping the experience elegant and maintainable.
			</p>
			<h4 className={styles['about__heading']}>Background</h4>
			<p className={styles['about__text']}>
				After moving to Germany, I transitioned from a technical career in manufacturing into web
				development, mastering modern frontend through intensive learning and real‑world projects.
			</p>
		</div>
	);
}

function AboutTextMobile() {
	return (
		<div className={styles['about__text-mobile']}>
			<h4 className={styles['about__heading']}>Who I am</h4>
			<p className={styles['about__text']}>
				I&rsquo;m Melik&nbsp;&mdash; a frontend developer and UI/UX designer building modern, fast websites.
			</p>
			<h4 className={styles['about__heading']}>Approach</h4>
			<p className={styles['about__text']}>
				I blend clean code with thoughtful design to create engaging, accessible interfaces.
			</p>
			<p className={styles['about__text']} data-nosnippet>
				I focus on real user needs, performance, and maintainability in every project.
			</p>
			<h4 className={styles['about__heading']}>Background</h4>
			<p className={styles['about__text']}>
				Transitioned to web development in Germany, learning by building real projects.
			</p>
		</div>
	);
}

function AboutAnimationBlock() {
	return (
		<div
			className={styles['about__animation']}
			data-animation="fade-up"
			data-duration="0.8"
			data-ease="power2.out"
			data-delay="0.6"
		>
			<Suspense fallback={<div className={styles['about__animation-placeholder']} />}>
				<AboutAnimationLazy />
			</Suspense>
		</div>
	);
}

function AboutQFO() {
	return (
		<QueryFanOut
			title="Related questions about my background"
			relatedQuestions={[
				'How does design thinking influence implementation?',
				'Which performance metrics do you prioritize?',
				'What is your accessibility checklist?',
			]}
			clarifications={[
				'Preferred tech stack for different project sizes',
				'How timelines change for animations and 3D',
			]}
			comparisons={[
				'SSR vs. SSG in Next.js portfolios',
				'GSAP vs. CSS animations for micro‑interactions',
			]}
		/>
	);
}

/**
 * Основной контент секции "Обо мне"
 * Композирует заголовок, текст и Aurora анимацию
 */
export function AboutContent() {
	return (
		<>
			<h3
				className={styles['about__heading']}
				data-animation="slide-left"
				data-duration="1.0"
				data-ease="power2.out"
				data-delay="0"
			>
				About Me
			</h3>
			<div
				data-animation="text-reveal"
				data-duration="1.2"
				data-ease="power2.out"
				data-delay="0.5"
			>
				<AboutTextDesktop />
				<AboutTextMobile />
			</div>
			<AboutAnimationBlock />
			<AboutQFO />
		</>
	);
}
