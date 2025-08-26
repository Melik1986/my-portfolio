import React from 'react';
import styles from './ContactSection.module.scss';
import { ContactForm } from './components/ContactForm';
import { JsonLd } from '@/lib/ui';

function ContactFaq() {
	return (
		<section aria-labelledby="contact-faq-heading">
			<h3 id="contact-faq-heading">FAQ</h3>
			<dl>
				<dt>How quickly do you reply?</dt>
				<dd>Within 1–2 business days.</dd>
				<dt>Which languages can we communicate in?</dt>
				<dd>Armenian, Russian, Ukrainian, German (B2 Beruf), English (A2).</dd>
				<dt>What project sizes do you take?</dt>
				<dd>From small landing pages to multi‑page apps with animations.</dd>
			</dl>
		</section>
	);
}

function ContactHowTo() {
	return (
		<section aria-labelledby="howto-contact-heading">
			<h3 id="howto-contact-heading">How to request a project quote</h3>
			<ol>
				<li>Describe your goals, audience, and timeline.</li>
				<li>Share existing brand assets or references.</li>
				<li>List key pages/flows and technical constraints.</li>
				<li>Provide success metrics (e.g., LCP, conversion, accessibility).</li>
			</ol>
		</section>
	);
}

function ContactJsonLd() {
	return (
		<>
			<JsonLd
				id="jsonld-faq"
				item={{
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: [
						{
							'@type': 'Question',
							name: 'How quickly do you reply?',
							acceptedAnswer: { '@type': 'Answer', text: 'Within 1–2 business days.' },
						},
						{
							'@type': 'Question',
							name: 'Which languages can we communicate in?',
							acceptedAnswer: {
								'@type': 'Answer',
								text: 'Armenian, Russian, Ukrainian, German (B2 Beruf), English (A2).',
							},
						},
						{
							'@type': 'Question',
							name: 'What project sizes do you take?',
							acceptedAnswer: {
								'@type': 'Answer',
								text: 'From small landing pages to multi‑page apps with animations.',
							},
						},
					],
				}}
			/>
			<JsonLd
				id="jsonld-howto"
				item={{
					'@context': 'https://schema.org',
					'@type': 'HowTo',
					summary: 'How to request a project quote',
					step: [
						{ '@type': 'HowToStep', text: 'Describe goals, audience, and timeline.' },
						{ '@type': 'HowToStep', text: 'Share existing brand assets or references.' },
						{ '@type': 'HowToStep', text: 'List key pages/flows and technical constraints.' },
						{ '@type': 'HowToStep', text: 'Provide success metrics (LCP, conversion, accessibility).' },
					],
				}}
			/>
		</>
	);
}

export function ContactSection() {
	return (
		<section
			id="contact-section"
			className={styles.contact}
			data-section-index="7"
			data-group-delay="2.5"
		>
			<h2 className="visually-hidden">Contact</h2>
			<div
				className={styles.contact__container}
				data-animation="fade-up"
				data-duration="1.0"
				data-stagger="0.15"
				data-ease="power2.out"
				data-delay="0"
			>
				<ContactForm />
			</div>
			<ContactFaq />
			<ContactHowTo />
			<ContactJsonLd />
		</section>
	);
}
