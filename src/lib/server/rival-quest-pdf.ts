import { StandardFonts, type PDFFont, type PDFPage, PDFDocument, rgb } from 'pdf-lib';
import {
	getRivalQuestSummary,
	parseRivalQuestConfiguration,
	rivalQuestAgeRanges,
	rivalQuestPartyLengths,
	rivalQuestPlayerCounts,
	rivalQuestSettings,
	rivalQuestTeams,
	type RivalQuestConfiguration,
	type RivalQuestSettingId,
	type RivalQuestTeamId
} from '$lib/products/rival-quest-builder';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 44;

type Fonts = {
	regular: PDFFont;
	bold: PDFFont;
	serif: PDFFont;
};

type PdfContext = {
	pdf: PDFDocument;
	fonts: Fonts;
	config: RivalQuestConfiguration;
};

type Challenge = {
	title: string;
	body: string;
};

const coreRules = [
	'Divide children into two friendly rival teams.',
	'Children earn treasure coins for teamwork, kindness, creativity, participation, and completing challenges.',
	'Adults may award coins for kindness, creativity, bravery, inclusion, and good sportsmanship.',
	'No pushing, hitting, dangerous behavior, cruel teasing, or exclusion.',
	'The finale celebrates both teams. The real victory is teamwork, kindness, and making good memories.'
];

const ageAdaptations = {
	'ages-4-6':
		'Use short prompts, simple choices, and adult helpers. Keep turns brief and celebrate effort.',
	'ages-7-9': 'Use standard challenge wording with clear boundaries and quick team huddles.',
	'ages-10-12': 'Add strategy, riddles, creative leadership, and slightly longer planning moments.',
	mixed: 'Pair older and younger players so every challenge has a helper role and a spotlight role.'
} as const;

const playerAdaptations = {
	'4-8': 'Small party mode: keep one adult guide nearby and let each child take frequent turns.',
	'9-14': 'Standard party mode: rotate speakers, seekers, runners, and score helpers.',
	'15-plus':
		'Large party mode: assign helpers or team captains and rotate participation so every child is included.'
} as const;

const settingChallenges: Record<RivalQuestSettingId, { quick: Challenge[]; full: Challenge[] }> = {
	indoor: {
		quick: [
			{
				title: 'Silent Creature Pose',
				body: 'One player poses like a friendly quest creature while the team guesses.'
			},
			{
				title: 'Riddle Door',
				body: 'The Quest Master reads a short riddle. Teams earn coins for kind teamwork.'
			},
			{
				title: 'Soft Treasure Search',
				body: 'Find adult-hidden paper or soft treasures without running or moving furniture.'
			}
		],
		full: [
			{
				title: 'Silent Creature Pose',
				body: 'One player poses like a friendly quest creature while the team guesses.'
			},
			{
				title: 'Riddle Door',
				body: 'The Quest Master reads a short riddle. Teams earn coins for kind teamwork.'
			},
			{
				title: 'Soft Treasure Search',
				body: 'Find adult-hidden paper or soft treasures without running or moving furniture.'
			},
			{
				title: 'Royal Announcement',
				body: 'Teams perform a ten-second announcement inviting everyone into the quest.'
			},
			{
				title: 'Tabletop Map',
				body: 'Build a pretend map with paper pieces, then explain the safest route.'
			},
			{
				title: 'Kindness Spell',
				body: 'Each team names one kind action another player did during the party.'
			}
		]
	},
	outdoor: {
		quick: [
			{
				title: 'Boundary Beacon',
				body: 'Walk the adult-set boundary together and name safe places to play.'
			},
			{
				title: 'Nature Shape Hunt',
				body: 'Spot shapes or colors without picking plants, entering roads, or disturbing animals.'
			},
			{
				title: 'Gentle Relay',
				body: 'Complete a short relay inside the party area with a lower-movement helper role.'
			}
		],
		full: [
			{
				title: 'Boundary Beacon',
				body: 'Walk the adult-set boundary together and name safe places to play.'
			},
			{
				title: 'Nature Shape Hunt',
				body: 'Spot shapes or colors without picking plants, entering roads, or disturbing animals.'
			},
			{
				title: 'Gentle Relay',
				body: 'Complete a short relay inside the party area with a lower-movement helper role.'
			},
			{
				title: 'Weather Wise',
				body: 'Teams choose a shade, water, or rest strategy before the next challenge.'
			},
			{
				title: 'Trail Echo',
				body: 'Create a clap pattern or chant that the other team can copy.'
			},
			{
				title: 'Landmark Clue',
				body: 'Find a Quest Master-approved landmark without leaving the party area.'
			}
		]
	},
	pool: {
		quick: [
			{
				title: 'Water Watcher Check',
				body: 'Name the adult water watchers before any pool activity begins.'
			},
			{
				title: 'Dry-Land Victory Pose',
				body: 'Teams create a cheer or pose on dry land for players who do not swim.'
			},
			{
				title: 'Safe Float Pass',
				body: 'With adult approval, pass a floating token in shallow water or complete it poolside.'
			}
		],
		full: [
			{
				title: 'Water Watcher Check',
				body: 'Name the adult water watchers before any pool activity begins.'
			},
			{
				title: 'Dry-Land Victory Pose',
				body: 'Teams create a cheer or pose on dry land for players who do not swim.'
			},
			{
				title: 'Safe Float Pass',
				body: 'With adult approval, pass a floating token in shallow water or complete it poolside.'
			},
			{
				title: 'Poolside Color Clues',
				body: 'Find colors from a walking path only. No running on wet surfaces.'
			},
			{
				title: 'Kindness Lifeguard',
				body: 'Award coins when teammates include cautious swimmers and offer dry-land choices.'
			},
			{
				title: 'Splash-Free Strategy',
				body: 'Plan a safe route or cheer without dunking, rough play, diving, or breath-holding.'
			}
		]
	}
};

