import { BlobNotFoundError, get, head, list, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import type { StripeCheckoutSession, StripeEvent } from '$lib/server/stripe';

const PAID_ORDER_PREFIX = 'paid-orders/stripe/';

function getOrderPathname(sessionId: string) {
	return `${PAID_ORDER_PREFIX}${sessionId}.json`;
}

function orderBlobOptions() {
	// Never fall back to the public upload or private quote stores.
	if (!env.ORDER_BLOB_STORE_ID) {
		throw new Error('Missing ORDER_BLOB_STORE_ID for private paid-order storage.');
	}

	return { storeId: env.ORDER_BLOB_STORE_ID };
}

type StoredPaidOrderRecord = {
	storedAt: string;
	eventId: string;
	eventType: string;
	sessionId: string;
	paymentStatus: string | null;
	status: string | null;
	amountTotal: number | null;
	currency: string | null;
	customerDetails: StripeCheckoutSession['customer_details'] | null;
	shippingDetails: StripeCheckoutSession['shipping_details'] | null;
	metadata: Record<string, string>;
	lineItems: NonNullable<StripeCheckoutSession['line_items']>['data'];
};

type StoredPaidOrderSummary = StoredPaidOrderRecord & {
	recordPathname: string;
	recordUploadedAt: string;
};

function isStoredPaidOrderSummary(
	record: StoredPaidOrderSummary | null
): record is StoredPaidOrderSummary {
	return record !== null;
}

export async function storePaidOrder({
	session,
	event
}: {
	session: StripeCheckoutSession;
	event: StripeEvent<StripeCheckoutSession>;
}) {
	const options = orderBlobOptions();
	const pathname = getOrderPathname(session.id);

	try {
		await head(pathname, options);
		return { stored: false, pathname };
	} catch (error) {
		if (!(error instanceof BlobNotFoundError)) {
			throw error;
		}
	}

	const record: StoredPaidOrderRecord = {
		storedAt: new Date().toISOString(),
		eventId: event.id,
		eventType: event.type,
		sessionId: session.id,
		paymentStatus: session.payment_status ?? null,
		status: session.status ?? null,
		amountTotal: session.amount_total ?? null,
		currency: session.currency ?? null,
		customerDetails: session.customer_details ?? null,
		shippingDetails: session.shipping_details ?? null,
		metadata: session.metadata ?? {},
		lineItems: session.line_items?.data ?? []
	};

	await put(pathname, JSON.stringify(record, null, 2), {
		...options,
		access: 'private',
		addRandomSuffix: false,
		allowOverwrite: false,
		contentType: 'application/json'
	});

	return { stored: true, pathname };
}

export async function getPaidOrder(sessionId: string): Promise<StoredPaidOrderRecord | null> {
	const blob = await get(getOrderPathname(sessionId), {
		...orderBlobOptions(),
		access: 'private',
		useCache: false
	});

	if (!blob?.stream) return null;
	return (await new Response(blob.stream).json()) as StoredPaidOrderRecord;
}

export async function listRecentPaidOrders(limit = 50): Promise<StoredPaidOrderSummary[]> {
	const options = orderBlobOptions();

	const { blobs } = await list({
		...options,
		prefix: PAID_ORDER_PREFIX,
		limit: Math.max(limit, 100)
	});

	const recentBlobs = blobs
		.sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())
		.slice(0, limit);

	const records = await Promise.all(
		recentBlobs.map(async (blob) => {
			try {
				const sessionId = blob.pathname.slice(PAID_ORDER_PREFIX.length, -'.json'.length);
				const record = await getPaidOrder(sessionId);
				if (!record) throw new Error(`Order record ${blob.pathname} was not found.`);

				return {
					...record,
					recordPathname: blob.pathname,
					recordUploadedAt: blob.uploadedAt.toISOString()
				};
			} catch (error) {
				console.error('Unable to load private order record', blob.pathname, error);
				return null;
			}
		})
	);

	return records.filter(isStoredPaidOrderSummary).sort(
		(left, right) =>
			new Date(right.storedAt).getTime() - new Date(left.storedAt).getTime()
	);
}

export { getOrderPathname };
export type { StoredPaidOrderRecord, StoredPaidOrderSummary };
