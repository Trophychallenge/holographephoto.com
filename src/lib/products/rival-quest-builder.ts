export const rivalQuestBuilderVersion = 'party-builder-mvp-1';

export const rivalQuestSettings = {
	indoor: {
		id: 'indoor',
		label: 'Indoor Party',
		editionLabel: 'Indoor Party Edition',
		icon: 'Castle',
		color: '#ffcf6b',
		description: 'Cozy quests for living rooms, party rooms, classrooms, and rainy-day magic.',
		parentGuide:
			'Set a clear play zone, move breakables, balance quiet clues with silly performances, and skip any activity that needs running, climbing, or throwing hard objects.',
		challenges: [
			'Act out a brave creature pose while your team guesses.',
			'Find three soft or paper treasures hidden by an adult.',
			'Build a tiny team chant in ten words or fewer.',
			'Solve a riddle from the Quest Master before the timer ends.'
		],
		safety:
			'Indoor quests avoid unsafe running, climbing furniture, throwing hard objects, and damaging the home.'
	},
	outdoor: {
		id: 'outdoor',
		label: 'Outdoor Adventure',
		editionLabel: 'Outdoor Adventure Edition',
		icon: 'Trail',
		color: '#78d98f',
		description: 'Fresh-air quests with boundaries, scavenger clues, teamwork, and movement.',
		parentGuide:
			'Mark the party boundaries, review weather and heat, keep adults posted at edges, and use observation prompts instead of collecting plants or disturbing animals.',
		challenges: [
			'Spot something shaped like a shield without picking it up.',
			'Complete a gentle team relay inside the adult-set boundary.',
			'Create a nature sound pattern for the other team to copy.',
			'Find a safe landmark chosen by the Quest Master.'
		],
		safety:
			'Outdoor quests must stay inside adult-set boundaries and avoid roads, traffic, heat risk, unsafe weather, plant damage, and disturbing animals.'
	},
	pool: {
		id: 'pool',
		label: 'Pool Party',
		editionLabel: 'Pool Party Edition',
		icon: 'Splash',
		color: '#70d9ff',
		description: 'Water-safe quests with dry-land options and active adult supervision.',
		parentGuide:
			'Keep active adult water supervision in place at all times, separate swimmers by ability, offer dry-land alternatives, and stop play immediately for running, rough play, dunking, or unsafe jumping.',
		challenges: [
			'Pass a floating token across the shallow area with adult approval.',
			'Design a dry-land victory pose before entering the water.',
			'Collect poolside color clues without running.',
			'Cheer for a teammate completing a safe, adult-approved water task.'
		],
		safety:
			'Pool quests never include breath-holding contests, forced submersion, dunking, running on wet surfaces, dangerous diving, rough play, or unsupervised water play. The game never replaces active adult water supervision.'
	}
} as const;

export const rivalQuestTeams = {
	dragons: {
		id: 'dragons',
		label: 'Dragons',
		teamName: 'Dragon Clan',
		icon: 'Flame',
		color: '#ff8a50',
		description: 'Bold, warm-hearted treasure guardians.'
	},
	werewolves: {
		id: 'werewolves',
		label: 'Werewolves',
		teamName: 'Werewolf Pack',
		icon: 'Moon',
		color: '#b7c8ff',
		description: 'Loyal moonlit teammates with big playful energy.'
	},
	unicorns: {
		id: 'unicorns',
		label: 'Unicorns',
		teamName: 'Unicorn Herd',
		icon: 'Sparkle',
		color: '#ff9fe2',
		description: 'Sparkly problem-solvers with kindness magic.'
	},
	princesses: {
		id: 'princesses',
		label: 'Princesses',
		teamName: 'Princess Court',
		icon: 'Crown',
		color: '#ffd166',
		description: 'Royal quest leaders who celebrate courage and friendship.'
	}
} as const;

export const rivalQuestAgeRanges = {
	'ages-4-6': 'Ages 4-6',
	'ages-7-9': 'Ages 7-9',
	'ages-10-12': 'Ages 10-12',
	mixed: 'Mixed ages'
} as const;

export const rivalQuestPlayerCounts = {
	'4-8': '4-8',
	'9-14': '9-14',
	'15-plus': '15+'
} as const;

export const rivalQuestPartyLengths = {
	quick: 'Quick Quest, approximately 20-30 minutes',
	full: 'Full Quest, approximately 45-60 minutes'
} as const;

