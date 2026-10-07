import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listRecentPaidOrders, storePaidOrder } from './orders';
import { buildChristinaOrderPayload } from './christina-order-sync';
import type { StripeCheckoutSession, StripeEvent } from './stripe';

const blobMock = vi.hoisted(() => {
	class MockBlobNotFoundError extends Error {}

	return {
		MockBlobNotFoundError,
		head: vi.fn(),
		get: vi.fn(),
		list: vi.fn(),
		put: vi.fn()
	};
});

vi.mock('$env/dynamic/private', () => ({
	env: process.env
}));

vi.mock('@vercel/blob', () => ({
	BlobNotFoundError: blobMock.MockBlobNotFoundError,
	get: blobMock.get,
	head: blobMock.head,
	list: blobMock.list,
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
		process.env.ORDER_BLOB_STORE_ID = 'store_private_orders_test';
		blobMock.get.mockReset();
		blobMock.head.mockReset();
		blobMock.list.mockReset();
		blobMock.put.mockReset();
	});

	it('stores a paid order once and treats duplicate webhook/session fulfillment as already handled', async () => {
		blobMock.head.mockRejectedValueOnce(new blobMock.MockBlobNotFoundError());
		blobMock.put.mockResolvedValueOnce({
			pathname: 'paid-orders/stripe/cs_test_duplicate.json',
			uploadedAt: new Date()
		});

		const first = await storePaidOrder({ session, event });

		blobMock.head.mockResolvedValueOnce({
			pathname: 'paid-orders/stripe/cs_test_duplicate.json',
			uploadedAt: new Date()
		});

		const second = await storePaidOrder({ session, event });

		expect(first).toEqual({ stored: true, pathname: 'paid-orders/stripe/cs_test_duplicate.json' });
		expect(second).toEqual({ stored: false, pathname: 'paid-orders/stripe/cs_test_duplicate.json' });
		expect(blobMock.put).toHaveBeenCalledTimes(1);
		expect(blobMock.put).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
			expect.objectContaining({
				access: 'private',
				storeId: 'store_private_orders_test',
				allowOverwrite: false
			})
		);
	});

	it('loads records through private Blob reads rather than public record URLs', async () => {
		blobMock.list.mockResolvedValueOnce({
			blobs: [
				{
					pathname: 'paid-orders/stripe/cs_test_duplicate.json',
					uploadedAt: new Date('2026-10-06T04:00:00Z')
				}
			]
		});
		blobMock.get.mockResolvedValueOnce({
			stream: new ReadableStream({
				start(controller) {
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({
								storedAt: '2026-10-06T04:00:00Z',
								eventId: event.id,
								eventType: event.type,
								sessionId: session.id,
								paymentStatus: 'paid',
								status: 'complete',
								amountTotal: 999,
								currency: 'usd',
								customerDetails: null,
								shippingDetails: null,
								metadata: {},
								lineItems: []
							})
						)
					);
					controller.close();
				}
			})
		});

		const orders = await listRecentPaidOrders();
		expect(orders).toHaveLength(1);
		expect(blobMock.get).toHaveBeenCalledWith(
			'paid-orders/stripe/cs_test_duplicate.json',
			expect.objectContaining({ access: 'private', storeId: 'store_private_orders_test' })
		);
	});

	it('builds a server-only ChristinaOS payload without public artwork URLs', () => {
		const payload = buildChristinaOrderPayload({
			storedAt: '2026-10-05T12:00:00.000Z', created: 1791201600, eventId: event.id,
			eventType: event.type, sessionId: session.id, paymentStatus: 'paid', status: 'complete',
			amountTotal: 1999, currency: 'usd', customerDetails: null, shippingDetails: null,
			metadata: { offer: 'Keepsake Set', quantity: '1', base_blob_pathname: 'orders/base/private.jpg' }, lineItems: []
		});
		expect(payload).toMatchObject({ checkoutSessionId: session.id, amountTotal: 1999, product: 'Keepsake Set', quantity: 1, productionReferences: { baseBlobPathname: 'orders/base/private.jpg', overlayBlobPathname: null } });
		expect(JSON.stringify(payload)).not.toContain('http');
	});
});
