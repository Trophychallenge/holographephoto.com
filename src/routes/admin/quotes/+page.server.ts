import { env } from '$env/dynamic/private';
import { isQuoteStorageConfigured, listRecentQuoteRequests } from '$lib/server/quotes';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const load: PageServerLoad = async () => {
	try {
		return {
			quotes: await listRecentQuoteRequests(),
			loadError: '',
			storageConfigured: isQuoteStorageConfigured(),
			notificationsConfigured: Boolean(env.PUSHOVER_TOKEN && env.PUSHOVER_USER_KEY)
		};
	} catch (error) {
		return {
			quotes: [],
			loadError: error instanceof Error ? error.message : 'Quote requests are unavailable.',
			storageConfigured: isQuoteStorageConfigured(),
			notificationsConfigured: Boolean(env.PUSHOVER_TOKEN && env.PUSHOVER_USER_KEY)
		};
	}
};
