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
		label: 'One 8×10 Magnet',
		priceLabel: '$19.99',
		subtitle: 'A simple first order',
		highlight: 'Easy entry',
		checkoutName: 'One 8×10 Holographe',
		checkoutDescription: 'One custom 8×10 holographic photo magnet, made from your favorite photo.',
		primarySize: '8x10',
		badge: 'Starter'
	},
	{
		quantity: 4,
		totalAmountCents: 4499,
		label: 'The Mini Mural',
		priceLabel: '$44.99',
		subtitle: 'Four-piece set',
		highlight: 'Four panels',
		checkoutName: 'The Mini Mural',
		checkoutDescription: 'Four 8×10 holographic photo magnets, made from your chosen photo.',
		primarySize: '8x10'
	},
	{
		quantity: 9,
		totalAmountCents: 9999,
		label: 'The Signature Mural',
		priceLabel: '$99.99',
		subtitle: 'Nine-piece mural',
		highlight: 'Full mural',
		checkoutName: 'The Signature Mural',
		checkoutDescription: 'Nine 8×10 holographic photo magnets, arranged as one complete mural.',
		primarySize: '8x10'
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
		name: 'One 8×10 Magnet',
		priceLabel: '$19.99',
		kicker: 'Starter package',
		primarySize: '8×10',
		quantityLabel: '1 holographic photo magnet',
		description: 'One 8×10 holographic photo magnet, made with your favorite photo.',
		included: ['1 custom 8×10 magnet', 'Upload one photo in the customizer'],
		sizeOptions: ['8x10'],
		upsells: ['Ask about personalization or presentation options'],
		studioFlow: 'single-design',
		checkoutQuantity: 1,
		checkoutPrintSize: '8x10'
	},
	{
		id: 'signature',
		name: 'The Mini Mural',
		priceLabel: '$44.99',
		kicker: 'Signature package',
		primarySize: 'Four 8×10 panels',
		quantityLabel: '4 holographic photo magnets',
		description:
			'Four matching 8×10 panels for a little more room to show off your favorite photo.',
		included: ['4 custom 8×10 magnets', 'Upload one photo in the customizer'],
		sizeOptions: ['8x10'],
		upsells: ['Ask about personalization or presentation options'],
		studioFlow: 'single-design',
		checkoutQuantity: 4,
		checkoutPrintSize: '8x10'
	},
	{
		id: 'deluxe',
		name: 'The Signature Mural',
		priceLabel: '$99.99',
		kicker: 'Deluxe package',
		primarySize: 'Nine 8×10 panels',
		quantityLabel: '9 holographic photo magnets',
		description: 'The full nine-piece 8×10 mural, made from one favorite photo.',
		included: ['9 custom 8×10 magnets', 'Upload one photo in the customizer'],
		sizeOptions: ['8x10'],
		upsells: ['Ask about personalization or presentation options'],
		studioFlow: 'single-design',
		checkoutQuantity: 9,
		checkoutPrintSize: '8x10'
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
			'One saved photo for the set',
			'Choose an available size in the customizer'
		],
		sizeOptions: ['5x7', '8x10', 'Mixed sizes'],
		upsells: ['Ask about brand or event customization'],
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
		included: ['Sizing and production details confirmed before purchase', 'Custom quote required'],
		sizeOptions: ['11x14', '16x20', 'Custom'],
		upsells: ['Discuss options in a custom quote']
	}
];

export const addOns: AddOn[] = [
	{
		name: 'Additional copies',
		priceLabel: 'Quote required',
		description: 'Not sold as an online add-on. Ask before checkout for availability and pricing.'
	},
	{
		name: 'Timing requests',
		priceLabel: 'Quote required',
		description: 'Contact Holographe to confirm whether a timing request can be accommodated.'
	},
	{
		name: 'Custom personalization',
		priceLabel: 'Included tools or quote required',
		description:
			'Use the customizer for a photo, overlay, and note. Ask for anything beyond those tools.'
	},
	{
		name: 'Presentation options',
		priceLabel: 'Quote required',
		description: 'Not currently available as an online purchase. Ask for a custom quote.'
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
