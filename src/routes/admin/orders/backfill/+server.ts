import { json } from '@sveltejs/kit';
import { storePaidOrder } from '$lib/server/orders';
import { sendPushoverOrderAlert } from '$lib/server/pushover';
import { fetchCheckoutSession, type StripeCheckoutSession, type StripeEvent } from '$lib/server/stripe';
import type { RequestHandler } from './$types';

const SESSION_ID_PATTERN = /^cs_live_[A-Za-z0-9]+$/;

// This is an authenticated, idempotent administrative recovery path. It fetches Stripe's
// canonical session and never replays a webhook, touches a payment, or releases inventory.
export const POST: RequestHandler = async ({ request, fetch }) => {
	const body = await request.json().catch(() => null);
	const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : '';
	if (!SESSION_ID_PATTERN.test(sessionId)) return json({ error: 'Invalid paid session reference.' }, { status: 400 });

	const session = await fetchCheckoutSession(fetch, sessionId);
	if (session.payment_status !== 'paid') {
		return json({ error: 'Stripe session is not paid and was not recovered.' }, { status: 409 });
	}

	const event: StripeEvent<StripeCheckoutSession> = {
		id: `admin-backfill:${session.id}`,
		type: 'admin.paid_order_backfill',
		data: { object: session }
	};
	const stored = await storePaidOrder({ session, event });

	// Exactly one recovery alert is sent, and only when the private record was just created.
	if (stored.stored) {
		try {
			await sendPushoverOrderAlert(fetch, session, { recovered: true });
		} catch (error) {
			console.error('Recovered paid-order Pushover alert failed:', error);
			return json({ stored: true, notification: 'failed' }, { status: 202 });
		}
	}

	return json({ stored: stored.stored, notification: stored.stored ? 'sent' : 'not-sent-duplicate' });
};
