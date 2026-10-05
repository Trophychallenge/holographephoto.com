import { fetchCheckoutSession } from '$lib/server/stripe';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const load: PageServerLoad = async ({ url, fetch }) => {
	const sessionId = url.searchParams.get('session_id') ?? '';
	if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) return { state: 'missing' as const };
	try {
		const session = await fetchCheckoutSession(fetch, sessionId);
		return session.payment_status === 'paid'
			? { state: 'paid' as const }
			: { state: 'pending' as const, paymentStatus: session.payment_status ?? 'unknown' };
	} catch (error) {
		console.error('checkout success verification failed', error);
		return { state: 'unavailable' as const };
	}
};
