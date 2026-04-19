import { BlobNotFoundError, head, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import type { StripeCheckoutSession, StripeEvent } from '$lib/server/stripe';

function getOrderPathname(sessionId: string) {
	return `orders/stripe/${sessionId}.json`;
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
