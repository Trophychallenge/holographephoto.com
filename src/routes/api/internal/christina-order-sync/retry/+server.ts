import { env } from '$env/dynamic/private';
import { retryDueChristinaOrderSyncs } from '$lib/server/christina-order-sync';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	// Vercel Cron sends CRON_SECRET automatically. The fallback keeps local/manual retry testing explicit.
	const secret = env.CRON_SECRET ?? env.CHRISTINA_OS_SYNC_RETRY_SECRET ?? '';
	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return new Response('Unauthorized.', { status: 401 });
	}
	try {
		return Response.json(await retryDueChristinaOrderSyncs());
	} catch (error) {
		console.error('ChristinaOS sync retry failed:', error);
		return new Response('Retry failed.', { status: 500 });
	}
};
