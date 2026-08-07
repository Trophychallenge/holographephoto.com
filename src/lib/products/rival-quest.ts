export const rivalQuestProduct = {
	id: 'rival-quest',
	metadataProduct: 'rival-quest-printable-party-game',
	name: 'Rival Quest: Dragon Clan vs. Werewolf Pack Printable Party Game',
	shortName: 'Rival Quest',
	priceLabel: '$9.99',
	priceCents: 999,
	currency: 'usd',
	productType: 'digital',
	downloadFilename: 'Rival_Quest_Digital_Party_Game.zip',
	checkoutDescription:
		'Instant digital download of the Rival Quest printable Dragon Clan vs. Werewolf Pack party game kit.',
	downloadSourceEnv: 'RIVAL_QUEST_DOWNLOAD_URL',
	images: [
		{
			src: '/games/rival-quest/listing-01.jpg',
			alt: 'Dragon Clan vs. Werewolf Pack printable party game cover preview'
		},
		{
			src: '/games/rival-quest/listing-02.jpg',
			alt: 'Rival Quest printable party kit contents preview'
		},
		{
			src: '/games/rival-quest/listing-03.jpg',
			alt: 'Rival Quest challenge card preview'
		},
		{
			src: '/games/rival-quest/listing-04.jpg',
			alt: 'Rival Quest printable coins, keys, gems, and game pieces preview'
		},
		{
			src: '/games/rival-quest/listing-05.jpg',
			alt: 'Rival Quest adult Quest Master participation preview'
		},
		{
			src: '/games/rival-quest/listing-06.jpg',
			alt: 'Rival Quest full printable party system preview'
		},
		{
			src: '/games/rival-quest/listing-07.jpg',
			alt: 'Rival Quest how it works preview'
		}
	],
	included: [
		'35-page full-color printable party kit',
		'One-page Quest Master guide',
		'Dragon Clan and Werewolf Pack team cards',
		'32 Quest Challenge cards',
		'Blank challenge cards',
		'20 end-of-party honor cards',
		'Printable coins, Golden Keys, hidden gems, signs, invitations, scoreboards, and planning sheets'
	]
} as const;

export function isRivalQuestMetadata(metadata: Record<string, string> | undefined) {
	return metadata?.product === rivalQuestProduct.metadataProduct;
}
