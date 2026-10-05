import { listRecentQuoteRequests } from '$lib/server/quotes';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const load: PageServerLoad = async () => {
	try {
		return { quotes: await listRecentQuoteRequests(), loadError: '' };
	} catch (error) {
		return { quotes: [], loadError: error instanceof Error ? error.message : 'Quote requests are unavailable.' };
	}
};
