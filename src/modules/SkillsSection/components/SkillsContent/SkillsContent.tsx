'use client';

import { SkillsText, SkillsAnimation } from '../index';
import styles from './SkillsContent.module.scss';
import { QueryFanOut } from '@/lib/ui';

function SkillsSnapshotTable() {
	return (
		<>
			<h4 className={styles['skills__heading']}>Tech &amp; Results snapshot</h4>
			<div aria-label="Skills snapshot table">
				<table>
					<thead>
						<tr>
							<th>Area</th>
							<th>Tech</th>
							<th>Outcome</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Frontend</td>
							<td>React, Next.js, TypeScript</td>
							<td>SSR/SSG, code‑splitting, fast TTI</td>
						</tr>
						<tr>
							<td>Performance</td>
							<td>Next/Image, lazy load</td>
							<td>Optimized LCP/CLS</td>
						</tr>
						<tr>
							<td>Animation</td>
							<td>GSAP, CSS</td>
							<td>Engaging micro‑interactions</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}

function SkillsQueryFanOut() {
	return (
		<QueryFanOut
			title="Explore skills in context"
			relatedQuestions={[
				'How do you approach performance budgets?',
				'When to use SSR vs. SSG in Next.js?',
				'How do animations affect UX metrics?',
			]}
			clarifications={[
				'Accessibility checks for animated content',
				'Preferred design‑to‑dev workflow in Figma',
			]}
			comparisons={[
				'GSAP vs. CSS animations',
				'CSS Modules vs. styled‑components',
			]}
		/>
	);
}

export function SkillsContent() {
	return (
		<>
			<h3
				className={styles['skills__heading']}
				data-animation="slide-left"
				data-duration="1.0"
				data-ease="power2.out"
				data-delay="0"
			>
				Skills &amp;&nbsp;Expertise
			</h3>
			<SkillsText />
			<SkillsSnapshotTable />
			<SkillsAnimation />
			<SkillsQueryFanOut />
		</>
	);
}