function cleanText(value: string) {
	return Array.from(value)
		.map((char) => {
			const code = char.charCodeAt(0);
			return code < 32 || code === 127 ? ' ' : char;
		})
		.join('')
		.replace(/\s+/g, ' ')
		.trim();
}

function titleCaseId(value: string) {
	return value
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('_');
}

export function getRivalQuestPdfFilename(config: RivalQuestConfiguration) {
	const teamOne = titleCaseId(config.teamOne);
	const teamTwo = titleCaseId(config.teamTwo);
	const setting = titleCaseId(config.setting);
	return `Rival_Quest_${teamOne}_vs_${teamTwo}_${setting}_Party.pdf`;
}

export function getRivalQuestPdfPlan(config: RivalQuestConfiguration) {
	const parsed = parseRivalQuestConfiguration({
		setting: config.setting,
		team_one: config.teamOne,
		team_two: config.teamTwo,
		age_range: config.ageRange,
		player_count: config.playerCount,
		party_length: config.partyLength,
		party_name: config.partyName
	});
	if (!parsed.ok) throw new Error(parsed.message);

	return {
		config: parsed.config,
		setting: rivalQuestSettings[parsed.config.setting],
		teamOne: rivalQuestTeams[parsed.config.teamOne],
		teamTwo: rivalQuestTeams[parsed.config.teamTwo],
		challenges: settingChallenges[parsed.config.setting][parsed.config.partyLength],
		ageNote: ageAdaptations[parsed.config.ageRange],
		playerNote: playerAdaptations[parsed.config.playerCount],
		summary: getRivalQuestSummary(parsed.config)
	};
}

function colorFromHex(hex: string) {
	const value = hex.replace('#', '');
	const red = Number.parseInt(value.slice(0, 2), 16) / 255;
	const green = Number.parseInt(value.slice(2, 4), 16) / 255;
	const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
	return rgb(red, green, blue);
}

function addPage(ctx: PdfContext) {
	const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
	page.drawRectangle({
		x: 0,
		y: 0,
		width: PAGE_WIDTH,
		height: PAGE_HEIGHT,
		color: rgb(1, 0.985, 0.94)
	});
	return page;
}

function drawText(
	page: PDFPage,
	text: string,
	options: {
		x: number;
		y: number;
		size: number;
		font: PDFFont;
		color?: ReturnType<typeof rgb>;
		maxWidth?: number;
		lineHeight?: number;
	}
) {
	const color = options.color ?? rgb(0.16, 0.13, 0.22);
	if (!options.maxWidth) {
		page.drawText(cleanText(text), { ...options, color });
		return options.y - (options.lineHeight ?? options.size + 4);
	}

	const words = cleanText(text).split(' ');
	const lines: string[] = [];
	let current = '';
	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (options.font.widthOfTextAtSize(next, options.size) <= options.maxWidth) {
			current = next;
		} else {
			if (current) lines.push(current);
			current = word;
		}
	}
	if (current) lines.push(current);

	const lineHeight = options.lineHeight ?? options.size + 5;
	let y = options.y;
	for (const line of lines) {
		page.drawText(line, { x: options.x, y, size: options.size, font: options.font, color });
		y -= lineHeight;
	}
	return y;
}

