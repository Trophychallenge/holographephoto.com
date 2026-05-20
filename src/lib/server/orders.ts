import { BlobNotFoundError, head, list, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import type { StripeCheckoutSession, StripeEvent } from '$lib/server/stripe';

function getOrderPathname(sessionId: string) {
	return `orders/stripe/${sessionId}.json`;
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
	recordUrl: string;
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
	if (!env.BLOB_READ_WRITE_TOKEN) {
		throw new Error('Missing BLOB_READ_WRITE_TOKEN.');
	}

	const pathname = getOrderPathname(session.id);

	try {
		await head(pathname);
		return { stored: false, pathname };
	} catch (error) {
		if (!(error instanceof BlobNotFoundError)) {
			throw error;
		}
	}

	const record = {
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
		access: 'public',
		addRandomSuffix: false,
		allowOverwrite: false,
		contentType: 'application/json'
	});

	return { stored: true, pathname };
}

export async function listRecentPaidOrders(
	fetch: typeof globalThis.fetch,
	limit = 50
): Promise<StoredPaidOrderSummary[]> {
	if (!env.BLOB_READ_WRITE_TOKEN) {
		throw new Error('Missing BLOB_READ_WRITE_TOKEN.');
	}

	const { blobs } = await list({
		prefix: 'orders/stripe/',
		limit: Math.max(limit, 100)
	});

	const recentBlobs = blobs
		.sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())
		.slice(0, limit);

	const records = await Promise.all(
		recentBlobs.map(async (blob) => {
			try {
				const response = await fetch(blob.url, {
					headers: {
						accept: 'application/json'
					}
				});

				if (!response.ok) {
					throw new Error(`Failed to fetch order record ${blob.pathname}.`);
				}

				const record = (await response.json()) as StoredPaidOrderRecord;

				return {
					...record,
					recordUrl: blob.url,
					recordPathname: blob.pathname,
					recordUploadedAt: blob.uploadedAt.toISOString()
				};
			} catch (error) {
				console.error('Unable to load order record', blob.pathname, error);
				return null;
			}
		})
	);

	return records.filter(isStoredPaidOrderSummary).sort(
		(left, right) =>
			new Date(right.storedAt).getTime() - new Date(left.storedAt).getTime()
	);
}

export type { StoredPaidOrderRecord, StoredPaidOrderSummary };
