import { env } from '$env/dynamic/private';
import type { StripeCheckoutSession } from '$lib/server/stripe';

const PUSHOVER_API_URL = 'https://api.pushover.net/1/messages.json';

function formatCurrency(amountTotal: number | null, currency: string | null) {
	if (typeof amountTotal !== 'number' || !currency) return 'Amount unavailable';

	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase()
		}).format(amountTotal / 100);
	} catch {
		return `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}`;
	}
}

function compactLines(values: Array<string | null | undefined>) {
	return values.map((value) => value?.trim()).filter(Boolean) as string[];
}

function buildOrderMessage(session: StripeCheckoutSession) {
	const customerName = session.customer_details?.name || session.shipping_details?.name || 'Customer';
	const amount = formatCurrency(session.amount_total ?? null, session.currency ?? null);
	const quantity = session.metadata?.quantity || session.line_items?.data?.[0]?.quantity?.toString() || '1';
	const size = session.metadata?.print_size || '8x10';
	const request = session.metadata?.personal_request;
	const text = session.metadata?.overlay_text;
	const email = session.customer_details?.email;
	const phone = session.customer_details?.phone;

	const lines = compactLines([
		`${customerName} placed a new order.`,
		`${quantity} item${quantity === '1' ? '' : 's'} • ${amount}`,
		`Size: ${size}`,
		request ? `Request: ${request}` : null,
		text ? `Text: ${text}` : null,
		email ? `Email: ${email}` : null,
		phone ? `Phone: ${phone}` : null
	]);

	return lines.join('\n');
}

export async function sendPushoverOrderAlert(
	fetch: typeof globalThis.fetch,
	session: StripeCheckoutSession
) {
	if (!env.PUSHOVER_TOKEN || !env.PUSHOVER_USER_KEY) {
		return { sent: false, reason: 'missing-config' as const };
	}

	const body = new URLSearchParams({
		token: env.PUSHOVER_TOKEN,
		user: env.PUSHOVER_USER_KEY,
		title: 'New Holograph order',
		message: buildOrderMessage(session),
		priority: '0'
	});

	const response = await fetch(PUSHOVER_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Pushover API error: ${text}`);
	}

	return { sent: true as const };
}
