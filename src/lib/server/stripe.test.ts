import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyStripeWebhookSignature } from './stripe';

describe('Stripe webhook signature verification', () => {
	it('accepts an in-tolerance valid raw-payload signature and rejects tampering', () => {
		const payload = '{"id":"evt_test","type":"checkout.session.completed"}';
		const secret = 'whsec_test_secret';
		const now = 1_790_000_000_000;
		const timestamp = Math.floor(now / 1000).toString();
		const signature = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
		const header = `t=${timestamp},v1=${signature}`;

		expect(verifyStripeWebhookSignature({ payload, signatureHeader: header, secret, now })).toBe(true);
		expect(verifyStripeWebhookSignature({ payload: `${payload} `, signatureHeader: header, secret, now })).toBe(false);
		expect(verifyStripeWebhookSignature({ payload, signatureHeader: header, secret, now: now + 301_000 })).toBe(false);
	});
});
