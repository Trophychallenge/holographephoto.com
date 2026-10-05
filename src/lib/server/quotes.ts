import { get, list, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';

export const quoteArtworkPrefix = 'quotes/artwork/';
const quoteRequestPrefix = 'quotes/requests/';

export type QuoteArtwork = { pathname: string; filename: string; contentType: string; size: number };
export type QuoteRequest = {
	id: string;
	createdAt: string;
	name: string;
	email: string;
	businessName: string;
	quantity: string;
	websiteOrQr: string;
	neededBy: string;
	designNotes: string;
	artwork: QuoteArtwork | null;
	emailNotification: 'not-configured';
};

function requireBlob() {
	if (!env.BLOB_READ_WRITE_TOKEN) throw new Error('Missing BLOB_READ_WRITE_TOKEN.');
}

export function quoteArtworkPathname(id: string, filename: string) {
	return `${quoteArtworkPrefix}${id}/${filename.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
}

export async function storeQuoteArtwork(id: string, file: File) {
	requireBlob();
	const pathname = quoteArtworkPathname(id, file.name || 'artwork');
	const blob = await put(pathname, file, {
		access: 'private',
		addRandomSuffix: true,
		contentType: file.type
	});
	return { pathname: blob.pathname, filename: file.name, contentType: file.type, size: file.size };
}

export async function storeQuoteRequest(request: QuoteRequest) {
	requireBlob();
	await put(`${quoteRequestPrefix}${request.createdAt.slice(0, 10)}/${request.id}.json`, JSON.stringify(request), {
		access: 'private',
		addRandomSuffix: false,
		contentType: 'application/json'
	});
}

export async function listRecentQuoteRequests(limit = 50): Promise<QuoteRequest[]> {
	requireBlob();
	const { blobs } = await list({ prefix: quoteRequestPrefix, limit: Math.max(limit, 100) });
	const records = await Promise.all(
		blobs.slice(0, limit).map(async (blob) => {
			try {
				const result = await get(blob.pathname, { access: 'private' });
				if (!result?.stream) return null;
				return (await new Response(result.stream).json()) as QuoteRequest;
			} catch {
				return null;
			}
		})
	);
	return records.filter((record): record is QuoteRequest => record !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getQuoteArtwork(pathname: string) {
	if (!pathname.startsWith(quoteArtworkPrefix)) return null;
	requireBlob();
	return get(pathname, { access: 'private' });
}
