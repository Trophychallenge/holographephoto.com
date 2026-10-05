import { json } from '@sveltejs/kit';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { env } from '$env/dynamic/private';
import {
	isQuoteArtworkPathname,
	isValidQuoteDraftId,
	quoteArtworkMaxBytes,
	quoteArtworkTypes
} from '$lib/server/quotes';
import type { RequestHandler } from './$types';

function draftIdFromPayload(value: string | null) {
	try {
		const payload = value ? (JSON.parse(value) as { draftId?: unknown }) : {};
		return typeof payload.draftId === 'string' ? payload.draftId : '';
	} catch {
		return '';
	}
}

export const POST: RequestHandler = async ({ request }) => {
	if (!env.QUOTE_BLOB_READ_WRITE_TOKEN) {
		return json({ error: 'Artwork uploads are temporarily unavailable. Please try again later.' }, { status: 503 });
	}
	let body: HandleUploadBody;
	try {
		body = (await request.json()) as HandleUploadBody;
	} catch {
		return json({ error: 'Upload request could not be read.' }, { status: 400 });
	}
	try {
		const response = await handleUpload({
			body,
			request,
			token: env.QUOTE_BLOB_READ_WRITE_TOKEN,
			onBeforeGenerateToken: async (pathname, clientPayload) => {
				const draftId = draftIdFromPayload(clientPayload);
				if (!isValidQuoteDraftId(draftId) || !isQuoteArtworkPathname(pathname, draftId)) {
					throw new Error('Invalid artwork upload reference.');
				}
				return {
					allowedContentTypes: [...quoteArtworkTypes],
					maximumSizeInBytes: quoteArtworkMaxBytes,
					addRandomSuffix: false,
					validUntil: Date.now() + 5 * 60_000,
					tokenPayload: JSON.stringify({ draftId })
				};
			}
		});
		return json(response);
	} catch (error) {
		console.error('quote artwork authorization failed', error);
		return json({ error: 'Artwork upload could not be authorized. Please retry.' }, { status: 400 });
	}
};
