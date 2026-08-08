import { inflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import type { RivalQuestConfiguration } from '$lib/products/rival-quest-builder';
import {
	generateRivalQuestPdf,
	getRivalQuestPdfFilename,
	getRivalQuestPdfPlan
} from './rival-quest-pdf';

const indoorDragonsWerewolves = {
	setting: 'indoor',
	teamOne: 'dragons',
	teamTwo: 'werewolves',
	ageRange: 'ages-4-6',
	playerCount: '4-8',
	partyLength: 'quick',
	partyName: 'Milo Birthday'
} satisfies RivalQuestConfiguration;

const outdoorUnicornsPrincesses = {
	setting: 'outdoor',
	teamOne: 'unicorns',
	teamTwo: 'princesses',
	ageRange: 'mixed',
	playerCount: '15-plus',
	partyLength: 'full',
	partyName: 'Friendship Quest'
} satisfies RivalQuestConfiguration;

const poolDragonsUnicorns = {
	setting: 'pool',
	teamOne: 'dragons',
	teamTwo: 'unicorns',
	ageRange: 'ages-10-12',
	playerCount: '9-14',
	partyLength: 'full',
	partyName: 'Ava <Pool> Party'
} satisfies RivalQuestConfiguration;

async function inspectPdf(config: RivalQuestConfiguration) {
	const bytes = await generateRivalQuestPdf(config);
	const text = extractPdfText(bytes);
	const loaded = await PDFDocument.load(bytes);
	return { bytes, text, loaded };
}

function extractPdfText(bytes: Uint8Array) {
	const raw = Buffer.from(bytes).toString('latin1');
	const parts: string[] = [raw];
	const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
	let match: RegExpExecArray | null;
	while ((match = streamPattern.exec(raw))) {
		try {
			const inflated = inflateSync(Buffer.from(match[1], 'latin1')).toString('latin1');
			parts.push(inflated, decodePdfHexText(inflated));
		} catch {
			parts.push(match[1]);
		}
	}
	return parts.join('\n');
}

function decodePdfHexText(value: string) {
	const decoded: string[] = [];
	const hexTextPattern = /<([0-9A-Fa-f]+)>\s*Tj/g;
	let match: RegExpExecArray | null;
	while ((match = hexTextPattern.exec(value))) {
		decoded.push(Buffer.from(match[1], 'hex').toString('latin1'));
	}
	return decoded.join('\n');
}

describe('Rival Quest PDF generation', () => {
	it('generates a valid 9-page Indoor Dragons vs. Werewolves PDF', async () => {
		const { bytes, text, loaded } = await inspectPdf(indoorDragonsWerewolves);

		expect(Buffer.from(bytes.subarray(0, 5)).toString('ascii')).toBe('%PDF-');
		expect(loaded.getPageCount()).toBe(9);
		expect(text).toContain('Indoor Party');
		expect(text).toContain('Dragon Clan');
		expect(text).toContain('Werewolf Pack');
		expect(text).toContain('avoid unsafe running');
		expect(text).toContain('adult helpers');
		expect(text).toContain('Small party mode');
		expect(text).toContain('Milo Birthday');
		expect(text).not.toContain('Unicorn Herd');
		expect(text).not.toContain('Princess Court');
		expect(text).not.toContain('Pool Party');
	});

	it('generates a valid Outdoor Unicorns vs. Princesses PDF with full quest content', async () => {
		const { text, loaded } = await inspectPdf(outdoorUnicornsPrincesses);

		expect(loaded.getPageCount()).toBe(9);
		expect(text).toContain('Outdoor Adventure');
		expect(text).toContain('Unicorn Herd');
		expect(text).toContain('Princess Court');
		expect(text).toContain('adult-set boundary');
		expect(text).toContain('Large party mode');
		expect(text).toContain('Pair older and younger players');
		expect(text).toContain('Weather Wise');
		expect(text).not.toContain('Dragon Clan');
		expect(text).not.toContain('Werewolf Pack');
		expect(text).not.toContain('Poolside Color Clues');
	});

	it('generates a valid Pool Dragons vs. Unicorns PDF with water safety language', async () => {
		const { text, loaded } = await inspectPdf(poolDragonsUnicorns);

		expect(loaded.getPageCount()).toBe(9);
		expect(text).toContain('Pool Party');
		expect(text).toContain('Dragon Clan');
		expect(text).toContain('Unicorn Herd');
		expect(text).toContain('breath-holding contests');
		expect(text).toContain('forced submersion');
		expect(text).toContain('active adult water supervision');
		expect(text).toContain('slightly longer planning moments');
		expect(text).toContain('Standard party mode');
		expect(text).toContain('Ava Pool Party');
		expect(text).not.toContain('<Pool>');
		expect(text).not.toContain('Princess Court');
	});

	it('uses fewer challenges for Quick Quest than Full Quest', () => {
		const quick = getRivalQuestPdfPlan({ ...indoorDragonsWerewolves, partyLength: 'quick' });
		const full = getRivalQuestPdfPlan({ ...indoorDragonsWerewolves, partyLength: 'full' });

		expect(quick.challenges).toHaveLength(3);
		expect(full.challenges).toHaveLength(6);
		expect(full.challenges.map((challenge) => challenge.title)).toContain('Kindness Spell');
		expect(quick.challenges.map((challenge) => challenge.title)).not.toContain('Kindness Spell');
	});

	it('builds safe PDF filenames without email or free-form party names', () => {
		expect(getRivalQuestPdfFilename(poolDragonsUnicorns)).toBe(
			'Rival_Quest_Dragons_vs_Unicorns_Pool_Party.pdf'
		);
		expect(getRivalQuestPdfFilename(outdoorUnicornsPrincesses)).toBe(
			'Rival_Quest_Unicorns_vs_Princesses_Outdoor_Party.pdf'
		);
		expect(getRivalQuestPdfFilename(poolDragonsUnicorns)).not.toContain('Ava');
	});

	it('rejects invalid configuration before planning or generation', () => {
		expect(() => getRivalQuestPdfPlan({ ...poolDragonsUnicorns, teamTwo: 'dragons' })).toThrow(
			/Choose two different teams/
		);
		expect(() =>
			getRivalQuestPdfPlan({ ...poolDragonsUnicorns, setting: 'space' as never })
		).toThrow(/Choose a valid quest setting/);
		expect(() =>
			getRivalQuestPdfPlan({ ...poolDragonsUnicorns, partyName: 'A'.repeat(141) })
		).toThrow(/Party name is too long/);
		expect(
			getRivalQuestPdfPlan({ ...poolDragonsUnicorns, partyName: 'A'.repeat(81) }).config.partyName
		).toHaveLength(60);
	});
});
