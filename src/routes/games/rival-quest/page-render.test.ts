import { render } from 'svelte/server';
import { describe, expect, it, vi } from 'vitest';
import RivalQuestPage from './+page.svelte';

vi.mock('$app/state', () => ({
	page: {
		url: new URL('https://holographephoto.com/games/rival-quest')
	}
}));

vi.mock('@vercel/analytics/sveltekit', () => ({
	track: vi.fn()
}));

describe('/games/rival-quest page', () => {
	it('renders the digital product landing page with previews and checkout copy', () => {
		const { body } = render(RivalQuestPage);

		expect(body).toContain('Rival Quest: Dragon Clan vs. Werewolf Pack Printable Party Game');
		expect(body).toContain('Instant Digital Download');
		expect(body).toContain('Buy Digital Game - $9.99');
		expect(body).toContain('/games/rival-quest/listing-01.jpg');
		expect(body).toContain('Adult supervision is required');
		expect(body).toContain('Premium holographic card sets');
		expect(body).toContain('No physical product is included');
	});
});