function drawPageTitle(page: PDFPage, ctx: PdfContext, eyebrow: string, title: string) {
	page.drawRectangle({
		x: 0,
		y: PAGE_HEIGHT - 96,
		width: PAGE_WIDTH,
		height: 96,
		color: rgb(0.2, 0.16, 0.32)
	});
	page.drawText(eyebrow.toUpperCase(), {
		x: MARGIN,
		y: PAGE_HEIGHT - 38,
		size: 9,
		font: ctx.fonts.bold,
		color: rgb(1, 0.82, 0.42)
	});
	page.drawText(title, {
		x: MARGIN,
		y: PAGE_HEIGHT - 72,
		size: 24,
		font: ctx.fonts.serif,
		color: rgb(1, 0.985, 0.94)
	});
}

function drawBadge(
	page: PDFPage,
	ctx: PdfContext,
	text: string,
	x: number,
	y: number,
	width: number
) {
	page.drawRectangle({
		x,
		y,
		width,
		height: 28,
		color: rgb(1, 1, 1),
		borderColor: rgb(0.83, 0.78, 0.68),
		borderWidth: 1
	});
	page.drawText(cleanText(text), {
		x: x + 10,
		y: y + 9,
		size: 9,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});
}

function drawList(
	page: PDFPage,
	ctx: PdfContext,
	items: string[],
	x: number,
	y: number,
	maxWidth: number
) {
	let cursor = y;
	for (const item of items) {
		page.drawCircle({ x: x + 5, y: cursor + 5, size: 3, color: rgb(1, 0.58, 0.35) });
		cursor = drawText(page, item, {
			x: x + 18,
			y: cursor,
			size: 10,
			font: ctx.fonts.regular,
			maxWidth,
			lineHeight: 14
		});
		cursor -= 4;
	}
	return cursor;
}

function drawCutLines(page: PDFPage, x: number, y: number, width: number, height: number) {
	page.drawRectangle({
		x,
		y,
		width,
		height,
		borderColor: rgb(0.55, 0.5, 0.48),
		borderWidth: 0.75,
		borderDashArray: [6, 4]
	});
}

function drawTeamEmblem(
	page: PDFPage,
	ctx: PdfContext,
	teamId: RivalQuestTeamId,
	x: number,
	y: number
) {
	const team = rivalQuestTeams[teamId];
	const accent = colorFromHex(team.color);
	page.drawCircle({ x: x + 34, y: y + 34, size: 34, color: accent });
	page.drawCircle({
		x: x + 34,
		y: y + 34,
		size: 23,
		color: rgb(1, 0.985, 0.94),
		borderColor: rgb(0.2, 0.16, 0.32),
		borderWidth: 1
	});
	page.drawText(team.icon, {
		x: x + 13,
		y: y + 29,
		size: 11,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});
}

