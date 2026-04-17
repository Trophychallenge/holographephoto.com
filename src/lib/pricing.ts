export const checkoutOffers = [
	{
		quantity: 1,
		totalAmountCents: 1499,
		label: 'Single keepsake',
		priceLabel: '$14.99',
		subtitle: 'Sale live now',
		highlight: 'Free shipping'
	},
	{
		quantity: 3,
		totalAmountCents: 3499,
		label: '3-piece bundle',
		priceLabel: '$34.99',
		subtitle: 'Best for gifts',
		highlight: 'Free shipping'
	},
	{
		quantity: 5,
		totalAmountCents: 5999,
		label: '5-piece bundle',
		priceLabel: '$59.99',
		subtitle: 'Family set',
		highlight: 'Free shipping'
	},
	{
		quantity: 10,
		totalAmountCents: 11499,
		label: '10-piece bundle',
		priceLabel: '$114.99',
		subtitle: 'Party favors',
		highlight: 'Free shipping'
	},
	{
		quantity: 15,
		totalAmountCents: 16799,
		label: '15-piece bundle',
		priceLabel: '$167.99',
		subtitle: 'Larger gift set',
		highlight: 'Free shipping'
	},
	{
		quantity: 20,
		totalAmountCents: 21999,
		label: '20-piece bundle',
		priceLabel: '$219.99',
		subtitle: 'Event order',
		highlight: 'Free shipping'
	},
	{
		quantity: 30,
		totalAmountCents: 31499,
		label: '30-piece bundle',
		priceLabel: '$314.99',
		subtitle: 'Wedding favors',
		highlight: 'Free shipping'
	},
	{
		quantity: 40,
		totalAmountCents: 39999,
		label: '40-piece bundle',
		priceLabel: '$399.99',
		subtitle: 'Large group order',
		highlight: 'Free shipping'
	}
] as const;

export const featuredCheckoutOffers = checkoutOffers.filter((offer) => offer.quantity <= 5);
export const largerCheckoutOffers = checkoutOffers.filter((offer) => offer.quantity >= 10);
export const MAX_CHECKOUT_QUANTITY = checkoutOffers[checkoutOffers.length - 1].quantity;

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
