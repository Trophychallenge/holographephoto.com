import { describe, expect, it } from 'vitest';
import { rivalQuestProduct } from '$lib/products/rival-quest';
import { _buildRivalQuestCheckoutParams } from './+server';
import type { RivalQuestConfiguration } from '$lib/products/rival-quest-builder';

const config = {
	setting: 'pool',
	teamOne: 'unicorns',
	teamTwo: 'dragons',
	ageRange: 'ages-7-9',
	playerCount: '9-14',
	partyLength: 'full',
	partyName: 'Ava Birthday Bash'
} satisfies RivalQuestConfiguration;

describe('Rival Quest Stripe Checkout creation', () => {
	it('creates a digital Checkout Session payload with no shipping collection', () => {
		const params = _buildRivalQuestCheckoutParams('https://holographephoto.com', config);

		expect(params.get('mode')).toBe('payment');
		expect(params.get('success_url')).toBe(
			'https://holographephoto.com/games/rival-quest/success?session_id={CHECKOUT_SESSION_ID}'
		);
		expect(params.get('line_items[0][price_data][unit_amount]')).toBe('999');
		expect(params.get('line_items[0][price_data][product_data][name]')).toBe(
			rivalQuestProduct.name
		);
		expect(params.get('metadata[product]')).toBe(rivalQuestProduct.metadataProduct);
		expect(params.get('metadata[product_type]')).toBe('digital');
		expect(params.get('metadata[shipping_required]')).toBe('false');
		expect(params.get('metadata[builder_version]')).toBe('party-builder-mvp-1');
		expect(params.get('metadata[setting]')).toBe('pool');
		expect(params.get('metadata[team_one]')).toBe('unicorns');
		expect(params.get('metadata[team_two]')).toBe('dragons');
		expect(params.get('metadata[age_range]')).toBe('ages-7-9');
		expect(params.get('metadata[player_count]')).toBe('9-14');
		expect(params.get('metadata[party_length]')).toBe('full');
		expect(params.get('metadata[party_name]')).toBe('Ava Birthday Bash');
		expect(params.get('metadata[configuration_summary]')).toBe(
			'Unicorn Herd vs. Dragon Clan - Pool Party Edition'
		);
		expect(params.has('shipping_address_collection[allowed_countries][0]')).toBe(false);
		expect(params.has('phone_number_collection[enabled]')).toBe(false);
	});
});
