import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCheckoutOffer, parseCheckoutQuantity } from '$lib/pricing';
import { rivalQuestProduct } from '$lib/products/rival-quest';
import {
	getRivalQuestMetadata,
	parseRivalQuestConfiguration,
	type RivalQuestConfiguration
} from '$lib/products/rival-quest-builder';

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
	offerDescription,
	metadata
}: {
	origin: string;
	quantity: number;
	totalAmountCents: number;
	offerLabel: string;
	offerDescription: string;
	metadata?: Record<string, string>;
}) {
	const params = new URLSearchParams();

	params.set('mode', 'payment');
	params.set('success_url', `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
	params.set('cancel_url', `${origin}/checkout/cancel`);
	params.set('billing_address_collection', 'required');
	params.set('phone_number_collection[enabled]', 'true');
	params.set('shipping_address_collection[allowed_countries][0]', 'US');
	params.set('allow_promotion_codes', 'true');
	params.set(
		'custom_text[submit][message]',
		'After checkout, contact us at 512-256-3720 or admin@holographephoto.com if we still need your photo or notes.'
	);
	params.set('line_items[0][quantity]', '1');
	params.set('line_items[0][price_data][currency]', 'usd');
	params.set('line_items[0][price_data][unit_amount]', String(totalAmountCents));
	params.set('line_items[0][price_data][product_data][name]', offerLabel);
	params.set('line_items[0][price_data][product_data][description]', offerDescription);
	params.set('metadata[product]', 'custom-holographic-photo-magnet');
	params.set('metadata[quantity]', String(quantity));
	params.set('metadata[offer]', offerLabel);
	params.set('metadata[total_amount_cents]', String(totalAmountCents));

	for (const [key, value] of Object.entries(metadata ?? {})) {
		if (value) params.set(`metadata[${key}]`, value);
	}

	return params;
}

export function _buildRivalQuestCheckoutParams(origin: string, config: RivalQuestConfiguration) {
	const params = new URLSearchParams();
	const metadata = getRivalQuestMetadata(config);

	params.set('mode', 'payment');
	params.set('success_url', `${origin}/games/rival-quest/success?session_id={CHECKOUT_SESSION_ID}`);
	params.set('cancel_url', `${origin}/games/rival-quest?checkout=cancelled`);
	params.set('allow_promotion_codes', 'true');
	params.set(
		'custom_text[submit][message]',
		'After checkout, your verified download link will appear on the order confirmation page.'
	);
	params.set('line_items[0][quantity]', '1');
	params.set('line_items[0][price_data][currency]', rivalQuestProduct.currency);
	params.set('line_items[0][price_data][unit_amount]', String(rivalQuestProduct.priceCents));
	params.set('line_items[0][price_data][product_data][name]', rivalQuestProduct.name);
	params.set(
		'line_items[0][price_data][product_data][description]',
		rivalQuestProduct.checkoutDescription
	);
	params.set('metadata[product]', rivalQuestProduct.metadataProduct);
	params.set('metadata[product_type]', rivalQuestProduct.productType);
	params.set('metadata[delivery]', 'verified-download');
	params.set('metadata[shipping_required]', 'false');
	params.set('metadata[download_filename]', rivalQuestProduct.downloadFilename);
	params.set('metadata[total_amount_cents]', String(rivalQuestProduct.priceCents));
	for (const [key, value] of Object.entries(metadata)) {
		params.set(`metadata[${key}]`, value);
	}

	return params;
}

async function createStripeCheckoutSession({
	fetch,
	params
}: {
	fetch: typeof globalThis.fetch;
	params: URLSearchParams;
}) {
	const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params
	});

	if (!stripeResponse.ok) {
		const errorBody = await stripeResponse.text();
		throw new Response(`Stripe checkout error: ${errorBody}`, { status: stripeResponse.status });
	}

	const session = (await stripeResponse.json()) as { url?: string };

	if (!session.url) {
		throw new Response('Stripe did not return a checkout URL.', { status: 502 });
	}

	return session.url;
}

export const POST: RequestHandler = async ({ request, fetch, url }) => {
	const wantsJson =
		request.headers.get('x-holograph-ajax') === '1' ||
		request.headers.get('accept')?.includes('application/json');

	if (!env.STRIPE_SECRET_KEY) {
		const message = 'Stripe is not configured yet. Add STRIPE_SECRET_KEY before using checkout.';
		return wantsJson
			? jsonResponse({ error: message }, 503)
			: new Response(message, { status: 503 });
	}

	const formData = await request.formData();
	const product = String(formData.get('product') ?? '');

	if (product === rivalQuestProduct.id) {
		const configResult = parseRivalQuestConfiguration(Object.fromEntries(formData));
		if (!configResult.ok) {
			return wantsJson
				? jsonResponse({ error: configResult.message }, 400)
				: new Response(configResult.message, { status: 400 });
		}

		try {
			const checkoutUrl = await createStripeCheckoutSession({
				fetch,
				params: _buildRivalQuestCheckoutParams(url.origin, configResult.config)
			});

			if (wantsJson) {
				return jsonResponse({ url: checkoutUrl });
			}

			throw redirect(303, checkoutUrl);
		} catch (error) {
			if (error instanceof Response) {
				return wantsJson ? jsonResponse({ error: await error.text() }, error.status) : error;
			}

			throw error;
		}
	}

	const quantity = parseCheckoutQuantity(formData.get('quantity'));
	const baseBlobUrl = String(formData.get('base_blob_url') ?? '');
	const baseBlobPathname = String(formData.get('base_blob_pathname') ?? '');
	const metadata = {
		source: String(formData.get('source') ?? ''),
		base_name: String(formData.get('base_name') ?? ''),
		overlay_name: String(formData.get('overlay_name') ?? ''),
		base_blob_url: baseBlobUrl,
		overlay_blob_url: String(formData.get('overlay_blob_url') ?? ''),
		base_blob_pathname: baseBlobPathname,
		overlay_blob_pathname: String(formData.get('overlay_blob_pathname') ?? ''),
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
		return wantsJson
			? jsonResponse({ error: message }, 400)
			: new Response(message, { status: 400 });
	}

	const offer = getCheckoutOffer(quantity);

	if (!offer) {
		const message = 'That bundle size is not available online. Request a custom quote instead.';
		return wantsJson
			? jsonResponse({ error: message }, 400)
			: new Response(message, { status: 400 });
	}

	if (!baseBlobUrl || !baseBlobPathname) {
		const message = 'Upload and save your photo before starting checkout.';
		return wantsJson
			? jsonResponse({ error: message }, 400)
			: new Response(message, { status: 400 });
	}

	let checkoutUrl: string;
	try {
		checkoutUrl = await createStripeCheckoutSession({
			fetch,
			params: buildCheckoutParams({
				origin: url.origin,
				quantity,
				totalAmountCents: offer.totalAmountCents,
				offerLabel: offer.checkoutName,
				offerDescription: offer.checkoutDescription,
				metadata
			})
		});
	} catch (error) {
		if (error instanceof Response) {
			const message = await error.text();
			return wantsJson
				? jsonResponse({ error: message }, error.status)
				: new Response(message, { status: error.status });
		}

		throw error;
	}

	if (wantsJson) {
		return jsonResponse({ url: checkoutUrl });
	}

	throw redirect(303, checkoutUrl);
};
