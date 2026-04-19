import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import {
	fetchCheckoutSession,
	type StripeCheckoutSession,
	type StripeEvent,
	verifyStripeWebhookSignature
} from '$lib/server/stripe';
import { storePaidOrder } from '$lib/server/orders';

const HANDLED_EVENT_TYPES = new Set([
	'checkout.session.completed',
	'checkout.session.async_payment_succeeded'
]);

export const POST: RequestHandler = async ({ request, fetch }) => {
	if (!env.STRIPE_WEBHOOK_SECRET) {
		return new Response('Stripe webhook secret is not configured.', { status: 503 });
	}

	const payload = await request.text();
	const signatureHeader = request.headers.get('stripe-signature');

	const verified = verifyStripeWebhookSignature({
		payload,
		signatureHeader,
		secret: env.STRIPE_WEBHOOK_SECRET
	});

	if (!verified) {
		return new Response('Invalid Stripe webhook signature.', { status: 400 });
	}

	const event = JSON.parse(payload) as StripeEvent<StripeCheckoutSession>;

	if (!HANDLED_EVENT_TYPES.has(event.type)) {
		return new Response('Ignored.', { status: 200 });
	}

	const sessionId = event.data.object.id;
	if (!sessionId) {
		return new Response('Missing Checkout Session ID.', { status: 400 });
	}

	try {
		const session = await fetchCheckoutSession(fetch, sessionId);

		if (session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded') {
			await storePaidOrder({ session, event });
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown webhook failure.';
		return new Response(message, { status: 500 });
	}

	return new Response('OK', { status: 200 });
};
