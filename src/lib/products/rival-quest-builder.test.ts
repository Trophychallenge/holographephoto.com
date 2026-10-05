import { describe, expect, it } from 'vitest';
import {
	getRivalQuestMetadata,
	getRivalQuestSummary,
	parseRivalQuestConfiguration,
	parseRivalQuestMetadata,
	rivalQuestSettings,
	rivalQuestTeams
} from './rival-quest-builder';

const validInput = {
	setting: 'pool',
	team_one: 'unicorns',
	team_two: 'dragons',
	age_range: 'ages-7-9',
	player_count: '9-14',
	party_length: 'full',
	party_name: '  Ava <Birthday> Bash  '
};

describe('Rival Quest builder configuration', () => {
	it('parses a valid configuration and sanitizes the optional party name', () => {
		const result = parseRivalQuestConfiguration(validInput);

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.config).toMatchObject({
				setting: 'pool',
				teamOne: 'unicorns',
				teamTwo: 'dragons',
				partyName: 'Ava Birthday Bash'
			});
			expect(getRivalQuestSummary(result.config)).toBe(
				'Unicorn Herd vs. Dragon Clan - Pool Party Edition'
			);
		}
	});

	it('length-limits normal party names and rejects excessive payloads', () => {
		const normalLongName = parseRivalQuestConfiguration({
			...validInput,
			party_name: 'A'.repeat(80)
		});
		expect(normalLongName.ok).toBe(true);
		if (normalLongName.ok) expect(normalLongName.config.partyName).toHaveLength(60);

		const excessive = parseRivalQuestConfiguration({
			...validInput,
			party_name: 'A'.repeat(141)
		});
		expect(excessive).toMatchObject({ ok: false });
	});

	it('rejects invalid settings, teams, age ranges, player counts, and party lengths', () => {
		for (const [key, value] of [
			['setting', 'space-station'],
			['team_one', 'robots'],
			['team_two', 'robots'],
			['age_range', 'teen'],
			['player_count', '100'],
			['party_length', 'all-day']
		]) {
			expect(parseRivalQuestConfiguration({ ...validInput, [key]: value }).ok).toBe(false);
		}
	});

	it('rejects duplicate teams', () => {
		expect(
			parseRivalQuestConfiguration({
				...validInput,
				team_one: 'dragons',
				team_two: 'dragons'
			})
		).toMatchObject({ ok: false, message: 'Choose two different teams.' });
	});

	it('accepts every MVP setting and valid ordered team pairing', () => {
		for (const setting of Object.keys(rivalQuestSettings)) {
			for (const teamOne of Object.keys(rivalQuestTeams)) {
				for (const teamTwo of Object.keys(rivalQuestTeams)) {
					const result = parseRivalQuestConfiguration({
						...validInput,
						setting,
						team_one: teamOne,
						team_two: teamTwo
					});

					expect(result.ok).toBe(teamOne !== teamTwo);
				}
			}
		}
	});

	it('serializes and reconstructs trusted Stripe metadata', () => {
		const parsed = parseRivalQuestConfiguration(validInput);
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;

		const metadata = getRivalQuestMetadata(parsed.config);
		expect(metadata).toMatchObject({
			builder_version: 'party-builder-mvp-1',
			setting: 'pool',
			team_one: 'unicorns',
			team_two: 'dragons',
			configuration_summary: 'Unicorn Herd vs. Dragon Clan - Pool Party Edition'
		});

		const reconstructed = parseRivalQuestMetadata(metadata);
		expect(reconstructed).toEqual(parsed);
	});

	it('exposes selected-setting and selected-team content modules', () => {
		expect(rivalQuestSettings.pool.safety).toContain('breath-holding');
		expect(rivalQuestSettings.pool.safety).toContain('active adult water supervision');
		expect(rivalQuestSettings.indoor.safety).toContain('climbing furniture');
		expect(rivalQuestSettings.outdoor.safety).toContain('adult-set boundaries');
		expect(rivalQuestTeams.unicorns.teamName).toBe('Unicorn Herd');
		expect(rivalQuestTeams.princesses.teamName).toBe('Princess Court');
	});
});
