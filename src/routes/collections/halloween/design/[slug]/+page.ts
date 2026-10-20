import { error } from '@sveltejs/kit';
import { getHalloweenDesign } from '$lib/products/halloween';

export function load({ params, url }) {
	const design = getHalloweenDesign(params.slug);
	if (!design) error(404, 'Halloween design not found.');
	return { design, initialType: url.searchParams.get('type') === 'decal' ? 'decal' : 'mural' };
}
