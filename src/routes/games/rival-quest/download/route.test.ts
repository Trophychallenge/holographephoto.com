import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RivalQuestConfiguration } from '$lib/products/rival-quest-builder';

const validConfig = {
	setting: 'pool',
	teamOne: 'dragons',
	teamTwo: 'unicorns',
	ageRange: 'ages-10-12',
	playerCount: '9-14',
	partyLength: 'full',
	partyName: 'Ava Pool Party'
} satisfies RivalQuestConfiguration;

const deliveryMock = vi.hoisted(() => ({
	verifyRivalQuestCheckoutSession: vi.fn()
}));

const pdfMock = vi.hoisted(() => ({
	generateRivalQuestPdf: vi.fn(),
	getRivalQuestPdfFilename: vi.fn()
}));

vi.mock('$lib/server/rival-quest-delivery', () => deliveryMock);

vi.mock('$lib/server/rival-quest-pdf', () => pdfMock);

describe('/games/rival-quest/download', () => {
	beforeEach(() => {
		deliveryMock.verifyRivalQuestCheckoutSession.mockReset();
		pdfMock.generateRivalQuestPdf.mockReset();
		pdfMock.getRivalQuestPdfFilename.mockReset();
	});

	it('rejects invalid sessions before generating a PDF', async () => {
		const { GET } = await import('./+server');
		deliveryMock.verifyRivalQuestCheckoutSession.mockResolvedValueOnce({
			ok: false,
			status: 402,
			message: 'This checkout session has not been paid yet.'
		});

		const response = await GET({
			fetch,
			url: new URL('https://holographephoto.com/games/rival-quest/download?session_id=cs_test_bad')
		} as Parameters<typeof GET>[0]);

		expect(response.status).toBe(402);
		expect(await response.text()).toBe('This checkout session has not been paid yet.');
		expect(pdfMock.generateRivalQuestPdf).not.toHaveBeenCalled();
	});

	it('returns a generated PDF with a safe attachment filename after verification', async () => {
		const { GET } = await import('./+server');
		deliveryMock.verifyRivalQuestCheckoutSession.mockResolvedValueOnce({
			ok: true,
			session: { id: 'cs_test_paid' },
			customerEmail: 'customer@example.com',
			config: validConfig
		});
		pdfMock.generateRivalQuestPdf.mockResolvedValueOnce(
			Uint8Array.from(Buffer.from('%PDF-1.7\nbody'))
		);
		pdfMock.getRivalQuestPdfFilename.mockReturnValueOnce(
			'Rival_Quest_Dragons_vs_Unicorns_Pool_Party.pdf'
		);

		const response = await GET({
			fetch,
			url: new URL('https://holographephoto.com/games/rival-quest/download?session_id=cs_test_paid')
		} as Parameters<typeof GET>[0]);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('application/pdf');
		expect(response.headers.get('content-disposition')).toBe(
			'attachment; filename="Rival_Quest_Dragons_vs_Unicorns_Pool_Party.pdf"'
		);
		expect(response.headers.get('cache-control')).toBe('private, no-store');
		expect(Buffer.from(await response.arrayBuffer()).toString('ascii')).toContain('%PDF-');
		expect(pdfMock.generateRivalQuestPdf).toHaveBeenCalledWith(validConfig);
	});
});
