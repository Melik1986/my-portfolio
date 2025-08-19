'use client';

import React from 'react';
import { AiContentProps } from './types/AiContent.types';
import { HorizontalMarquee, VerticalMarqueeGroup, ContentSection } from './component';
import styles from './AiContentSection.module.scss';
import { AI_CONTENT_CONSTANTS, DEFAULT_VERTICAL_COLUMNS } from './constants/AiContent.constants';

export function AiContentSection({
	horizontalTexts = AI_CONTENT_CONSTANTS.DEFAULT_HORIZONTAL_TEXTS,
	verticalColumns = DEFAULT_VERTICAL_COLUMNS,
	verticalIcons = [],
	subtitle = AI_CONTENT_CONSTANTS.DEFAULT_SUBTITLE,
	title = AI_CONTENT_CONSTANTS.DEFAULT_TITLE,
	description = AI_CONTENT_CONSTANTS.DEFAULT_DESCRIPTION,
	className = ''
}: AiContentProps) {

	return (
		<section className={`${styles['ai-content']} ${className}`} id="ai-content-section">
			<h2 className={`${styles['ai-content__title']} visually-hidden`}>{title || 'AI Content'}</h2>

			{/* Horizontal Marquee 1 */}
			<HorizontalMarquee texts={horizontalTexts} />

			{/* Horizontal Marquee 2 (обратное направление) */}
			<HorizontalMarquee texts={horizontalTexts} alternate />

			{/* Vertical Section */}
			<div className={`${styles['ai-content__container']} ${styles['ai-content__container-vertical']}`}>
				<div className={styles['ai-content__wrapper']}>
					<div className={`${styles['ai-content__horizontal']} ${styles['ai-content__horizontal-flex']}`}>
						<VerticalMarqueeGroup columns={verticalColumns.length ? verticalColumns : [verticalIcons, verticalIcons, verticalIcons]} />
					</div>
					<ContentSection subtitle={subtitle} title={title} description={description} />
				</div>
			</div>
		</section>
	);
}

export default AiContentSection;
