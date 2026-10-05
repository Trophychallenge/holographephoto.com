import { getQuoteArtwork } from '$lib/server/quotes';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const pathname = url.searchParams.get('pathname') ?? '';
	const result = await getQuoteArtwork(pathname);
	if (!result?.stream) return new Response('Artwork not found.', { status: 404 });
	return new Response(result.stream, { headers: { 'content-type': result.headers.get('content-type') ?? 'application/octet-stream', 'content-disposition': result.headers.get('content-disposition') ?? 'attachment' } });
};
