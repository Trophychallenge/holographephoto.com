import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storePaidOrder } from './orders';
import type { StripeCheckoutSession, StripeEvent } from './stripe';

const blobMock = vi.hoisted(() => {
	class MockBlobNotFoundError extends Error {}

	return {
		MockBlobNotFoundError,
		head: vi.fn(),
		put: vi.fn()
	};
});

vi.mock('$env/dynamic/private', () => ({
	env: process.env
}));

vi.mock('@vercel/blob', () => ({
	BlobNotFoundError: blobMock.MockBlobNotFoundError,
	head: blobMock.head,
	list: vi.fn(),
	put: blobMock.put
}));

const session = {
	id: 'cs_test_duplicate',
	object: 'checkout.session',
	amount_total: 999,
	currency: 'usd',
	customer_details: { email: 'customer@example.com' },
	metadata: { product: 'rival-quest-printable-party-game' },
	payment_status: 'paid',
	status: 'complete'
} satisfies StripeCheckoutSession;

const event = {
	id: 'evt_test_duplicate',
	type: 'checkout.session.completed',
	data: { object: session }
} satisfies StripeEvent<StripeCheckoutSession>;

describe('paid order fulfillment storage', () => {
	beforeEach(() => {
		process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_test';
		blobMock.head.mockReset();
		blobMock.put.mockReset();
	});

	it('stores a paid order once and treats duplicate webhook/session fulfillment as already handled', async () => {
		blobMock.head.mockRejectedValueOnce(new blobMock.MockBlobNotFoundError());
		blobMock.put.mockResolvedValueOnce({
			url: 'https://blob.example/orders/stripe/cs_test_duplicate.json',
			pathname: 'orders/stripe/cs_test_duplicate.json',
			uploadedAt: new Date()
		});

		const first = await storePaidOrder({ session, event });

		blobMock.head.mockResolvedValueOnce({
			url: 'https://blob.example/orders/stripe/cs_test_duplicate.json',
			pathname: 'orders/stripe/cs_test_duplicate.json',
			uploadedAt: new Date()
		});

		const second = await storePaidOrder({ session, event });

		expect(first).toEqual({ stored: true, pathname: 'orders/stripe/cs_test_duplicate.json' });
		expect(second).toEqual({ stored: false, pathname: 'orders/stripe/cs_test_duplicate.json' });
		expect(blobMock.put).toHaveBeenCalledTimes(1);
	});
});
