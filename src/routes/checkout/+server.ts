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
import {
	getHalloweenDesign,
	getHalloweenPackage,
	getHalloweenVariant,
	getHalloweenVariantSku
} from '$lib/products/halloween';
import {
	releaseReservation,
	reserveHalloweenInventory,
	attachReservationToCheckout
} from '$lib/server/inventory';

function halloweenInventoryEnabled() {
	return Boolean(env.DATABASE_URL) && env.HALLOWEEN_INVENTORY_ENABLED === 'true';
}

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
	metadata,
	productMetadata = 'custom-holographic-photo-magnet',
	expiresAt
}: {
	origin: string;
	quantity: number;
	totalAmountCents: number;
	offerLabel: string;
	offerDescription: string;
	metadata?: Record<string, string>;
	productMetadata?: string;
	expiresAt?: number;
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
	params.set('metadata[product]', productMetadata);
	params.set('metadata[quantity]', String(quantity));
	params.set('metadata[offer]', offerLabel);
	params.set('metadata[total_amount_cents]', String(totalAmountCents));
	if (expiresAt) params.set('expires_at', String(expiresAt));

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

	const session = (await stripeResponse.json()) as { id?: string; url?: string };

	if (!session.id || !session.url) {
		throw new Response('Stripe did not return a checkout URL.', { status: 502 });
	}

	return { id: session.id, url: session.url };
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

	if (product === 'halloween-magnetic-decal') {
		if (String(formData.get('decal_use_ack') ?? '') !== 'yes') {
			const message =
				'Please confirm that you understand the indoor-only use warning before checkout.';
			return wantsJson
				? jsonResponse({ error: message }, 400)
				: new Response(message, { status: 400 });
		}
		const design = getHalloweenDesign(String(formData.get('design_slug') ?? ''));
		const decalSize = String(formData.get('decal_size') ?? '');
		const personalized = String(formData.get('personalized') ?? '') === 'true';
		const quantity = parseCheckoutQuantity(formData.get('quantity'));
		const decalPrices: Record<string, { label: string; cents: number }> = {
			'4-inch': { label: '4-inch', cents: 999 },
			'6-inch': { label: '6-inch', cents: 1499 },
			'8-inch': { label: '8-inch', cents: 1999 }
		};
		const selectedSize = decalPrices[decalSize];
		if (!design || !selectedSize || !quantity || quantity > 50) {
			const message = 'That magnetic decal selection is unavailable.';
			return wantsJson
				? jsonResponse({ error: message }, 400)
				: new Response(message, { status: 400 });
		}
		try {
			const params = buildCheckoutParams({
				origin: url.origin,
				quantity,
				totalAmountCents: (selectedSize.cents + (personalized ? 500 : 0)) * quantity,
				offerLabel: `${design.name} Magnetic Decal (${selectedSize.label})`,
				offerDescription: `One ${selectedSize.label} Holographe Halloween magnetic decal featuring ${design.name}${personalized ? ', personalized with a name or short phrase' : ''}.`,
				productMetadata: 'halloween-magnetic-decal',
				metadata: {
					order_type: 'halloween-decal',
					design_slug: design.slug,
					decal_size: decalSize,
					personalized: String(personalized)
				}
			});
			const session = await createStripeCheckoutSession({ fetch, params });
			if (wantsJson) return jsonResponse({ url: session.url });
			throw redirect(303, session.url);
		} catch (error) {
			if (error instanceof Response) {
				return wantsJson ? jsonResponse({ error: await error.text() }, error.status) : error;
			}
			throw error;
		}
	}

	if (product === 'halloween-cart') {
		type CartEntry = {
			kind: 'mural' | 'decal';
			designSlug: string;
			packageId?: string;
			variantId?: string;
			decalSize?: string;
			personalized?: boolean;
			quantity: number;
		};
		let cart: CartEntry[];
		try {
			cart = JSON.parse(String(formData.get('cart_json') ?? '[]')) as CartEntry[];
		} catch {
			cart = [];
		}
		if (!Array.isArray(cart) || cart.length < 1 || cart.length > 10) {
			const message =
				'Your cart is empty or has too many different items. Please keep it to ten designs per checkout.';
			return wantsJson
				? jsonResponse({ error: message }, 400)
				: new Response(message, { status: 400 });
		}
		if (
			cart.some((item) => item?.kind === 'decal') &&
			String(formData.get('decal_use_ack') ?? '') !== 'yes'
		) {
			const message =
				'Please confirm that you understand the indoor-only use warning before checkout.';
			return wantsJson
				? jsonResponse({ error: message }, 400)
				: new Response(message, { status: 400 });
		}
		const lineItems: Array<{ name: string; description: string; cents: number; quantity: number }> =
			[];
		for (const item of cart) {
			const design = getHalloweenDesign(item.designSlug);
			const quantity = parseCheckoutQuantity(String(item.quantity));
			if (!design || !quantity || quantity > 50) {
				const message = 'One of the items in your cart is no longer available.';
				return wantsJson
					? jsonResponse({ error: message }, 400)
					: new Response(message, { status: 400 });
			}
			if (item.kind === 'mural') {
				const productPackage = getHalloweenPackage(item.packageId ?? '');
				const variant = getHalloweenVariant(item.packageId ?? '', item.variantId ?? '');
				if (!productPackage || !variant) {
					const message = 'One of the mural options in your cart is no longer available.';
					return wantsJson
						? jsonResponse({ error: message }, 400)
						: new Response(message, { status: 400 });
				}
				lineItems.push({
					name: `${design.name} — ${productPackage.editionName}`,
					description: `${productPackage.name}. Holographe Halloween Edition${variant.id.endsWith('.personalized') ? ', personalized' : ''}.`,
					cents: variant.priceCents,
					quantity
				});
			} else if (item.kind === 'decal') {
				const sizes: Record<string, { label: string; cents: number }> = {
					'4-inch': { label: '4-inch', cents: 999 },
					'6-inch': { label: '6-inch', cents: 1499 },
					'8-inch': { label: '8-inch', cents: 1999 }
				};
				const size = item.decalSize ? sizes[item.decalSize] : undefined;
				if (!size) {
					const message = 'One of the decal sizes in your cart is unavailable.';
					return wantsJson
						? jsonResponse({ error: message }, 400)
						: new Response(message, { status: 400 });
				}
				lineItems.push({
					name: `${design.name} Magnetic Decal (${size.label})`,
					description: `Holographe Halloween magnetic decal${item.personalized ? ', personalized with a name or short phrase' : ''}.`,
					cents: size.cents + (item.personalized ? 500 : 0),
					quantity
				});
			} else {
				const message = 'One of the items in your cart is unavailable.';
				return wantsJson
					? jsonResponse({ error: message }, 400)
					: new Response(message, { status: 400 });
			}
		}
		const params = new URLSearchParams();
		params.set('mode', 'payment');
		params.set('success_url', `${url.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
		params.set('cancel_url', `${url.origin}/collections/halloween?checkout=cancelled`);
		params.set('billing_address_collection', 'required');
		params.set('phone_number_collection[enabled]', 'true');
		params.set('shipping_address_collection[allowed_countries][0]', 'US');
		params.set('allow_promotion_codes', 'true');
		for (const [index, item] of lineItems.entries()) {
			params.set(`line_items[${index}][quantity]`, String(item.quantity));
			params.set(`line_items[${index}][price_data][currency]`, 'usd');
			params.set(`line_items[${index}][price_data][unit_amount]`, String(item.cents));
			params.set(`line_items[${index}][price_data][product_data][name]`, item.name);
			params.set(`line_items[${index}][price_data][product_data][description]`, item.description);
		}
		params.set('metadata[product]', 'halloween-collection');
		params.set('metadata[order_type]', 'halloween-cart');
		params.set(
			'metadata[total_amount_cents]',
			String(lineItems.reduce((sum, item) => sum + item.cents * item.quantity, 0))
		);
		params.set(
			'custom_text[submit][message]',
			'Thank you for shopping small and choosing Holographe.'
		);
		try {
			const session = await createStripeCheckoutSession({ fetch, params });
			if (wantsJson) return jsonResponse({ url: session.url });
			throw redirect(303, session.url);
		} catch (error) {
			if (error instanceof Response)
				return wantsJson ? jsonResponse({ error: await error.text() }, error.status) : error;
			throw error;
		}
	}

	if (product === rivalQuestProduct.id) {
		const configResult = parseRivalQuestConfiguration(Object.fromEntries(formData));
		if (!configResult.ok) {
			return wantsJson
				? jsonResponse({ error: configResult.message }, 400)
				: new Response(configResult.message, { status: 400 });
		}

		try {
			const checkoutSession = await createStripeCheckoutSession({
				fetch,
				params: _buildRivalQuestCheckoutParams(url.origin, configResult.config)
			});

			if (wantsJson) {
				return jsonResponse({ url: checkoutSession.url });
			}

			throw redirect(303, checkoutSession.url);
		} catch (error) {
			if (error instanceof Response) {
				return wantsJson ? jsonResponse({ error: await error.text() }, error.status) : error;
			}

			throw error;
		}
	}

	if (product === 'halloween-seasonal-release') {
		const designSlug = String(formData.get('design_slug') ?? '');
		const packageId = String(formData.get('package_id') ?? '');
		const variantId = String(formData.get('variant_id') ?? '');
		const quantity = parseCheckoutQuantity(formData.get('quantity'));
		const design = getHalloweenDesign(designSlug);
		const productPackage = getHalloweenPackage(packageId);
		const variant = getHalloweenVariant(packageId, variantId);
		const personalizationDetails = String(formData.get('personalization_details') ?? '')
			.trim()
			.slice(0, 80);

		if (!design || !productPackage || !variant || !quantity) {
			const message = 'That Halloween edition selection is unavailable.';
			return wantsJson
				? jsonResponse({ error: message }, 400)
				: new Response(message, { status: 400 });
		}

		const sku = getHalloweenVariantSku(design.slug, variant.id);
		const inventoryEnabled = halloweenInventoryEnabled();
		let reservation: Awaited<ReturnType<typeof reserveHalloweenInventory>> | null = null;
		if (inventoryEnabled) {
			try {
				reservation = await reserveHalloweenInventory({ sku, quantity });
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'This edition is currently unavailable.';
				return wantsJson
					? jsonResponse({ error: message }, 409)
					: new Response(message, { status: 409 });
			}
		}

		try {
			const metadata: Record<string, string> = {
				order_type: 'halloween',
				sku,
				design_slug: design.slug,
				variant_id: variant.id,
				package_id: productPackage.id
			};
			if (variant.id.endsWith('.personalized'))
				metadata.personalization_details = personalizationDetails;
			if (reservation) metadata.inventory_reservation_id = reservation.id;

			const checkoutSession = await createStripeCheckoutSession({
				fetch,
				params: buildCheckoutParams({
					origin: url.origin,
					quantity,
					totalAmountCents: variant.priceCents * quantity,
					offerLabel: `${design.name} — ${productPackage.editionName}`,
					offerDescription: `${productPackage.name}. Holographe Halloween Edition.`,
					productMetadata: 'halloween-edition',
					expiresAt: reservation ? Math.ceil(reservation.expiresAt.getTime() / 1000) : undefined,
					metadata
				})
			});
			if (reservation) {
				await attachReservationToCheckout({
					reservationId: reservation.id,
					checkoutSessionId: checkoutSession.id
				});
			}

			if (wantsJson) return jsonResponse({ url: checkoutSession.url });
			return redirect(303, checkoutSession.url);
		} catch (error) {
			if (error instanceof Response) {
				if (reservation) await releaseReservation(reservation.id);
				const message = await error.text();
				return wantsJson
					? jsonResponse({ error: message }, error.status)
					: new Response(message, { status: error.status });
			}
			if (reservation) await releaseReservation(reservation.id);
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
		const checkoutSession = await createStripeCheckoutSession({
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
		checkoutUrl = checkoutSession.url;
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