export type RivalQuestSettingId = keyof typeof rivalQuestSettings;
export type RivalQuestTeamId = keyof typeof rivalQuestTeams;
export type RivalQuestAgeRangeId = keyof typeof rivalQuestAgeRanges;
export type RivalQuestPlayerCountId = keyof typeof rivalQuestPlayerCounts;
export type RivalQuestPartyLengthId = keyof typeof rivalQuestPartyLengths;

export type RivalQuestConfiguration = {
	setting: RivalQuestSettingId;
	teamOne: RivalQuestTeamId;
	teamTwo: RivalQuestTeamId;
	ageRange: RivalQuestAgeRangeId;
	playerCount: RivalQuestPlayerCountId;
	partyLength: RivalQuestPartyLengthId;
	partyName: string;
};

export type RivalQuestConfigurationResult =
	| {
			ok: true;
			config: RivalQuestConfiguration;
	  }
	| {
			ok: false;
			message: string;
	  };

const PARTY_NAME_MAX_LENGTH = 60;
const PARTY_NAME_REJECT_LENGTH = 140;

function hasOwn<T extends object>(object: T, key: string): key is Extract<keyof T, string> {
	return Object.prototype.hasOwnProperty.call(object, key);
}

export function sanitizeRivalQuestPartyName(value: unknown) {
	return String(value ?? '')
		.replace(/[<>]/g, '')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, PARTY_NAME_MAX_LENGTH);
}

export function parseRivalQuestConfiguration(
	input: Record<string, FormDataEntryValue | string | undefined>
): RivalQuestConfigurationResult {
	const setting = String(input.setting ?? '');
	const teamOne = String(input.team_one ?? '');
	const teamTwo = String(input.team_two ?? '');
	const ageRange = String(input.age_range ?? '');
	const playerCount = String(input.player_count ?? '');
	const partyLength = String(input.party_length ?? '');
	const rawPartyName = String(input.party_name ?? '');
	const partyName = sanitizeRivalQuestPartyName(rawPartyName);

	if (rawPartyName.length > PARTY_NAME_REJECT_LENGTH) {
		return { ok: false, message: 'Party name is too long.' };
	}

	if (!hasOwn(rivalQuestSettings, setting)) {
		return { ok: false, message: 'Choose a valid quest setting.' };
	}

	if (!hasOwn(rivalQuestTeams, teamOne) || !hasOwn(rivalQuestTeams, teamTwo)) {
		return { ok: false, message: 'Choose two valid quest teams.' };
	}

	if (teamOne === teamTwo) {
		return { ok: false, message: 'Choose two different teams.' };
	}

	if (!hasOwn(rivalQuestAgeRanges, ageRange)) {
		return { ok: false, message: 'Choose a valid age range.' };
	}

	if (!hasOwn(rivalQuestPlayerCounts, playerCount)) {
		return { ok: false, message: 'Choose a valid player count.' };
	}

	if (!hasOwn(rivalQuestPartyLengths, partyLength)) {
		return { ok: false, message: 'Choose a valid party length.' };
	}

	return {
		ok: true,
		config: {
			setting,
			teamOne,
			teamTwo,
			ageRange,
			playerCount,
			partyLength,
			partyName
		}
	};
}

export function getRivalQuestSummary(config: RivalQuestConfiguration) {
	return `${rivalQuestTeams[config.teamOne].teamName} vs. ${
		rivalQuestTeams[config.teamTwo].teamName
	} - ${rivalQuestSettings[config.setting].editionLabel}`;
}

export function getRivalQuestMetadata(config: RivalQuestConfiguration) {
	return {
		builder_version: rivalQuestBuilderVersion,
		setting: config.setting,
		team_one: config.teamOne,
		team_two: config.teamTwo,
		age_range: config.ageRange,
		player_count: config.playerCount,
		party_length: config.partyLength,
		party_name: config.partyName,
		configuration_summary: getRivalQuestSummary(config)
	};
}

export function parseRivalQuestMetadata(metadata: Record<string, string> | undefined) {
	if (!metadata) {
		return { ok: false, message: 'This checkout session is missing Rival Quest details.' } as const;
	}

	return parseRivalQuestConfiguration({
		setting: metadata.setting,
		team_one: metadata.team_one,
		team_two: metadata.team_two,
		age_range: metadata.age_range,
		player_count: metadata.player_count,
		party_length: metadata.party_length,
		party_name: metadata.party_name
	});
}

export const rivalQuestPrintableSections = [
	'Cover page with selected matchup, setting, and optional party name',
	'Five-minute setup page',
	'One laminated parent table guide for the selected setting',
	'Team cards for Team One',
	'Team cards for Team Two',
	'Matching treasure tokens',
	'Score sheet and celebration honors',
	'Two team signs',
	'Short print guide'
] as const;
