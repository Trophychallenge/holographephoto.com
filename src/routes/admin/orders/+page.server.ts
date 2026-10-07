import { listRecentPaidOrders } from '$lib/server/orders';
import { fetchCheckoutSession } from '$lib/server/stripe';
import { getChristinaSyncJob } from '$lib/server/christina-order-sync';
import type { PageServerLoad } from './$types';

export const prerender = false;
const OCTOBER_5_RECOVERY_SESSION_ID = 'cs_live_b1hhBSVI4Ezz1N2HorneLFO8fYzHhgiVHcleEl05fvBra1aRKaefWuSSg4';

export const load: PageServerLoad = async ({ fetch }) => {
	let recovery: {
		sessionId: string;
		amountTotal: number | null;
		currency: string | null;
		paymentStatus: string | undefined;
		status: string | null | undefined;
		offer: string;
		quantity: string;
		hasOriginalPhoto: boolean;
		hasOverlay: boolean;
	} | null = null;
	let recoveryError = '';

	try {
		const session = await fetchCheckoutSession(fetch, OCTOBER_5_RECOVERY_SESSION_ID);
		recovery = {
			sessionId: session.id,
			amountTotal: session.amount_total,
			currency: session.currency,
			paymentStatus: session.payment_status,
			status: session.status,
			offer: session.metadata?.offer || session.line_items?.data[0]?.description || 'Photo magnet order',
			quantity: session.metadata?.quantity || session.line_items?.data[0]?.quantity?.toString() || '1',
			hasOriginalPhoto: Boolean(session.metadata?.base_blob_pathname),
			hasOverlay: Boolean(session.metadata?.overlay_blob_pathname)
		};
	} catch (error) {
		console.error('admin paid-order recovery preview failed', error);
		recoveryError = 'The authorized Stripe recovery preview is temporarily unavailable.';
	}

	try {
		const orders = await listRecentPaidOrders(50);
		return {
			orders: await Promise.all(orders.map(async (order) => ({ ...order, christinaSync: await getChristinaSyncJob(order.sessionId) }))),
			loadError: '',
			recovery,
			recoveryError
		};
	} catch (error) {
		console.error('admin orders load failed', error);
		return {
			orders: [],
			loadError:
				error instanceof Error
					? error.message
					: 'Orders are unavailable right now. Check blob storage configuration.',
			recovery,
			recoveryError
		};
	}
};
