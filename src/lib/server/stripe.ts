import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

const STRIPE_API_BASE = 'https://api.stripe.com/v1';
const DEFAULT_WEBHOOK_TOLERANCE_SECONDS = 300;

type StripeCheckoutSession = {
	id: string;
	object: 'checkout.session';
	amount_total: number | null;
	currency: string | null;
	customer_details?: {
		email?: string | null;
		name?: string | null;
		phone?: string | null;
		address?: {
			city?: string | null;
			country?: string | null;
			line1?: string | null;
			line2?: string | null;
			postal_code?: string | null;
			state?: string | null;
		} | null;
	} | null;
	shipping_details?: {
		name?: string | null;
		address?: {
			city?: string | null;
			country?: string | null;
			line1?: string | null;
			line2?: string | null;
			postal_code?: string | null;
			state?: string | null;
		} | null;
	} | null;
	metadata?: Record<string, string>;
	payment_status?: string;
	status?: string | null;
	url?: string | null;
	line_items?: {
		data: Array<{
			description?: string | null;
			quantity?: number | null;
			amount_total?: number | null;
			currency?: string | null;
		}>;
	};
};

type StripeEvent<T = unknown> = {
	id: string;
	type: string;
	data: { object: T };
};

function parseStripeSignature(header: string) {
	const entries = header
		.split(',')
		.map((part) => part.trim().split('='))
		.filter((entry): entry is [string, string] => entry.length === 2);

	const timestamp = entries.find(([key]) => key === 't')?.[1];
	const signatures = entries.filter(([key]) => key === 'v1').map(([, value]) => value);

	return { timestamp, signatures };
}

export function verifyStripeWebhookSignature({
	payload,
	signatureHeader,
	secret,
	now = Date.now()
}: {
	payload: string;
	signatureHeader: string | null;
	secret: string;
	now?: number;
}) {
	if (!signatureHeader) return false;

	const { timestamp, signatures } = parseStripeSignature(signatureHeader);
	if (!timestamp || signatures.length === 0) return false;

	const timestampMs = Number.parseInt(timestamp, 10) * 1000;
	if (!Number.isFinite(timestampMs)) return false;

	if (Math.abs(now - timestampMs) > DEFAULT_WEBHOOK_TOLERANCE_SECONDS * 1000) {
		return false;
	}

	const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');

	return signatures.some((candidate) => {
		try {
			return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
		} catch {
			return false;
		}
	});
}

export async function stripeApiRequest<T>({
	fetch,
	path,
	method = 'GET',
	body
}: {
	fetch: typeof globalThis.fetch;
	path: string;
	method?: 'GET' | 'POST';
	body?: URLSearchParams;
}) {
	if (!env.STRIPE_SECRET_KEY) {
		throw new Error('Missing STRIPE_SECRET_KEY.');
	}

	const response = await fetch(`${STRIPE_API_BASE}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
			...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
		},
		body
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Stripe API error: ${text}`);
	}

	return (await response.json()) as T;
}

export async function fetchCheckoutSession(fetch: typeof globalThis.fetch, sessionId: string) {
	const params = new URLSearchParams();
	params.append('expand[]', 'line_items');

	return stripeApiRequest<StripeCheckoutSession>({
		fetch,
		path: `/checkout/sessions/${sessionId}?${params.toString()}`
	});
}

export type { StripeCheckoutSession, StripeEvent };
