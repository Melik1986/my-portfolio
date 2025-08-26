import React from 'react';

interface QueryFanOutProps {
	title?: string;
	relatedQuestions?: string[];
	clarifications?: string[];
	comparisons?: string[];
	className?: string;
}

export function QueryFanOut({
	title = 'Related questions and comparisons',
	relatedQuestions = [],
	clarifications = [],
	comparisons = [],
	className,
}: QueryFanOutProps) {
	return (
		<section className={className} aria-labelledby="qfo-heading">
			<h4 id="qfo-heading">{title}</h4>
			{relatedQuestions.length > 0 && (
				<div>
					<h5>Related questions</h5>
					<ul>
						{relatedQuestions.map((q, i) => (
							<li key={`rq-${i}`}>{q}</li>
						))}
					</ul>
				</div>
			)}
			{clarifications.length > 0 && (
				<div>
					<h5>Clarifications</h5>
					<ul>
						{clarifications.map((q, i) => (
							<li key={`cl-${i}`}>{q}</li>
						))}
					</ul>
				</div>
			)}
			{comparisons.length > 0 && (
				<div>
					<h5>Comparisons</h5>
					<ul>
						{comparisons.map((q, i) => (
							<li key={`cp-${i}`}>{q}</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}

export default QueryFanOut;