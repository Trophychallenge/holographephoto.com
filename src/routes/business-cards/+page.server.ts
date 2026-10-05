import { fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { storeQuoteRequest, type QuoteArtwork } from '$lib/server/quotes';
import type { Actions } from './$types';

const quantities = new Set(['50', '100', '250', '500', '700', '1,000+', 'Help me decide']);
const text = (value: FormDataEntryValue | null, max: number) => String(value ?? '').trim().slice(0, max);

export const actions: Actions = {
	default: async ({ request }) => {
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
			artworkFilename: text(form.get('artworkFilename'), 255),
			artworkContentType: text(form.get('artworkContentType'), 100),
			artworkSize: Number(form.get('artworkSize') ?? 0)
		};
		if (!values.name || !values.businessName || !values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
			return fail(400, { error: 'Enter your name, business name, and a valid email address.', values });
		}
		if (!quantities.has(values.quantity)) return fail(400, { error: 'Choose a quantity.', values });
		let artwork: QuoteArtwork | null = null;
		if (values.artworkPathname) {
			if (!values.artworkPathname.startsWith('quotes/artwork/') || !values.artworkFilename) {
				return fail(400, { error: 'Artwork reference is invalid. Remove it and upload again.', values });
			}
			artwork = { pathname: values.artworkPathname, filename: values.artworkFilename, contentType: values.artworkContentType, size: values.artworkSize };
		}
		const id = randomUUID();
		try {
			await storeQuoteRequest({ id, createdAt: new Date().toISOString(), name: values.name, email: values.email, businessName: values.businessName, quantity: values.quantity, websiteOrQr: values.websiteOrQr, neededBy: values.neededBy, designNotes: values.designNotes, artwork, emailNotification: 'not-configured' });
			return { success: true, requestId: id, emailNotification: 'not-configured' as const };
		} catch (error) {
			console.error('quote request save failed', error);
			return fail(503, { error: 'Your request could not be saved. Please retry or call 512-256-3720.', values });
		}
	}
};