function drawCover(ctx: PdfContext) {
	const plan = getRivalQuestPdfPlan(ctx.config);
	const page = addPage(ctx);
	const settingColor = colorFromHex(plan.setting.color);
	page.drawRectangle({
		x: 0,
		y: PAGE_HEIGHT - 220,
		width: PAGE_WIDTH,
		height: 220,
		color: settingColor
	});
	page.drawRectangle({
		x: 0,
		y: PAGE_HEIGHT - 220,
		width: PAGE_WIDTH,
		height: 220,
		color: rgb(0.2, 0.16, 0.32),
		opacity: 0.18
	});
	page.drawText('Rival Quest', {
		x: MARGIN,
		y: PAGE_HEIGHT - 84,
		size: 46,
		font: ctx.fonts.serif,
		color: rgb(1, 0.985, 0.94)
	});
	page.drawText(`${plan.teamOne.teamName} vs. ${plan.teamTwo.teamName}`, {
		x: MARGIN,
		y: PAGE_HEIGHT - 128,
		size: 25,
		font: ctx.fonts.bold,
		color: rgb(1, 0.985, 0.94)
	});
	page.drawText(plan.setting.editionLabel, {
		x: MARGIN,
		y: PAGE_HEIGHT - 162,
		size: 18,
		font: ctx.fonts.bold,
		color: rgb(1, 0.985, 0.94)
	});

	drawTeamEmblem(page, ctx, ctx.config.teamOne, 118, 462);
	drawTeamEmblem(page, ctx, ctx.config.teamTwo, 426, 462);
	page.drawText('VS', {
		x: 290,
		y: 494,
		size: 20,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});

	let y = 412;
	if (ctx.config.partyName) {
		y = drawText(page, cleanText(ctx.config.partyName), {
			x: MARGIN,
			y,
			size: 22,
			font: ctx.fonts.serif,
			maxWidth: PAGE_WIDTH - MARGIN * 2,
			lineHeight: 27
		});
		y -= 12;
	}
	drawBadge(page, ctx, rivalQuestAgeRanges[ctx.config.ageRange], MARGIN, y, 112);
	drawBadge(
		page,
		ctx,
		`${rivalQuestPlayerCounts[ctx.config.playerCount]} players`,
		MARGIN + 126,
		y,
		116
	);
	drawBadge(page, ctx, rivalQuestPartyLengths[ctx.config.partyLength], MARGIN + 256, y, 250);

	y -= 50;
	drawText(
		page,
		'A friendly rivals printable party game about teamwork, kindness, creativity, and good memories.',
		{
			x: MARGIN,
			y,
			size: 14,
			font: ctx.fonts.regular,
			maxWidth: PAGE_WIDTH - MARGIN * 2,
			lineHeight: 20
		}
	);
}

function drawSetup(ctx: PdfContext) {
	const page = addPage(ctx);
	drawPageTitle(page, ctx, 'Five-minute setup', 'Start the quest quickly');
	drawList(
		page,
		ctx,
		[
			'Print only the pages your host needs for this party.',
			`Divide players into ${rivalQuestTeams[ctx.config.teamOne].teamName} and ${
				rivalQuestTeams[ctx.config.teamTwo].teamName
			}.`,
			'Place team signs where players can gather safely.',
			'Give adults the Parent Table Guide and review the safety notes.',
			'Cut or prepare treasure tokens before guests arrive.',
			'Begin with a short welcome, then choose challenges from the guide.',
			'Celebrate both teams at the finale.'
		],
		MARGIN,
		650,
		480
	);
}

function drawParentGuide(ctx: PdfContext) {
	const plan = getRivalQuestPdfPlan(ctx.config);
	const page = addPage(ctx);
	drawPageTitle(page, ctx, 'Laminated parent table guide', plan.setting.label);
	let y = 650;
	y = drawText(page, plan.setting.parentGuide, {
		x: MARGIN,
		y,
		size: 11,
		font: ctx.fonts.bold,
		maxWidth: 510,
		lineHeight: 16
	});
	y -= 10;
	page.drawText('Core Rules', {
		x: MARGIN,
		y,
		size: 15,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});
	y = drawList(page, ctx, coreRules, MARGIN, y - 22, 490);
	y -= 6;
	page.drawText('Safety Rules', {
		x: MARGIN,
		y,
		size: 15,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});
	y = drawText(page, plan.setting.safety, {
		x: MARGIN,
		y: y - 22,
		size: 10,
		font: ctx.fonts.regular,
		maxWidth: 500,
		lineHeight: 14
	});
	y -= 10;
	page.drawText('Party Fit', {
		x: MARGIN,
		y,
		size: 15,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});
	y = drawText(page, `${plan.ageNote} ${plan.playerNote}`, {
		x: MARGIN,
		y: y - 22,
		size: 10,
		font: ctx.fonts.regular,
		maxWidth: 500,
		lineHeight: 14
	});
	y -= 10;
	page.drawText('Selected Challenges', {
		x: MARGIN,
		y,
		size: 15,
		font: ctx.fonts.bold,
		color: rgb(0.2, 0.16, 0.32)
	});
	y -= 22;
	for (const challenge of plan.challenges) {
		y = drawText(page, `${challenge.title}: ${challenge.body}`, {
			x: MARGIN,
			y,
			size: 9.5,
			font: ctx.fonts.regular,
			maxWidth: 500,
			lineHeight: 13
		});
		y -= 4;
	}
	drawText(
		page,
		'Golden Keys and Finale: award a Golden Key for teamwork, then celebrate both teams together. The real victory is kindness and good memories.',
		{
			x: MARGIN,
			y: 78,
			size: 10,
			font: ctx.fonts.bold,
			maxWidth: 500,
			lineHeight: 14
		}
	);
}

