import { get } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { getPaidOrder } from '$lib/server/orders';
import type { RequestHandler } from './$types';

const SESSION_ID_PATTERN = /^cs_(?:live|test)_[A-Za-z0-9]+$/;
const ALLOWED_UPLOAD_PREFIXES = {
	base: 'orders/base/',
	overlay: 'orders/overlay/'
} as const;

function safeFilename(pathname: string, fallback: string) {
	return pathname.split('/').at(-1)?.replace(/[^A-Za-z0-9._-]/g, '-') || fallback;
}

export const GET: RequestHandler = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id') ?? '';
	const kind = url.searchParams.get('kind');

	if (!SESSION_ID_PATTERN.test(sessionId)) throw error(400, 'Invalid order reference.');
	if (kind !== 'base' && kind !== 'overlay' && kind !== 'record') throw error(400, 'Invalid file type.');

	const order = await getPaidOrder(sessionId);
	if (!order) throw error(404, 'Private order record not found.');

	if (kind === 'record') {
		const response = new Response(JSON.stringify(order, null, 2), {
			headers: { 'content-type': 'application/json; charset=utf-8' }
		});
		response.headers.set('cache-control', 'private, no-store');
		response.headers.set('content-disposition', `attachment; filename="${sessionId}.json"`);
		return response;
	}

	const pathname = kind === 'base' ? order.metadata.base_blob_pathname : order.metadata.overlay_blob_pathname;
	const requiredPrefix = ALLOWED_UPLOAD_PREFIXES[kind];
	if (!pathname || !pathname.startsWith(requiredPrefix)) throw error(404, 'Requested production file is unavailable.');
	if (!env.BLOB_READ_WRITE_TOKEN) throw error(503, 'Public upload storage is unavailable.');

	const blob = await get(pathname, {
		access: 'public',
		token: env.BLOB_READ_WRITE_TOKEN,
		useCache: false
	});
	if (!blob?.stream) throw error(404, 'Requested production file is unavailable.');

	const headers = new Headers();
	blob.headers.forEach((value, key) => headers.set(key, value));
	const response = new Response(blob.stream, { headers });
	response.headers.set('cache-control', 'private, no-store');
	response.headers.set(
		'content-disposition',
		`attachment; filename="${safeFilename(pathname, kind === 'base' ? 'original-photo' : 'overlay')}"`
	);
	return response;
};
