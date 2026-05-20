import { listRecentPaidOrders } from '$lib/server/orders';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		return {
			orders: await listRecentPaidOrders(fetch, 50),
			loadError: ''
		};
	} catch (error) {
		console.error('admin orders load failed', error);
		return {
			orders: [],
			loadError:
				error instanceof Error
					? error.message
					: 'Orders are unavailable right now. Check blob storage configuration.'
		};
	}
};
