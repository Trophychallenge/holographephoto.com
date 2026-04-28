import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCheckoutOffer, parseCheckoutQuantity } from '$lib/pricing';

function jsonResponse(body: Record<string, string>, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json'
		}
	});
}

function buildCheckoutParams({
	origin,
	quantity,
	totalAmountCents,
	offerLabel,
	metadata
}: {
	origin: string;
	quantity: number;
	totalAmountCents: number;
	offerLabel: string;
	metadata?: Record<string, string>;
}) {
	const params = new URLSearchParams();
	const itemLabel = `${quantity} custom Holograph magnet${quantity === 1 ? '' : 's'}`;

	params.set('mode', 'payment');
	params.set('success_url', `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
	params.set('cancel_url', `${origin}/checkout/cancel`);
	params.set('billing_address_collection', 'required');
	params.set('phone_number_collection[enabled]', 'true');
	params.set('shipping_address_collection[allowed_countries][0]', 'US');
	params.set('allow_promotion_codes', 'true');
	params.set(
		'custom_text[submit][message]',
		'After checkout, call Christina at 347-996-0205 if we still need your photo or notes.'
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

	for (const [key, value] of Object.entries(metadata ?? {})) {
		if (value) params.set(`metadata[${key}]`, value);
	}

	return params;
}

export const POST: RequestHandler = async ({ request, fetch, url }) => {
	const wantsJson =
		request.headers.get('x-holograph-ajax') === '1' ||
		request.headers.get('accept')?.includes('application/json');

	if (!env.STRIPE_SECRET_KEY) {
		const message = 'Stripe is not configured yet. Add STRIPE_SECRET_KEY before using checkout.';
		return wantsJson ? jsonResponse({ error: message }, 503) : new Response(message, { status: 503 });
	}

	const formData = await request.formData();
	const quantity = parseCheckoutQuantity(formData.get('quantity'));
	const metadata = {
		source: String(formData.get('source') ?? ''),
		base_name: String(formData.get('base_name') ?? ''),
		overlay_name: String(formData.get('overlay_name') ?? ''),
		base_blob_url: String(formData.get('base_blob_url') ?? ''),
		overlay_blob_url: String(formData.get('overlay_blob_url') ?? ''),
		view_mode: String(formData.get('view_mode') ?? ''),
		gift_mode: String(formData.get('gift_mode') ?? ''),
		rounded_edges: String(formData.get('rounded_edges') ?? ''),
		frame_option: String(formData.get('frame_option') ?? ''),
		print_size: String(formData.get('print_size') ?? ''),
		personal_request: String(formData.get('personal_request') ?? ''),
		overlay_text: String(formData.get('overlay_text') ?? ''),
		overlay_text_style: String(formData.get('overlay_text_style') ?? ''),
		overlay_text_color: String(formData.get('overlay_text_color') ?? ''),
		gift_message: String(formData.get('gift_message') ?? ''),
		ship_direct: String(formData.get('ship_direct') ?? ''),
		brightness_level: String(formData.get('brightness_level') ?? ''),
		shimmer_intensity: String(formData.get('shimmer_intensity') ?? ''),
		effect_mode: String(formData.get('effect_mode') ?? ''),
		overlay_position: String(formData.get('overlay_position') ?? ''),
		text_position: String(formData.get('text_position') ?? '')
	};

	if (!quantity) {
		const message = 'Select one of the available sale bundle sizes.';
		return wantsJson ? jsonResponse({ error: message }, 400) : new Response(message, { status: 400 });
	}

	const offer = getCheckoutOffer(quantity);

	if (!offer) {
		const message = 'That bundle size is not available online. Request a custom quote instead.';
		return wantsJson ? jsonResponse({ error: message }, 400) : new Response(message, { status: 400 });
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
			offerLabel: offer.label,
			metadata
		})
	});

	if (!stripeResponse.ok) {
		const errorBody = await stripeResponse.text();
		const message = `Stripe checkout error: ${errorBody}`;
		return wantsJson
			? jsonResponse({ error: message }, stripeResponse.status)
			: new Response(message, { status: stripeResponse.status });
	}

	const session = (await stripeResponse.json()) as { url?: string };

	if (!session.url) {
		const message = 'Stripe did not return a checkout URL.';
		return wantsJson ? jsonResponse({ error: message }, 502) : new Response(message, { status: 502 });
	}

	if (wantsJson) {
		return jsonResponse({ url: session.url });
	}

	throw redirect(303, session.url);
};
