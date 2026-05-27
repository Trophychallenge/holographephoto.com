export type CheckoutOffer = {
	quantity: number;
	totalAmountCents: number;
	label: string;
	priceLabel: string;
	subtitle: string;
	highlight: string;
	checkoutName: string;
	checkoutDescription: string;
	primarySize: string;
	badge?: string;
};

export type PackageTier = {
	id: string;
	name: string;
	priceLabel: string;
	priceNote?: string;
	kicker: string;
	primarySize: string;
	quantityLabel: string;
	description: string;
	included: string[];
	sizeOptions: string[];
	upsells: string[];
	perceivedValue: string;
	studioFlow?: 'single-design' | 'custom-order';
	checkoutQuantity?: number;
	checkoutPrintSize?: string;
	badge?: string;
};

export type AddOn = {
	name: string;
	priceLabel: string;
	description: string;
};

export type PackagingIdea = {
	name: string;
	description: string;
};

export const checkoutOffers: CheckoutOffer[] = [
	{
		quantity: 1,
		totalAmountCents: 1999,
		label: 'The Keepsake Set',
		priceLabel: '$19.99',
		subtitle: 'A simple first order',
		highlight: 'Easy entry',
		checkoutName: 'The Keepsake Set',
		checkoutDescription: 'A simple starter order for trying Holographe with one favorite photo.',
		primarySize: '5x7',
		badge: 'Starter'
	},
	{
		quantity: 3,
		totalAmountCents: 3499,
		label: 'The Signature Set',
		priceLabel: '$34.99',
		subtitle: 'Best for gifting',
		highlight: 'Most popular',
		checkoutName: 'The Signature Set',
		checkoutDescription: 'A small set that gives you a few copies to keep, gift, or display.',
		primarySize: '8x10',
		badge: 'Most gifted'
	},
	{
		quantity: 5,
		totalAmountCents: 5999,
		label: 'The Heirloom Collection',
		priceLabel: '$59.99',
		subtitle: 'Best value',
		highlight: 'Family set',
		checkoutName: 'The Heirloom Collection',
		checkoutDescription:
			'A fuller set for family gifting, multiple rooms, or a more complete keepsake collection.',
		primarySize: '8x10',
		badge: 'Best value'
	},
	{
		quantity: 10,
		totalAmountCents: 11499,
		label: 'Creator & Brand Suite',
		priceLabel: '$114.99',
		subtitle: 'For events and brand use',
		highlight: 'Bulk order',
		checkoutName: 'Creator & Brand Suite',
		checkoutDescription:
			'A larger run for creators, boutiques, launches, events, and premium gifting.',
		primarySize: 'Mixed sizes',
		badge: 'Business'
	},
	{
		quantity: 15,
		totalAmountCents: 16799,
		label: 'Fridge Gallery Pack',
		priceLabel: '$167.99',
		subtitle: 'Expanded display set',
		highlight: 'Gallery-ready',
		checkoutName: 'Fridge Gallery Pack',
		checkoutDescription:
			'Expanded multi-piece set for home displays, family gifting, or larger magnetic collections.',
		primarySize: 'Mixed sizes'
	},
	{
		quantity: 20,
		totalAmountCents: 21999,
		label: 'Boutique Event Set',
		priceLabel: '$219.99',
		subtitle: 'For milestone tables and events',
		highlight: 'Occasion-ready',
		checkoutName: 'Boutique Event Set',
		checkoutDescription:
			'Premium multi-piece holographic order sized for event gifting, keepsake tables, or boutique moments.',
		primarySize: 'Mixed sizes'
	},
	{
		quantity: 30,
		totalAmountCents: 31499,
		label: 'Wedding Welcome Set',
		priceLabel: '$314.99',
		subtitle: 'For intimate wedding gifting',
		highlight: 'Wedding-ready',
		checkoutName: 'Wedding Welcome Set',
		checkoutDescription:
			'Premium holographic gifting set designed for wedding parties, memory tables, and guest keepsakes.',
		primarySize: 'Mixed sizes'
	},
	{
		quantity: 40,
		totalAmountCents: 39999,
		label: 'Full Event Suite',
		priceLabel: '$399.99',
		subtitle: 'Larger premium event runs',
		highlight: 'Large event',
		checkoutName: 'Full Event Suite',
		checkoutDescription:
			'Large-format premium event run for branded gifting, wedding weekends, or boutique-scale orders.',
		primarySize: 'Mixed sizes'
	}
];

export const featuredCheckoutOffers = checkoutOffers.filter((offer) => offer.quantity <= 5);
export const largerCheckoutOffers = checkoutOffers.filter((offer) => offer.quantity >= 10);
export const MAX_CHECKOUT_QUANTITY = checkoutOffers[checkoutOffers.length - 1].quantity;

