export type ProductBadge = 'Holographe Exclusive' | 'Limited Seasonal Release' | 'New';

export type ProductMedia =
	| { type: 'image'; src: string; alt: string }
	| { type: 'video'; src: string; poster?: string; alt: string };

export type HalloweenPackage = {
	id: 'single-panel' | 'mini-mural' | 'full-mural' | 'custom-mural';
	label: string;
	editionName: string;
	name: string;
	priceLabel: string;
	description: string;
	badge?: string;
	stripeStatus: 'range-needs-variant-prices' | 'exact-price-needs-stripe-price';
	variants: HalloweenPackageVariant[];
	futureOptionKeys: string[];
};

export type HalloweenPackageVariant = {
	id: string;
	priceCents: number;
	label?: string;
	stripePriceId?: string;
};

export type HalloweenDesign = {
	id: string;
	name: string;
	slug: string;
	thumbnail?: ProductMedia;
	previewMedia?: ProductMedia[];
	active: boolean;
	available: boolean;
	productOptionIds: HalloweenPackage['id'][];
	badges?: ProductBadge[];
	placeholderLabel?: string;
};

export type CatalogProduct = {
	id: string;
	slug: string;
	title: string;
	description: string;
	badges: ProductBadge[];
	media: ProductMedia[];
};

export const halloweenCollectionReferenceMedia: ProductMedia = {
	type: 'image',
	src: '/media/halloween/Halloween Mural Mix and Match.png',
	alt: 'Holographe Halloween Magnet Murals collection reference showing all six available designs'
};

export const halloweenPackages: HalloweenPackage[] = [
	{
		id: 'single-panel',
		label: 'Single Panel',
		editionName: 'The Statement',
		name: 'Single 8×10 Halloween panel',
		priceLabel: '$14.99',
		description: 'One statement panel.',
		stripeStatus: 'range-needs-variant-prices',
		variants: [
			{ id: 'single.standard', label: 'Standard', priceCents: 1499 },
			{ id: 'single.personalized', label: 'Personalized — request a quote', priceCents: 0 }
		],
		futureOptionKeys: ['panel-number']
	},
	{
		id: 'mini-mural',
		label: 'Three-Panel Set',
		editionName: 'The Three-Panel Set',
		name: '3-panel Halloween set',
		priceLabel: '$29.99',
		description: 'Three coordinating panels for an instant seasonal display.',
		stripeStatus: 'range-needs-variant-prices',
		variants: [
			{ id: 'mini4.standard', label: 'Standard', priceCents: 2999 },
			{ id: 'mini4.personalized', label: 'Personalized — request a quote', priceCents: 0 }
		],
		futureOptionKeys: ['2x2-grouping']
	},
	{
		id: 'full-mural',
		label: 'Full Mural',
		editionName: 'The Full Installation',
		name: 'Full 9-panel mural',
		priceLabel: '$59.99',
		description: 'The complete nine-piece mural.',
		badge: 'Complete Mural',
		stripeStatus: 'exact-price-needs-stripe-price',
		variants: [{ id: 'full.standard', label: 'Standard', priceCents: 5999 }],
		futureOptionKeys: []
	},
	{
		id: 'custom-mural',
		label: 'Custom',
		editionName: 'The Bespoke Edition',
		name: 'Personalized/custom 9-panel mural',
		priceLabel: 'Request a quote',
		description: 'A personalized mural request, prepared around your direction.',
		stripeStatus: 'range-needs-variant-prices',
		variants: [
			{ id: 'custom.personalized', label: 'Personalized — request a quote', priceCents: 0 },
			{ id: 'custom.full', label: 'Fully custom — request a quote', priceCents: 0 }
		],
		futureOptionKeys: ['personalization-details', 'custom-upload']
	}
];

const allPackageIds = halloweenPackages.map((productPackage) => productPackage.id);

export const halloweenDesigns: HalloweenDesign[] = [
	'Haunted Hospital',
	'Pumpkin Patch Massacre',
	'Ghostly Graveyard',
	'Creepy Carnival',
	'Witches Brew',
	'Scream Season'
].map((name) => ({
	id: name.toLowerCase().replaceAll(' ', '-'),
	name,
	slug: name.toLowerCase().replaceAll(' ', '-'),
	active: true,
	available: true,
	productOptionIds: allPackageIds,
	badges: ['Holographe Exclusive'],
	placeholderLabel: 'Artwork preview not available yet',
	thumbnail:
		name === 'Creepy Carnival'
			? { type: 'image', src: '/media/halloween/creepy-carnival.jpg', alt: 'Creepy Carnival Halloween mural artwork' }
			: undefined
}));

export const halloweenProducts: CatalogProduct[] = [
	{
		id: 'halloween-seasonal-release',
		slug: 'seasonal-release',
		title: 'Halloween magnetic decor',
		description:
			'Designed in-house to transform an everyday surface into statement Halloween decor.',
		badges: ['Holographe Exclusive', 'Limited Seasonal Release'],
		media: [
			{
				type: 'video',
				src: '/media/halloween/HalloweenDishwashermagnets.mp4',
				alt: 'Holographe Halloween magnetic decor displayed on a dishwasher'
			}
		]
	}
];

export function getHalloweenProduct(slug: string) {
	return halloweenProducts.find((product) => product.slug === slug);
}

export function getHalloweenDesign(slug: string | null) {
	return halloweenDesigns.find(
		(design) => design.slug === slug && design.active && design.available
	);
}

export function getHalloweenPackage(id: string | null) {
	return halloweenPackages.find((productPackage) => productPackage.id === id);
}

export function getHalloweenVariant(packageId: string | null, variantId: string | null) {
	const productPackage = getHalloweenPackage(packageId);
	return productPackage?.variants.find((variant) => variant.id === variantId);
}

export function getHalloweenVariantSku(designSlug: string, variantId: string) {
	return `halloween:${designSlug}:${variantId}`;
}
