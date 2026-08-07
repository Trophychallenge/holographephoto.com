import { describe, expect, it } from 'vitest';
import { rivalQuestProduct } from '$lib/products/rival-quest';
import { _buildRivalQuestCheckoutParams } from './+server';

describe('Rival Quest Stripe Checkout creation', () => {
	it('creates a digital Checkout Session payload with no shipping collection', () => {
		const params = _buildRivalQuestCheckoutParams('https://holographephoto.com');

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
		expect(params.has('shipping_address_collection[allowed_countries][0]')).toBe(false);
		expect(params.has('phone_number_collection[enabled]')).toBe(false);
	});
});
