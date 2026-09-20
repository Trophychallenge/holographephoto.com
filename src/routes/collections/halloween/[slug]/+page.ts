import { error } from '@sveltejs/kit';
import {
	getHalloweenDesign,
	getHalloweenPackage,
	getHalloweenProduct,
	getHalloweenVariant
} from '$lib/products/halloween';

export function load({ params, url }) {
	const product = getHalloweenProduct(params.slug);

	if (!product) error(404, 'Halloween collection item not found.');

	const design = getHalloweenDesign(url.searchParams.get('design'));
	const productPackage = getHalloweenPackage(url.searchParams.get('package'));
	const variant = getHalloweenVariant(
		productPackage?.id ?? null,
		url.searchParams.get('variant') ?? productPackage?.variants[0]?.id ?? null
	);
	const requestedQuantity = Number(url.searchParams.get('quantity'));
	const quantity =
		Number.isSafeInteger(requestedQuantity) && requestedQuantity > 0 ? requestedQuantity : 1;

	return { product, design, productPackage, variant, quantity };
}
