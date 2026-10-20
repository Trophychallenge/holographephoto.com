export type ProductBadge = 'Holographe Exclusive' | 'Limited Seasonal Release' | 'New';

export type ProductMedia =
	| { type: 'image'; src: string; alt: string }
	| { type: 'video'; src: string; poster?: string; alt: string };

export type HalloweenPackage = {
	id: 'single-panel' | 'mini-mural' | 'full-mural';
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
		label: 'Single 8×10',
		editionName: 'Single 8×10',
		name: 'One 8×10 magnetic panel',
		priceLabel: '$19.99',
		description: 'One 8×10 panel, ready to make your fridge or display a little more you.',
		stripeStatus: 'range-needs-variant-prices',
		variants: [
			{ id: 'single.standard', label: 'Standard', priceCents: 1999 },
			{ id: 'single.personalized', label: 'Personalized (+$5)', priceCents: 2499 }
		],
		futureOptionKeys: ['panel-number']
	},
	{
		id: 'mini-mural',
		label: 'Mini Mural',
		editionName: 'Mini Mural',
		name: 'Four 8×10 panels',
		priceLabel: '$44.99',
		description: 'Four 8×10 panels that come together as a little wall of Halloween.',
		stripeStatus: 'range-needs-variant-prices',
		variants: [
			{ id: 'mini4.standard', label: 'Standard', priceCents: 4499 },
			{ id: 'mini4.personalized', label: 'Personalized (+$5)', priceCents: 4999 }
		],
		futureOptionKeys: ['2x2-grouping']
	},
	{
		id: 'full-mural',
		label: 'Signature Mural',
		editionName: 'Signature Mural',
		name: 'Full nine-piece mural',
		priceLabel: '$99.99',
		description: 'The complete nine-piece 8×10 mural. The full scene, all together.',
		badge: 'Complete Mural',
		stripeStatus: 'exact-price-needs-stripe-price',
		variants: [
			{ id: 'full.standard', label: 'Standard', priceCents: 9999 },
			{ id: 'full.personalized', label: 'Personalized (+$5)', priceCents: 10499 }
		],
		futureOptionKeys: []
	}
];

const allPackageIds = halloweenPackages.map((productPackage) => productPackage.id);

export const halloweenDesigns: HalloweenDesign[] = [
	'Haunted Wedding',
	'Carnival Clown',
	'Midnight Matinee',
	'Halloween Lit Street',
	'Haunted Gothic Corridor',
	'Killing Time',
	'Skull Garden'
].map((name, index) => {
	const slug = [
		'haunted-wedding',
		'carnival-clown',
		'midnight-matinee',
		'halloween-lit-street',
		'haunted-gothic-corridor',
		'killing-time',
		'skull-garden'
	][index];
	return {
		id: slug,
		name,
		slug,
		active: true,
		available: true,
		productOptionIds: allPackageIds,
		badges: ['Holographe Exclusive'],
		thumbnail: {
			type: 'image',
			src: `/media/halloween/customer-designs/${slug}.webp`,
			alt: `${name} Halloween magnetic mural artwork`
		},
		previewMedia: [
			{
				type: 'image',
				src: `/media/halloween/customer-designs/${slug}.webp`,
				alt: `${name} Halloween magnetic mural artwork`
			}
		]
	};
});

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
