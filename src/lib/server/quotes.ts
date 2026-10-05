import { get, head, list, put } from '@vercel/blob';
import { env } from '$env/dynamic/private';

export const quoteArtworkPrefix = 'quotes/artwork/';
const quoteRequestPrefix = 'quotes/requests/';
const quoteIdempotencyPrefix = 'quotes/idempotency/';
export const quoteArtworkTypes = ['image/jpeg', 'image/png', 'application/pdf'] as const;
export const quoteArtworkMaxBytes = 4_500_000;

export type QuoteArtwork = { pathname: string; filename: string; contentType: string; size: number };
export type QuoteNotification = 'sent' | 'failed' | 'not-configured';
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
	emailNotification: QuoteNotification;
	idempotencyKey: string;
};

export class QuoteStorageUnavailableError extends Error {
	constructor() {
		super('Dedicated private quote storage is not configured.');
	}
}

function quoteBlobOptions() {
	// Never fall back to BLOB_READ_WRITE_TOKEN: that store remains for existing paid orders and photos.
	if (!env.QUOTE_BLOB_READ_WRITE_TOKEN) throw new QuoteStorageUnavailableError();
	return { token: env.QUOTE_BLOB_READ_WRITE_TOKEN };
}

export function isQuoteStorageConfigured() {
	return Boolean(env.QUOTE_BLOB_READ_WRITE_TOKEN);
}

export function quoteArtworkPathname(draftId: string, filename: string) {
	const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+/, '') || 'artwork';
	return `${quoteArtworkPrefix}${draftId}/${safeFilename}`;
}

export function isValidQuoteDraftId(value: string) {
	return /^[a-zA-Z0-9-]{8,80}$/.test(value);
}

export function isQuoteArtworkPathname(pathname: string, draftId: string) {
	return (
		isValidQuoteDraftId(draftId) &&
		pathname.startsWith(`${quoteArtworkPrefix}${draftId}/`) &&
		/\.(jpe?g|png|pdf)$/i.test(pathname)
	);
}

function filenameFromPathname(pathname: string) {
	return decodeURIComponent(pathname.split('/').pop() || 'artwork');
}

export async function validateQuoteArtwork(pathname: string, draftId: string): Promise<QuoteArtwork> {
	if (!isQuoteArtworkPathname(pathname, draftId)) throw new Error('Artwork reference is invalid.');
	const blob = await head(pathname, quoteBlobOptions());
	if (!quoteArtworkTypes.includes(blob.contentType as (typeof quoteArtworkTypes)[number])) {
		throw new Error('Artwork type is not allowed.');
	}
	if (blob.size === 0 || blob.size > quoteArtworkMaxBytes) {
		throw new Error('Artwork is larger than the 4.5 MB limit.');
	}
	return { pathname: blob.pathname, filename: filenameFromPathname(blob.pathname), contentType: blob.contentType, size: blob.size };
}

function quoteRequestPathname(request: Pick<QuoteRequest, 'createdAt' | 'id'>) {
	return `${quoteRequestPrefix}${request.createdAt.slice(0, 10)}/${request.id}.json`;
}

function idempotencyPathname(key: string) {
	return `${quoteIdempotencyPrefix}${key}.json`;
}

export async function findQuoteByIdempotencyKey(key: string): Promise<QuoteRequest | null> {
	if (!/^[a-zA-Z0-9-]{16,100}$/.test(key)) return null;
	const marker = await get(idempotencyPathname(key), { ...quoteBlobOptions(), access: 'private' });
	if (!marker?.stream) return null;
	return (await new Response(marker.stream).json()) as QuoteRequest;
}

export async function storeQuoteRequest(request: QuoteRequest) {
	// A quote is first stored before notification, then stored again with its final
	// notification status. Named private Blobs require an explicit overwrite.
	const options = { ...quoteBlobOptions(), access: 'private' as const, addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' };
	await put(quoteRequestPathname(request), JSON.stringify(request), options);
	await put(idempotencyPathname(request.idempotencyKey), JSON.stringify(request), options);
}

export async function listRecentQuoteRequests(limit = 50): Promise<QuoteRequest[]> {
	const blobs = [] as Array<{ pathname: string }>;
	let cursor: string | undefined;
	do {
		const page = await list({ ...quoteBlobOptions(), prefix: quoteRequestPrefix, limit: 1000, cursor });
		blobs.push(...page.blobs);
		cursor = page.hasMore ? page.cursor : undefined;
	} while (cursor);
	const records = await Promise.all(blobs.map(async (blob) => {
		try {
			const result = await get(blob.pathname, { ...quoteBlobOptions(), access: 'private' });
			return result?.stream ? ((await new Response(result.stream).json()) as QuoteRequest) : null;
		} catch { return null; }
	}));
	return records.filter((record): record is QuoteRequest => record !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function getQuoteArtwork(pathname: string) {
	if (!pathname.startsWith(quoteArtworkPrefix)) return null;
	return get(pathname, { ...quoteBlobOptions(), access: 'private' });
}
