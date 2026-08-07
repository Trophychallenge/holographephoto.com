import { rivalQuestProduct } from '$lib/products/rival-quest';
import { verifyRivalQuestCheckoutSession } from '$lib/server/rival-quest-delivery';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const sessionId = url.searchParams.get('session_id');

	try {
		const verification = await verifyRivalQuestCheckoutSession({ fetch, sessionId });

		if (!verification.ok) {
			return {
				verified: false,
				status: verification.status,
				message: verification.message,
				sessionId: sessionId ?? '',
				customerEmail: '',
				product: rivalQuestProduct
			};
		}

		return {
			verified: true,
			status: 200,
			message: '',
			sessionId: verification.session.id,
			customerEmail: verification.customerEmail,
			product: rivalQuestProduct
		};
	} catch {
		return {
			verified: false,
			status: 503,
			message:
				'We received your return from Stripe, but checkout verification is temporarily unavailable.',
			sessionId: sessionId ?? '',
			customerEmail: '',
			product: rivalQuestProduct
		};
	}
};
