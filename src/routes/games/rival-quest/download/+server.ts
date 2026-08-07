import { rivalQuestProduct } from '$lib/products/rival-quest';
import {
	fetchRivalQuestDownload,
	verifyRivalQuestCheckoutSession
} from '$lib/server/rival-quest-delivery';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	let verification;

	try {
		verification = await verifyRivalQuestCheckoutSession({
			fetch,
			sessionId: url.searchParams.get('session_id')
		});
	} catch {
		return new Response('Checkout verification is temporarily unavailable.', { status: 503 });
	}

	if (!verification.ok) {
		return new Response(verification.message, { status: verification.status });
	}

	try {
		const source = await fetchRivalQuestDownload(fetch);

		return new Response(source.body, {
			headers: {
				'content-type': 'application/zip',
				'content-disposition': `attachment; filename="${rivalQuestProduct.downloadFilename}"`,
				'cache-control': 'private, no-store',
				'x-content-type-options': 'nosniff'
			}
		});
	} catch {
		return new Response(
			'Your payment is verified, but the download file is temporarily unavailable. Email admin@holographephoto.com with your Stripe receipt email for help.',
			{ status: 503 }
		);
	}
};
