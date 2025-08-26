import React from 'react';

interface JsonLdProps<T = unknown> {
	id?: string;
	item: T;
	defer?: boolean;
}

export function JsonLd<T>({ id, item, defer = false }: JsonLdProps<T>) {
	return (
		<script
			id={id}
			type="application/ld+json"
			defer={defer ? true : undefined}
			dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
		/>
	);
}

export default JsonLd;