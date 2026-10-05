import { render } from 'svelte/server';
import { describe, expect, it, vi } from 'vitest';
import PhotoOrderPage from './+page.svelte';
import { photoOrderSelection } from '$lib/browser/photo-order';
import { checkoutOffers } from '$lib/pricing';

vi.mock('$app/state', () => ({ page: { url: new URL('https://holographephoto.com/customize') } }));

describe('photo order entry', () => {
	it('includes required saved-photo fields and blocks checkout before upload', () => {
		const { body } = render(PhotoOrderPage);
		expect(body).toContain('name="base_blob_pathname"');
		expect(body).toContain('name="overlay_blob_pathname"');
		expect(body).toContain('name="print_size"');
		expect(body).toContain('name="overlay_position"');
		expect(body).toMatch(/type="submit" disabled/);
		expect(body).toContain('Upload your own photo below');
	});
	it('accepts an existing pricing selection and ignores unsupported choices', () => {
		expect(photoOrderSelection(new URLSearchParams('package=3&size=8x10'))).toEqual({
			quantity: '3',
			size: '8x10'
		});
		expect(photoOrderSelection(new URLSearchParams('package=2&size=giant'))).toEqual({
			quantity: undefined,
			size: undefined
		});
	});
	it('keeps every selectable bundle quantity and price visible in the order summary', () => {
		const { body } = render(PhotoOrderPage);
		for (const offer of checkoutOffers) {
			expect(body).toContain(`Qty ${offer.quantity}`);
			expect(body).toContain(offer.priceLabel);
			expect(photoOrderSelection(new URLSearchParams(`package=${offer.quantity}`)).quantity).toBe(
				String(offer.quantity)
			);
		}
	});
});