export const packageTiers: PackageTier[] = [
	{
		id: 'starter',
		name: 'The Keepsake Set',
		priceLabel: '$19.99',
		kicker: 'Starter package',
		primarySize: 'Single keepsake',
		quantityLabel: '1 holograph',
		description:
			'A simple first order if you want to try one and see it in person before buying more.',
		included: [
			'1 custom holograph',
			'Rounded corners included',
			'Live preview before checkout',
			'Free shipping'
		],
		sizeOptions: ['5x7', '8x10'],
		upsells: ['Extra copies', 'Short custom overlay', 'Gift-ready wrap'],
		perceivedValue: '$25–$35',
		studioFlow: 'single-design',
		checkoutQuantity: 1,
		checkoutPrintSize: '8x10'
	},
	{
		id: 'signature',
		name: 'The Signature Set',
		priceLabel: '$34.99',
		kicker: 'Signature package',
		primarySize: 'Small gift set',
		quantityLabel: '3 holographs',
		description: 'A better deal if you want one to keep and a couple more to gift or share.',
		included: [
			'3 custom holographs',
			'Rounded corners included',
			'Live preview before checkout',
			'Free shipping'
		],
		sizeOptions: ['5x7', '8x10'],
		upsells: ['Extra copies', 'Rush shipping', 'Gift-ready wrap'],
		perceivedValue: '$45–$60',
		studioFlow: 'single-design',
		checkoutQuantity: 3,
		checkoutPrintSize: '8x10',
		badge: 'Most popular'
	},
	{
		id: 'deluxe',
		name: 'The Heirloom Collection',
		priceLabel: '$59.99',
		kicker: 'Deluxe package',
		primarySize: 'Family set',
		quantityLabel: '5 holographs',
		description:
			'The best value if you want enough for family, a fridge gallery, or a fuller gift set.',
		included: [
			'5 custom holographs',
			'Rounded corners included',
			'Live preview before checkout',
			'Free shipping'
		],
		sizeOptions: ['5x7', '8x10'],
		upsells: ['Extra copies', 'Rush shipping', 'Custom note'],
		perceivedValue: '$75–$95',
		studioFlow: 'single-design',
		checkoutQuantity: 5,
		checkoutPrintSize: '8x10',
		badge: 'Best value'
	},
	{
		id: 'business',
		name: 'Creator & Brand Suite',
		priceLabel: '$114.99',
		kicker: 'Business / brand package',
		primarySize: 'Bulk order',
		quantityLabel: '10 holographs',
		description:
			'For events, creator kits, boutique gifting, or larger orders that need a cleaner per-piece price.',
		included: [
			'10 custom holographs',
			'Best for one design in a larger run',
			'Live preview before checkout',
			'Free shipping'
		],
		sizeOptions: ['5x7', '8x10', 'Mixed sizes'],
		upsells: ['Rush production', 'Extra units', 'Branded insert card'],
		perceivedValue: '$145–$180',
		studioFlow: 'single-design',
		checkoutQuantity: 10,
		checkoutPrintSize: 'Mixed sizes'
	},
	{
		id: 'large-format',
		name: 'Statement Commission',
		priceLabel: 'From $225',
		priceNote: 'Custom large format option',
		kicker: 'Custom large format',
		primarySize: '11x14, 16x20, or custom',
		quantityLabel: 'Boutique-scale statement display',
		description:
			'For memorial tables, boutique displays, wedding installations, and truly oversized emotional keepsakes.',
		included: [
			'Custom sizing consultation',
			'Enhanced proofing',
			'Overlay placement support',
			'Boutique presentation packaging'
		],
		sizeOptions: ['11x14', '16x20', 'Custom'],
		upsells: ['Display easel', 'Duplicate commission', 'Hand-finished inscription'],
		perceivedValue: '$375–$500+'
	}
];

export const addOns: AddOn[] = [
	{
		name: 'Extra copies',
		priceLabel: 'Ask at checkout',
		description: 'Add matching pieces for family gifting or extra display copies.'
	},
	{
		name: 'Rush shipping',
		priceLabel: '$18',
		description: 'Move your order faster when timing matters.'
	},
	{
		name: 'Custom overlay',
		priceLabel: '$14',
		description: 'Add a short name, date, phrase, or personal detail.'
	},
	{
		name: 'Gift-ready wrap',
		priceLabel: '$8',
		description: 'Make it feel more giftable without changing the order process.'
	},
	{
		name: 'Larger custom orders',
		priceLabel: 'Custom quote',
		description: 'For weddings, events, boutiques, memorial tables, and bigger family sets.'
	}
];

export const packagingIdeas: PackagingIdea[] = [
	{
		name: 'Moonlight Box',
		description: 'A matte ivory rigid box with pale gold foil details and a vellum wrap band.'
	},
	{
		name: 'Afterglow Sleeve',
		description: 'A translucent sleeve with a soft emotional line and elegant care instructions.'
	},
	{
		name: 'Remembrance Wrap',
		description: 'A warmer neutral presentation finish designed for sympathy and memorial orders.'
	},
	{
		name: 'Studio Mailer',
		description:
			'A premium black mailer with an iridescent seal for creators, boutiques, and launches.'
	}
];

export const insertIdeas: PackagingIdea[] = [
	{
		name: 'QR keepsake card',
		description: 'Link to reorder matching copies, care tips, or a boutique review page.'
	},
	{
		name: 'Thank-you note',
		description:
			'Thank you for trusting us with something personal. We hope it keeps shining for you.'
	},
	{
		name: 'Gift message card',
		description:
			'A short printed note that makes the piece feel ready to give the moment it arrives.'
	},
	{
		name: 'Seasonal edition insert',
		description:
			'Mother’s Day, memorial, wedding, and holiday messaging variants for elevated gifting.'
	}
];

export function getCheckoutOffer(quantity: number) {
	return checkoutOffers.find((offer) => offer.quantity === quantity) ?? null;
}

export function parseCheckoutQuantity(value: FormDataEntryValue | null) {
	if (typeof value !== 'string') return null;

	const quantity = Number.parseInt(value, 10);
	if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CHECKOUT_QUANTITY) {
		return null;
	}

	return quantity;
}