function drawTeamCards(ctx: PdfContext, teamId: RivalQuestTeamId) {
	const team = rivalQuestTeams[teamId];
	const page = addPage(ctx);
	drawPageTitle(page, ctx, 'Team cards', team.teamName);
	const cardWidth = 240;
	const cardHeight = 250;
	const positions = [
		[MARGIN, 398],
		[MARGIN + cardWidth + 44, 398],
		[MARGIN, 124],
		[MARGIN + cardWidth + 44, 124]
	] as const;
	for (let index = 0; index < positions.length; index += 1) {
		const [x, y] = positions[index];
		drawCutLines(page, x, y, cardWidth, cardHeight);
		page.drawRectangle({
			x: x + 8,
			y: y + 8,
			width: cardWidth - 16,
			height: cardHeight - 16,
			color: rgb(1, 1, 1),
			borderColor: colorFromHex(team.color),
			borderWidth: 3
		});
		drawTeamEmblem(page, ctx, teamId, x + 86, y + 150);
		page.drawText(team.teamName, {
			x: x + 24,
			y: y + 128,
			size: 17,
			font: ctx.fonts.bold,
			color: rgb(0.2, 0.16, 0.32)
		});
		drawText(page, team.description, {
			x: x + 24,
			y: y + 102,
			size: 10,
			font: ctx.fonts.regular,
			maxWidth: cardWidth - 48,
			lineHeight: 14
		});
		drawText(page, 'Quest encouragement: cheer loudly, include kindly, and help your team shine.', {
			x: x + 24,
			y: y + 52,
			size: 9.5,
			font: ctx.fonts.bold,
			maxWidth: cardWidth - 48,
			lineHeight: 13
		});
		page.drawText(`Card ${index + 1}`, {
			x: x + 24,
			y: y + 24,
			size: 8,
			font: ctx.fonts.regular,
			color: rgb(0.45, 0.42, 0.42)
		});
	}
}

function drawTokens(ctx: PdfContext) {
	const page = addPage(ctx);
	drawPageTitle(page, ctx, 'Treasure tokens', 'Cut, award, and celebrate');
	const radius = 28;
	let index = 0;
	for (let row = 0; row < 5; row += 1) {
		for (let col = 0; col < 6; col += 1) {
			const x = 76 + col * 92;
			const y = 610 - row * 92;
			page.drawCircle({
				x,
				y,
				size: radius,
				color: rgb(1, 0.86, 0.38),
				borderColor: rgb(0.2, 0.16, 0.32),
				borderWidth: 1
			});
			page.drawText(index % 5 === 0 ? 'Key' : 'Coin', {
				x: x - 14,
				y: y - 4,
				size: 10,
				font: ctx.fonts.bold,
				color: rgb(0.2, 0.16, 0.32)
			});
			drawCutLines(page, x - radius - 5, y - radius - 5, radius * 2 + 10, radius * 2 + 10);
			index += 1;
		}
	}
	drawText(
		page,
		'Neutral Rival Quest treasure works with every matchup. Award coins for teamwork, kindness, creativity, bravery, participation, and completed challenges.',
		{
			x: MARGIN,
			y: 96,
			size: 11,
			font: ctx.fonts.regular,
			maxWidth: 500,
			lineHeight: 16
		}
	);
}

