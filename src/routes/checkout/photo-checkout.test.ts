import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkoutOffers } from '$lib/pricing';
import { POST } from './+server';

vi.mock('$env/dynamic/private', () => ({ env: process.env }));

function photoPayload(quantity: number) {
	const form = new FormData();
	form.set('quantity', String(quantity));
	form.set('base_blob_url', 'https://example.public.blob.vercel-storage.com/photo.jpg');
	form.set('base_blob_pathname', 'orders/base/photo.jpg');
	form.set('overlay_blob_url', 'https://example.public.blob.vercel-storage.com/overlay.png');
	form.set('overlay_blob_pathname', 'orders/overlay/overlay.png');
	form.set('print_size', '8x10');
	form.set('personal_request', 'A gift for Mom');
	form.set('overlay_position', '66,78,42,-6');
	return form;
}

async function checkout(form: FormData, fetch: ReturnType<typeof vi.fn>) {
	return POST({
		request: new Request('https://holographephoto.com/checkout', {
			method: 'POST',
			headers: { 'x-holograph-ajax': '1' },
			body: form
		}),
		url: new URL('https://holographephoto.com/checkout'),
		fetch
	} as unknown as Parameters<typeof POST>[0]);
}

describe('photo orders keep the existing Stripe contract', () => {
	beforeEach(() => {
		process.env.STRIPE_SECRET_KEY = 'sk_test_unit';
	});

	it.each(checkoutOffers)(
		'uses the server price for $label and retains saved artwork',
		async (offer) => {
			const fetch = vi
				.fn()
				.mockResolvedValue(
					new Response(
						JSON.stringify({
							id: 'cs_test_photo',
							url: 'https://checkout.stripe.com/c/pay/cs_test_photo'
						})
					)
				);
			const form = photoPayload(offer.quantity);
			form.set('price', '1');
			const response = await checkout(form, fetch);
			expect(response.status).toBe(200);
			expect(await response.json()).toEqual({
				url: 'https://checkout.stripe.com/c/pay/cs_test_photo'
			});
			expect(fetch.mock.calls[0][0]).toBe('https://api.stripe.com/v1/checkout/sessions');
			const params = fetch.mock.calls[0][1].body as URLSearchParams;
			expect(params.get('line_items[0][price_data][unit_amount]')).toBe(
				String(offer.totalAmountCents)
			);
			expect(params.get('line_items[0][quantity]')).toBe('1');
			expect(params.get('metadata[quantity]')).toBe(String(offer.quantity));
			expect(params.get('metadata[base_blob_pathname]')).toBe('orders/base/photo.jpg');
			expect(params.get('metadata[overlay_blob_pathname]')).toBe('orders/overlay/overlay.png');
			expect(params.get('metadata[overlay_position]')).toBe('66,78,42,-6');
			expect(params.get('metadata[print_size]')).toBe('8x10');
			expect(params.get('metadata[personal_request]')).toBe('A gift for Mom');
			expect(params.get('shipping_address_collection[allowed_countries][0]')).toBe('US');
			expect(params.get('allow_promotion_codes')).toBe('true');
			expect(params.get('success_url')).toBe(
				'https://holographephoto.com/checkout/success?session_id={CHECKOUT_SESSION_ID}'
			);
			expect(params.get('cancel_url')).toBe('https://holographephoto.com/checkout/cancel');
		}
	);

	it('rejects an unsaved photo without creating a payment session', async () => {
		const fetch = vi.fn();
		const form = photoPayload(1);
		form.delete('base_blob_pathname');
		const response = await checkout(form, fetch);
		expect(response.status).toBe(400);
		expect(fetch).not.toHaveBeenCalled();
	});

	it('returns an error for the shopper when Stripe rejects a session', async () => {
		const fetch = vi.fn().mockResolvedValue(new Response('Session unavailable', { status: 503 }));
		const response = await checkout(photoPayload(1), fetch);
		expect(response.status).toBe(503);
		expect(await response.json()).toHaveProperty('error');
	});
});
