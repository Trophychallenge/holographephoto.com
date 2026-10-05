import { verifyRivalQuestCheckoutSession } from '$lib/server/rival-quest-delivery';
import { generateRivalQuestPdf, getRivalQuestPdfFilename } from '$lib/server/rival-quest-pdf';
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
		const pdfBytes = await generateRivalQuestPdf(verification.config);

		const body = pdfBytes.buffer.slice(
			pdfBytes.byteOffset,
			pdfBytes.byteOffset + pdfBytes.byteLength
		) as ArrayBuffer;

		return new Response(body, {
			headers: {
				'content-type': 'application/pdf',
				'content-disposition': `attachment; filename="${getRivalQuestPdfFilename(verification.config)}"`,
				'cache-control': 'private, no-store',
				'x-content-type-options': 'nosniff'
			}
		});
	} catch {
		return new Response(
			'Your payment is verified, but the customized PDF is temporarily unavailable. Email admin@holographephoto.com with your Stripe receipt email for help.',
			{ status: 503 }
		);
	}
};
