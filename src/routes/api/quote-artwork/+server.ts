import { json } from '@sveltejs/kit';
import { storeQuoteArtwork } from '$lib/server/quotes';
import type { RequestHandler } from './$types';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const maxBytes = 10 * 1024 * 1024;

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const file = form.get('artwork');
	const draftId = String(form.get('draftId') ?? '');
	if (!(file instanceof File) || !draftId || !/^[a-zA-Z0-9-]{8,80}$/.test(draftId)) {
		return json({ error: 'Choose an artwork file before uploading.' }, { status: 400 });
	}
	if (!allowedTypes.has(file.type) || !/\.(jpe?g|png|pdf)$/i.test(file.name)) {
		return json({ error: 'Artwork must be a JPG, PNG, or PDF.' }, { status: 400 });
	}
	if (file.size === 0 || file.size > maxBytes) {
		return json({ error: 'Artwork must be no larger than 10 MB.' }, { status: 400 });
	}
	try {
		return json({ artwork: await storeQuoteArtwork(draftId, file) });
	} catch (error) {
		console.error('quote artwork upload failed', error);
		return json({ error: 'Artwork could not be saved. Please retry.' }, { status: 503 });
	}
};
