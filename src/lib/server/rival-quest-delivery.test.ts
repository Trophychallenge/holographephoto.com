import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rivalQuestProduct } from '$lib/products/rival-quest';
import {
	getRivalQuestDownload,
	verifyRivalQuestCheckoutSession,
	verifyRivalQuestCheckoutSessionRecord
} from './rival-quest-delivery';
import type { StripeCheckoutSession } from './stripe';

const blobMock = vi.hoisted(() => ({
	get: vi.fn()
}));

vi.mock('@vercel/blob', () => ({
	get: blobMock.get
}));

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
		product: rivalQuestProduct.metadataProduct,
		builder_version: 'party-builder-mvp-1',
		setting: 'pool',
		team_one: 'unicorns',
		team_two: 'dragons',
		age_range: 'ages-7-9',
		player_count: '9-14',
		party_length: 'full',
		party_name: 'Ava Birthday Bash',
		configuration_summary: 'Unicorn Herd vs. Dragon Clan - Pool Party Edition'
	},
	payment_status: 'paid',
	status: 'complete'
} satisfies StripeCheckoutSession;

describe('Rival Quest checkout verification', () => {
	beforeEach(() => {
		process.env.STRIPE_SECRET_KEY = 'sk_test_unit';
		process.env.RIVAL_QUEST_BLOB_PATHNAME =
			'digital-products/rival-quest/Rival_Quest_Digital_Party_Game.zip';
		process.env.RIVAL_QUEST_BLOB_STORE_ID = 'store_test_rivalquest';
		delete process.env.RIVAL_QUEST_BLOB_READ_WRITE_TOKEN;
		blobMock.get.mockReset();
	});

	it('accepts a paid matching checkout session', () => {
		const result = verifyRivalQuestCheckoutSessionRecord(paidSession);

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.customerEmail).toBe('customer@example.com');
			expect(result.config).toMatchObject({
				setting: 'pool',
				teamOne: 'unicorns',
				teamTwo: 'dragons'
			});
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

	it('rejects paid sessions with invalid builder metadata', () => {
		const result = verifyRivalQuestCheckoutSessionRecord({
			...paidSession,
			metadata: {
				...paidSession.metadata,
				team_two: 'unicorns'
			}
		});

		expect(result).toMatchObject({
			ok: false,
			status: 403
		});
	});

	it('verifies a paid session server-side and fetches the private blob only after verification', async () => {
		const requestedUrls: string[] = [];
		const fetch = async (input: RequestInfo | URL) => {
			const requestUrl = String(input);
			requestedUrls.push(requestUrl);

			if (requestUrl.startsWith('https://api.stripe.com/v1/checkout/sessions/')) {
				return Response.json(paidSession);
			}
			return new Response('unexpected', { status: 404 });
		};
		blobMock.get.mockResolvedValueOnce({
			statusCode: 200,
			stream: new Response('zip-bytes').body,
			headers: new Headers(),
			blob: {
				url: 'https://private.blob.vercel-storage.com/redacted',
				downloadUrl: 'https://private.blob.vercel-storage.com/redacted?download=1',
				pathname: rivalQuestProduct.blobPathname,
				contentType: 'application/zip',
				contentDisposition: 'attachment',
				cacheControl: 'no-cache',
				etag: 'etag',
				size: 123,
				uploadedAt: new Date()
			}
		});

		const verified = await verifyRivalQuestCheckoutSession({
			fetch,
			sessionId: 'cs_test_rivalquest'
		});
		const download = await getRivalQuestDownload();

		expect(verified.ok).toBe(true);
		expect(await new Response(download.stream).text()).toBe('zip-bytes');
		expect(blobMock.get).toHaveBeenCalledWith(rivalQuestProduct.blobPathname, {
			access: 'private',
			storeId: 'store_test_rivalquest',
			useCache: false
		});
		expect(requestedUrls).toEqual([
			expect.stringContaining('https://api.stripe.com/v1/checkout/sessions/cs_test_rivalquest')
		]);
	});

	it('uses the dedicated Rival Quest blob token when OIDC store connection is unavailable', async () => {
		process.env.RIVAL_QUEST_BLOB_READ_WRITE_TOKEN = 'vercel_blob_private_rivalquest_test';
		blobMock.get.mockResolvedValueOnce({
			stream: new Response('zip-bytes').body,
			blob: {
				pathname: rivalQuestProduct.blobPathname,
				contentType: 'application/zip'
			}
		});

		await getRivalQuestDownload();

		expect(blobMock.get).toHaveBeenCalledWith(rivalQuestProduct.blobPathname, {
			access: 'private',
			token: 'vercel_blob_private_rivalquest_test',
			useCache: false
		});
	});
});
