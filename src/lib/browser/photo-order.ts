import { checkoutOffers } from '$lib/pricing';

export const photoDraftKey = 'holographe-photo-order-v1';
export const printSizes = ['5x7', '8x10', 'Mixed sizes'] as const;

export function photoOrderSelection(params: URLSearchParams) {
	const offer = checkoutOffers.find((item) => String(item.quantity) === params.get('package'));
	const requestedSize = params.get('size');
	return {
		quantity: offer ? String(offer.quantity) : undefined,
		size: printSizes.find((size) => size === requestedSize)
	};
}

export async function submitPhotoOrder(form: HTMLFormElement, request = fetch) {
	const response = await request('/checkout', {
		method: 'POST',
		headers: { 'x-holograph-ajax': '1', accept: 'application/json' },
		body: new FormData(form)
	});
	const result = (await response.json()) as { url?: string; error?: string };
	if (!response.ok || !result.url) {
		throw new Error(
			result.error || 'Checkout is unavailable. Your design is still here; please try again.'
		);
	}
	const url = new URL(result.url);
	if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') {
		throw new Error('Secure checkout could not be opened. Please try again.');
	}
	return url.href;
}
