import { beforeEach, describe, expect, it, vi } from 'vitest';

const blobMock = vi.hoisted(() => ({
	get: vi.fn(),
	head: vi.fn(),
	list: vi.fn(),
	put: vi.fn()
}));

vi.mock('$env/dynamic/private', () => ({ env: process.env }));
vi.mock('@vercel/blob', () => blobMock);

import {
	listRecentQuoteRequests,
	quoteArtworkMaxBytes,
	storeQuoteRequest,
	validateQuoteArtwork
} from './quotes';

describe('private quote storage', () => {
	beforeEach(() => {
		process.env.QUOTE_BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_dedicated_quote_store';
		blobMock.get.mockReset();
		blobMock.head.mockReset();
		blobMock.list.mockReset();
		blobMock.put.mockReset();
	});

	it('uses Blob metadata instead of browser-provided attachment metadata', async () => {
		blobMock.head.mockResolvedValue({
			pathname: 'quotes/artwork/12345678-abcd/brand-card.pdf',
			contentType: 'application/pdf',
			size: 321
		});

		await expect(
			validateQuoteArtwork('quotes/artwork/12345678-abcd/brand-card.pdf', '12345678-abcd')
		).resolves.toEqual({
			pathname: 'quotes/artwork/12345678-abcd/brand-card.pdf',
			filename: 'brand-card.pdf',
			contentType: 'application/pdf',
			size: 321
		});
		expect(blobMock.head).toHaveBeenCalledWith(
			'quotes/artwork/12345678-abcd/brand-card.pdf',
			expect.objectContaining({ token: process.env.QUOTE_BLOB_READ_WRITE_TOKEN })
		);
	});

	it('rejects an oversized object even if the browser described it as valid', async () => {
		blobMock.head.mockResolvedValue({
			pathname: 'quotes/artwork/12345678-abcd/brand-card.png',
			contentType: 'image/png',
			size: quoteArtworkMaxBytes + 1
		});
		await expect(
			validateQuoteArtwork('quotes/artwork/12345678-abcd/brand-card.png', '12345678-abcd')
		).rejects.toThrow('4.5 MB');
	});

	it('reads all pages before sorting newest quote requests', async () => {
		blobMock.list
			.mockResolvedValueOnce({ blobs: [{ pathname: 'quotes/requests/old.json' }], hasMore: true, cursor: 'next' })
			.mockResolvedValueOnce({ blobs: [{ pathname: 'quotes/requests/new.json' }], hasMore: false });
		blobMock.get
			.mockResolvedValueOnce({ stream: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(JSON.stringify({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z' }))); c.close(); } }) })
			.mockResolvedValueOnce({ stream: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(JSON.stringify({ id: 'new', createdAt: '2026-02-01T00:00:00.000Z' }))); c.close(); } }) });

		const requests = await listRecentQuoteRequests(1);
		expect(requests.map((request) => request.id)).toEqual(['new']);
		expect(blobMock.list).toHaveBeenCalledTimes(2);
	});

	it('allows a quote record to be overwritten when notification status changes', async () => {
		await storeQuoteRequest({
			id: 'test-quote', createdAt: '2026-10-05T00:00:00.000Z', name: 'Test', email: 'test@example.invalid',
			businessName: 'Test business', quantity: '50', websiteOrQr: '', neededBy: '', designNotes: '',
			artwork: null, emailNotification: 'sent', idempotencyKey: '12345678-1234-1234-1234-123456789012'
		});
		expect(blobMock.put).toHaveBeenCalledTimes(2);
		expect(blobMock.put).toHaveBeenCalledWith(
			expect.any(String), expect.any(String), expect.objectContaining({ allowOverwrite: true })
		);
	});
});
