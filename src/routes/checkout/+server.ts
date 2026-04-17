import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCheckoutOffer, parseCheckoutQuantity } from '$lib/pricing';

function buildCheckoutParams({
	origin,
	quantity,
	totalAmountCents,
	offerLabel
}: {
	origin: string;
	quantity: number;
	totalAmountCents: number;
	offerLabel: string;
}) {
	const params = new URLSearchParams();
	const itemLabel = `${quantity} custom holographic photo magnet${quantity === 1 ? '' : 's'}`;

	params.set('mode', 'payment');
	params.set('success_url', `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
	params.set('cancel_url', `${origin}/checkout/cancel`);
	params.set('billing_address_collection', 'required');
	params.set('phone_number_collection[enabled]', 'true');
	params.set('shipping_address_collection[allowed_countries][0]', 'US');
	params.set('allow_promotion_codes', 'true');
	params.set(
		'custom_text[submit][message]',
		'After checkout, send your photo and any customization notes through the contact page if we do not already have them.'
	);
	params.set('line_items[0][quantity]', '1');
	params.set('line_items[0][price_data][currency]', 'usd');
	params.set('line_items[0][price_data][unit_amount]', String(totalAmountCents));
	params.set('line_items[0][price_data][product_data][name]', itemLabel);
	params.set(
		'line_items[0][price_data][product_data][description]',
		'Personalized holographic keepsake bundle with free shipping and optional handwriting or artwork overlay.'
	);
	params.set('metadata[product]', 'custom-holographic-photo-magnet');
	params.set('metadata[quantity]', String(quantity));
	params.set('metadata[offer]', offerLabel);
	params.set('metadata[total_amount_cents]', String(totalAmountCents));

	return params;
}

export const POST: RequestHandler = async ({ request, fetch, url }) => {
	if (!env.STRIPE_SECRET_KEY) {
		return new Response(
			'Stripe is not configured yet. Add STRIPE_SECRET_KEY before using checkout.',
			{
				status: 503
			}
		);
	}

	const formData = await request.formData();
	const quantity = parseCheckoutQuantity(formData.get('quantity'));

	if (!quantity) {
		return new Response('Select one of the available sale bundle sizes.', { status: 400 });
	}

	const offer = getCheckoutOffer(quantity);

	if (!offer) {
		return new Response(
			'That bundle size is not available online. Request a custom quote instead.',
			{
				status: 400
			}
		);
	}

	const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: buildCheckoutParams({
			origin: url.origin,
			quantity,
			totalAmountCents: offer.totalAmountCents,
			offerLabel: offer.label
		})
	});

	if (!stripeResponse.ok) {
		const errorBody = await stripeResponse.text();
		return new Response(`Stripe checkout error: ${errorBody}`, { status: stripeResponse.status });
	}

	const session = (await stripeResponse.json()) as { url?: string };

	if (!session.url) {
		return new Response('Stripe did not return a checkout URL.', { status: 502 });
	}

	throw redirect(303, session.url);
};
