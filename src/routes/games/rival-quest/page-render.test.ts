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
	it('renders the Party Builder questionnaire with previews and progress', () => {
		const { body } = render(RivalQuestPage);

		expect(body).toContain('Build your Rival Quest party');
		expect(body).toContain('Instant Digital Download');
		expect(body).toContain('Step 1 of 5');
		expect(body).toContain('Where is your quest happening?');
		expect(body).toContain('Indoor Party');
		expect(body).toContain('Outdoor Adventure');
		expect(body).toContain('Pool Party');
		expect(body).toContain('/games/rival-quest/listing-01.jpg');
		expect(body).toContain('Printable kit system');
		expect(body).toContain('Premium holographic card sets');
		expect(body).toContain('No shipping');
		expect(body).toContain('Friendly rivals');
	});
});
