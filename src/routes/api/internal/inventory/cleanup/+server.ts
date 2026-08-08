import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { releaseExpiredReservations } from '$lib/server/inventory';

export const POST: RequestHandler = async ({ request }) => {
	const expectedSecret = env.INVENTORY_CRON_SECRET ?? '';
	const authorization = request.headers.get('authorization');

	if (!expectedSecret || authorization !== `Bearer ${expectedSecret}`) {
		return new Response('Unauthorized.', { status: 401 });
	}

	try {
		const released = await releaseExpiredReservations();
		return Response.json({ released });
	} catch (error) {
		console.error('Inventory cleanup failed', error);
		return new Response('Inventory cleanup failed.', { status: 500 });
	}
};