function drawScoreAndHonors(ctx: PdfContext) {
	const page = addPage(ctx);
	const plan = getRivalQuestPdfPlan(ctx.config);
	drawPageTitle(page, ctx, 'Score and celebration honors', 'Celebrate both teams');
	const teams = [plan.teamOne.teamName, plan.teamTwo.teamName];
	for (let i = 0; i < teams.length; i += 1) {
		const y = 574 - i * 130;
		page.drawRectangle({
			x: MARGIN,
			y,
			width: 524,
			height: 92,
			color: rgb(1, 1, 1),
			borderColor: rgb(0.2, 0.16, 0.32),
			borderWidth: 1
		});
		page.drawText(teams[i], { x: MARGIN + 18, y: y + 58, size: 18, font: ctx.fonts.bold });
		page.drawText('Coins / Points:', {
			x: MARGIN + 18,
			y: y + 26,
			size: 12,
			font: ctx.fonts.regular
		});
		page.drawLine({
			start: { x: MARGIN + 120, y: y + 29 },
			end: { x: MARGIN + 470, y: y + 29 },
			thickness: 1
		});
	}
	drawList(
		page,
		ctx,
		[
			'Teamwork Honor',
			'Kindness Honor',
			'Creativity Honor',
			'Bravery Honor',
			'Participation Honor',
			'Memory Maker Honor'
		],
		MARGIN,
		330,
		480
	);
	drawText(
		page,
		'Finale: invite both teams to cheer for each other. Rival Quest ends with shared celebration, not one team feeling left out.',
		{
			x: MARGIN,
			y: 118,
			size: 12,
			font: ctx.fonts.bold,
			maxWidth: 500,
			lineHeight: 17
		}
	);
}

function drawTeamSigns(ctx: PdfContext) {
	const page = addPage(ctx);
	const plan = getRivalQuestPdfPlan(ctx.config);
	drawPageTitle(page, ctx, 'Team signs', 'Place on tables or party zones');
	const teams = [
		{ id: ctx.config.teamOne, name: plan.teamOne.teamName, color: plan.teamOne.color },
		{ id: ctx.config.teamTwo, name: plan.teamTwo.teamName, color: plan.teamTwo.color }
	] as const;
	for (let i = 0; i < teams.length; i += 1) {
		const y = i === 0 ? 412 : 142;
		page.drawRectangle({
			x: MARGIN,
			y,
			width: 524,
			height: 210,
			color: rgb(1, 1, 1),
			borderColor: colorFromHex(teams[i].color),
			borderWidth: 4
		});
		drawTeamEmblem(page, ctx, teams[i].id, MARGIN + 42, y + 70);
		page.drawText(teams[i].name, {
			x: MARGIN + 145,
			y: y + 122,
			size: 34,
			font: ctx.fonts.serif,
			color: rgb(0.2, 0.16, 0.32)
		});
		page.drawText('Friendly rivals. Kind teammates. Big memories.', {
			x: MARGIN + 148,
			y: y + 84,
			size: 14,
			font: ctx.fonts.bold,
			color: rgb(0.2, 0.16, 0.32)
		});
		drawCutLines(page, MARGIN, y, 524, 210);
	}
}

function drawPrintGuide(ctx: PdfContext) {
	const page = addPage(ctx);
	drawPageTitle(page, ctx, 'Print guide', 'Use only what your host needs');
	drawList(
		page,
		ctx,
		[
			'Print only the pages needed for your party size, setting, and time.',
			'Laminate the Parent Table Guide and team signs if desired.',
			'Use cardstock for team cards, tokens, signs, and honors.',
			'Use scissors or a paper cutter with adult handling only.',
			'Colors may vary by monitor, printer, ink, and paper.',
			'Personal-use license: print for one private event. Do not share, resell, redistribute, or use commercially.'
		],
		MARGIN,
		640,
		500
	);
}

export async function generateRivalQuestPdf(config: RivalQuestConfiguration) {
	const plan = getRivalQuestPdfPlan(config);
	const pdf = await PDFDocument.create();
	pdf.setTitle(`Rival Quest - ${plan.summary}`);
	pdf.setSubject('Customized Rival Quest printable party game');
	pdf.setCreator('Holograph ePhoto');
	pdf.setProducer('Holograph ePhoto');
	pdf.setKeywords([
		'Rival Quest',
		plan.setting.label,
		plan.teamOne.teamName,
		plan.teamTwo.teamName
	]);
	const fonts = {
		regular: await pdf.embedFont(StandardFonts.Helvetica),
		bold: await pdf.embedFont(StandardFonts.HelveticaBold),
		serif: await pdf.embedFont(StandardFonts.TimesRomanBold)
	};
	const ctx = { pdf, fonts, config: plan.config };

	drawCover(ctx);
	drawSetup(ctx);
	drawParentGuide(ctx);
	drawTeamCards(ctx, ctx.config.teamOne);
	drawTeamCards(ctx, ctx.config.teamTwo);
	drawTokens(ctx);
	drawScoreAndHonors(ctx);
	drawTeamSigns(ctx);
	drawPrintGuide(ctx);

	return pdf.save({ useObjectStreams: false });
}
