import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './+server';

vi.mock('$env/dynamic/private', () => ({ env: process.env }));

function cartPayload(items: unknown[], acknowledged = false) {
	const form = new FormData();
	form.set('product', 'halloween-cart');
	form.set('cart_json', JSON.stringify(items));
	if (acknowledged) form.set('decal_use_ack', 'yes');
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

describe('Halloween decal checkout acknowledgment', () => {
	beforeEach(() => {
		process.env.STRIPE_SECRET_KEY = 'sk_test_unit';
	});

	it('rejects decal carts until the shopper acknowledges indoor-only use', async () => {
		const fetch = vi.fn();
		const response = await checkout(
			cartPayload([
				{
					kind: 'decal',
					designSlug: 'haunted-wedding',
					decalSize: '6-inch',
					personalized: false,
					quantity: 1
				}
			]),
			fetch
		);

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ error: expect.stringContaining('indoor-only') });
		expect(fetch).not.toHaveBeenCalled();
	});

	it('creates a Stripe session after acknowledgment and uses the server-side decal price', async () => {
		const fetch = vi
			.fn()
			.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: 'cs_test_decal',
						url: 'https://checkout.stripe.com/c/pay/cs_test_decal'
					})
				)
			);
		const response = await checkout(
			cartPayload(
				[
					{
						kind: 'decal',
						designSlug: 'haunted-wedding',
						decalSize: '6-inch',
						personalized: false,
						quantity: 1
					}
				],
				true
			),
			fetch
		);

		expect(response.status).toBe(200);
		const params = fetch.mock.calls[0][1].body as URLSearchParams;
		expect(params.get('line_items[0][price_data][unit_amount]')).toBe('1499');
	});

	it('does not require the decal acknowledgment for mural-only carts', async () => {
		const fetch = vi
			.fn()
			.mockResolvedValue(
				new Response(
					JSON.stringify({
						id: 'cs_test_mural',
						url: 'https://checkout.stripe.com/c/pay/cs_test_mural'
					})
				)
			);
		const response = await checkout(
			cartPayload([
				{
					kind: 'mural',
					designSlug: 'haunted-wedding',
					packageId: 'single-panel',
					variantId: 'single.standard',
					quantity: 1
				}
			]),
			fetch
		);

		expect(response.status).toBe(200);
		expect(fetch).toHaveBeenCalledOnce();
	});
});
