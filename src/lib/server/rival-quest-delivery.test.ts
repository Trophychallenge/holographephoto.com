import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rivalQuestProduct } from '$lib/products/rival-quest';
import {
	fetchRivalQuestDownload,
	verifyRivalQuestCheckoutSession,
	verifyRivalQuestCheckoutSessionRecord
} from './rival-quest-delivery';
import type { StripeCheckoutSession } from './stripe';

vi.mock('$env/dynamic/private', () => ({
	env: process.env
}));

const paidSession = {
	id: 'cs_test_rivalquest',
	object: 'checkout.session',
	amount_total: 999,
	currency: 'usd',
	customer_details: {
		email: 'customer@example.com'
	},
	metadata: {
		product: rivalQuestProduct.metadataProduct
	},
	payment_status: 'paid',
	status: 'complete'
} satisfies StripeCheckoutSession;

describe('Rival Quest checkout verification', () => {
	beforeEach(() => {
		process.env.STRIPE_SECRET_KEY = 'sk_test_unit';
		process.env.RIVAL_QUEST_DOWNLOAD_URL = 'https://storage.example/rival.zip';
		delete process.env.RIVAL_QUEST_DOWNLOAD_BEARER_TOKEN;
	});

	it('accepts a paid matching checkout session', () => {
		const result = verifyRivalQuestCheckoutSessionRecord(paidSession);

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.customerEmail).toBe('customer@example.com');
		}
	});

	it('rejects unpaid checkout sessions', () => {
		const result = verifyRivalQuestCheckoutSessionRecord({
			...paidSession,
			payment_status: 'unpaid'
		});

		expect(result).toMatchObject({
			ok: false,
			status: 402
		});
	});

	it('rejects sessions for another product', () => {
		const result = verifyRivalQuestCheckoutSessionRecord({
			...paidSession,
			metadata: { product: 'custom-holographic-photo-magnet' }
		});

		expect(result).toMatchObject({
			ok: false,
			status: 403
		});
	});

	it('verifies a paid session server-side and fetches the protected source only after verification', async () => {
		const requestedUrls: string[] = [];
		const fetch = async (input: RequestInfo | URL) => {
			const requestUrl = String(input);
			requestedUrls.push(requestUrl);

			if (requestUrl.startsWith('https://api.stripe.com/v1/checkout/sessions/')) {
				return Response.json(paidSession);
			}

			return new Response('zip-bytes', {
				headers: { 'content-type': 'application/zip' }
			});
		};

		const verified = await verifyRivalQuestCheckoutSession({
			fetch,
			sessionId: 'cs_test_rivalquest'
		});
		const download = await fetchRivalQuestDownload(fetch);

		expect(verified.ok).toBe(true);
		expect(await download.text()).toBe('zip-bytes');
		expect(requestedUrls).toEqual([
			expect.stringContaining('https://api.stripe.com/v1/checkout/sessions/cs_test_rivalquest'),
			'https://storage.example/rival.zip'
		]);
	});
});
