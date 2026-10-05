import { fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import {
	findQuoteByIdempotencyKey,
	storeQuoteRequest,
	validateQuoteArtwork,
	type QuoteArtwork,
	type QuoteRequest
} from '$lib/server/quotes';
import { sendPushoverQuoteAlert } from '$lib/server/pushover';
import type { Actions } from './$types';

const quantities = new Set(['50', '100', '250', '500', '700', '1,000+', 'Help me decide']);
const text = (value: FormDataEntryValue | null, max: number) => String(value ?? '').trim().slice(0, max);

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();
		const values = {
			name: text(form.get('name'), 100),
			email: text(form.get('email'), 254),
			businessName: text(form.get('businessName'), 100),
			quantity: text(form.get('quantity'), 30),
			websiteOrQr: text(form.get('websiteOrQr'), 500),
			neededBy: text(form.get('neededBy'), 10),
			designNotes: text(form.get('designNotes'), 1500),
			artworkPathname: text(form.get('artworkPathname'), 400),
			draftId: text(form.get('draftId'), 80),
			idempotencyKey: text(form.get('idempotencyKey'), 100)
		};
		if (!values.name || !values.businessName || !values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
			return fail(400, { error: 'Enter your name, business name, and a valid email address.', values });
		}
		if (!quantities.has(values.quantity)) return fail(400, { error: 'Choose a quantity.', values });
		if (!/^[a-zA-Z0-9-]{16,100}$/.test(values.idempotencyKey)) {
			return fail(400, { error: 'Your form expired. Refresh the page and try again.', values });
		}
		try {
			const previous = await findQuoteByIdempotencyKey(values.idempotencyKey);
			if (previous) return { success: true, requestId: previous.id, duplicate: true };
		} catch (error) {
			console.error('quote duplicate check failed', error);
			return fail(503, { error: 'Quote requests are temporarily unavailable. Please retry shortly.', values });
		}
		let artwork: QuoteArtwork | null = null;
		if (values.artworkPathname) {
			try {
				artwork = await validateQuoteArtwork(values.artworkPathname, values.draftId);
			} catch {
				return fail(400, { error: 'Artwork could not be verified. Remove it and upload again.', values });
			}
		}
		const id = randomUUID();
		const quote: QuoteRequest = {
			id, createdAt: new Date().toISOString(), name: values.name, email: values.email,
			businessName: values.businessName, quantity: values.quantity, websiteOrQr: values.websiteOrQr,
			neededBy: values.neededBy, designNotes: values.designNotes, artwork, emailNotification: 'not-configured',
			idempotencyKey: values.idempotencyKey
		};
		try {
			await storeQuoteRequest(quote);
		} catch (error) {
			console.error('quote request save failed', error);
			return fail(503, { error: 'Your request could not be saved. Please retry or call 512-256-3720.', values });
		}
		try {
			const notification = await sendPushoverQuoteAlert(fetch, quote);
			if (notification.sent) {
				quote.emailNotification = 'sent';
				await storeQuoteRequest(quote);
			}
		} catch (error) {
			console.error('quote notification failed', error);
			quote.emailNotification = 'failed';
			try { await storeQuoteRequest(quote); } catch { /* The persisted request remains valid. */ }
		}
		return { success: true, requestId: id, duplicate: false };
	}
};
