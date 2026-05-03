<script lang="ts">
	import { resolve } from '$app/paths';
	import { featuredCheckoutOffers, largerCheckoutOffers } from '$lib/pricing';

	let checkoutError = $state('');
	let checkoutLoading = $state(false);

	async function submitCheckoutForm(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		checkoutError = '';
		checkoutLoading = true;

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: {
					accept: 'application/json',
					'x-holograph-ajax': '1'
				}
			});

			const result = (await response.json().catch(() => ({}))) as { error?: string; url?: string };

			if (!response.ok || !result.url) {
				checkoutError = result.error || 'Checkout could not start right now. Please try again.';
				return;
			}

			window.location.href = result.url;
		} catch {
			checkoutError = 'Checkout could not start right now. Please try again.';
		} finally {
			checkoutLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Prices | Holograph</title>
	<meta
		name="description"
		content="Simple bundle pricing for your Holograph keepsakes."
	/>
</svelte:head>

<section class="section prices-page">
	<div class="page-wrap prices-layout" id="secure-checkout">
		<section class="bulk-hero glass-card">
			<a class="bulk-hero-photo" href="#bulk-photo-lightbox">
				<img
					src="/holographe/bulk.jpg"
					alt="Wrapped bulk Holograph orders with pink ribbon"
				/>
			</a>
			<div class="bulk-hero-copy">
				<p class="eyebrow">Bulk and gifting</p>
				<h1>Small sets to full table gifts.</h1>
				<p class="hero-subcopy">Easy bundles. Simple options. Ready to order.</p>
			</div>
		</section>

		<section class="hero-band glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Simple pricing</p>
				<h2>Pick your set.</h2>
				<p class="hero-subcopy">One keepsake or a family bundle.</p>
			</div>

			<div class="spotlight-card">
				<p class="spotlight-kicker">Most-loved</p>
				<div class="spotlight-price">
					<span>Starting at</span>
					<strong>$19.99</strong>
				</div>
				<p class="spotlight-copy">Free shipping. One easy step.</p>
				<div class="spotlight-tags">
					<span>Free shipping</span>
					<span>Premium finish</span>
					<span>Quick checkout</span>
				</div>
				<a class="button-primary" href="#bundle-shop">Choose Your Bundle</a>
			</div>
		</section>

		<section class="bundle-stage" id="bundle-shop">
			<div class="section-head">
				<span class="eyebrow">Bundle shop</span>
				<h2>Choose your fit.</h2>
				<p>Add your favorite and keep going.</p>
			</div>

			<div class="bundle-grid">
				<article class="bundle-card featured-card">
					<div class="bundle-top">
						<div>
							<p class="kicker">Most-loved bundles</p>
							<h3>Small gift sets</h3>
						</div>
						<div class="bundle-chip">Free shipping</div>
					</div>

					<div class="bundle-list" aria-label="Featured bundles">
						{#each featuredCheckoutOffers as offer (offer.quantity)}
							<div class:bundle-row={true} class:bundle-row-featured={offer.quantity === 3}>
								<div class="bundle-copy">
									<p class="bundle-label">{offer.label}</p>
									<h4>{offer.quantity} for {offer.priceLabel}</h4>
									<p>
										{offer.quantity === 1
											? 'One keepsake.'
											: offer.quantity === 3
												? 'A small gift set.'
												: 'A fuller set.'}
									</p>
								</div>
								<div class="bundle-side">
									<span>{offer.highlight}</span>
									<small>{offer.subtitle}</small>
								</div>
							</div>
						{/each}
					</div>

					<form class="checkout-form" method="POST" action="/checkout" onsubmit={submitCheckoutForm}>
						<input type="hidden" name="print_size" value="8x10" />
						<label>
							<span>Featured bundle</span>
							<select name="quantity">
								{#each featuredCheckoutOffers as offer (offer.quantity)}
									<option value={offer.quantity}>
										{offer.quantity} for {offer.priceLabel}
									</option>
								{/each}
							</select>
						</label>
						<label>
							<span>Rounded edges</span>
							<select name="rounded_edges">
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
						</label>
						<label>
							<span>Frame</span>
							<select name="frame_option">
								<option value="no">No</option>
								<option value="yes">Yes</option>
							</select>
						</label>
						<div class="size-note">
							<span>Size</span>
							<p>Photo magnet standard size is about 8x10in, adjusted for best quality. If you would like a different size, please feel free to reach out :)</p>
						</div>
						<label>
							<span>Request</span>
							<input type="text" name="personal_request" placeholder="Name, date, or quick note" />
						</label>
						<button class="button-primary" type="submit" disabled={checkoutLoading}>
							{checkoutLoading ? 'Starting Checkout...' : 'Add To Cart'}
						</button>
					</form>
				</article>

				<article class="bundle-card elevated-card">
					<div class="bundle-top">
						<div>
							<p class="kicker">Larger gifting moments</p>
							<h3>Larger sets</h3>
						</div>
						<div class="bundle-chip warm">Occasion-ready</div>
					</div>

					<div class="bundle-list" aria-label="Larger bundles">
						{#each largerCheckoutOffers as offer (offer.quantity)}
							<div class="bundle-row">
								<div class="bundle-copy">
									<p class="bundle-label">{offer.label}</p>
									<h4>{offer.quantity} for {offer.priceLabel}</h4>
									<p>
										{offer.quantity === 10
											? 'Small batch.'
											: offer.quantity === 20
												? 'Larger gifting.'
												: offer.quantity === 40
													? 'Big event set.'
													: offer.subtitle}
									</p>
								</div>
								<div class="bundle-side">
									<span>{offer.highlight}</span>
									<small>{offer.subtitle}</small>
								</div>
							</div>
						{/each}
					</div>

					<form class="checkout-form" method="POST" action="/checkout" onsubmit={submitCheckoutForm}>
						<input type="hidden" name="print_size" value="8x10" />
						<label>
							<span>Larger bundle</span>
							<select name="quantity">
								{#each largerCheckoutOffers as offer (offer.quantity)}
									<option value={offer.quantity}>
										{offer.quantity} for {offer.priceLabel}
									</option>
								{/each}
							</select>
						</label>
						<label>
							<span>Rounded edges</span>
							<select name="rounded_edges">
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
						</label>
						<label>
							<span>Frame</span>
							<select name="frame_option">
								<option value="no">No</option>
								<option value="yes">Yes</option>
							</select>
						</label>
						<div class="size-note">
							<span>Size</span>
							<p>Photo magnet standard size is about 8x10in, adjusted for best quality. If you would like a different size, please feel free to reach out :)</p>
						</div>
						<label>
							<span>Request</span>
							<input type="text" name="personal_request" placeholder="Name, date, or quick note" />
						</label>
						<button class="button-primary" type="submit" disabled={checkoutLoading}>
							{checkoutLoading ? 'Starting Checkout...' : 'Add To Cart'}
						</button>
					</form>
				</article>
			</div>
		</section>

		<section class="concierge-band glass-card">
			<div class="concierge-copy">
				<p class="eyebrow">Concierge option</p>
				<h2>Need 50+ or custom?</h2>
				<p>Ask for a private quote.</p>
			</div>

			<div class="concierge-actions">
				<div class="concierge-note">
					<p class="kicker">Private quote</p>
					<p>Best for events, gifts, and larger orders.</p>
				</div>
				<a class="button-secondary" href="/contact">Contact</a>
			</div>
		</section>
	</div>
</section>

<div class="lightbox-shell" id="bulk-photo-lightbox">
	<a class="lightbox-backdrop" href="#secure-checkout" aria-label="Close bulk photo"></a>
	<div class="lightbox-card">
		<a class="lightbox-close" href="#secure-checkout" aria-label="Close bulk photo">Close</a>
		<img src="/holographe/bulk.jpg" alt="Wrapped bulk Holograph orders with pink ribbon" />
	</div>
</div>

{#if checkoutError}
	<div class="checkout-error-shell">
		<div class="checkout-error-card glass-card">
			<button type="button" class="checkout-error-close" onclick={() => (checkoutError = '')}>Close</button>
			<p class="kicker">Checkout issue</p>
			<h2>We could not start checkout.</h2>
			<p>{checkoutError}</p>
		</div>
	</div>
{/if}

<style>
	h1,
	h2,
	h3,
	h4,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3,
	h4 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #f8f8f5;
	}

	h1 {
		font-size: clamp(1.7rem, 3.2vw, 2.55rem);
		line-height: 0.98;
		max-width: 11ch;
	}

	h2 {
		font-size: clamp(1.2rem, 1.9vw, 1.7rem);
		line-height: 1.02;
	}

	h3 {
		font-size: clamp(0.98rem, 1.3vw, 1.18rem);
		line-height: 1.06;
	}

	h4 {
		font-size: 0.92rem;
		line-height: 1.08;
	}

	p {
		color: var(--muted);
		line-height: 1.52;
		font-size: 0.88rem;
	}

	.prices-page {
		padding-top: 0.7rem;
	}

	.prices-layout {
		display: grid;
		gap: 0.7rem;
	}

	.bulk-hero {
		display: grid;
		grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr);
		gap: 0.75rem;
		padding: 0.72rem;
		align-items: center;
	}

	.bulk-hero-photo {
		display: block;
		overflow: hidden;
		border-radius: 1.1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 24px 50px rgba(4, 10, 22, 0.2);
	}

	.bulk-hero-photo img {
		display: block;
		width: 100%;
		height: 15rem;
		object-fit: cover;
	}

	.lightbox-shell {
		position: fixed;
		inset: 0;
		z-index: 65;
		display: grid;
		place-items: center;
		padding: 1rem;
		opacity: 0;
		pointer-events: none;
		transition: opacity 180ms ease;
	}

	.lightbox-shell:target {
		opacity: 1;
		pointer-events: auto;
	}

	.lightbox-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(4, 4, 6, 0.84);
		backdrop-filter: blur(16px);
	}

	.lightbox-card {
		position: relative;
		z-index: 1;
		width: min(78rem, calc(100vw - 2rem));
		display: grid;
		gap: 0.75rem;
		justify-items: end;
	}

	.lightbox-card img {
		display: block;
		width: 100%;
		max-height: calc(100vh - 4rem);
		object-fit: contain;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 32px 90px rgba(0, 0, 0, 0.42);
		background: rgba(8, 8, 10, 0.9);
	}

	.lightbox-close {
		font-size: 0.76rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(248, 244, 238, 0.72);
	}

	.checkout-error-shell {
		position: fixed;
		inset: 0;
		z-index: 70;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgba(4, 4, 6, 0.78);
		backdrop-filter: blur(16px);
	}

	.checkout-error-card {
		width: min(32rem, calc(100vw - 2rem));
		display: grid;
		gap: 0.75rem;
		padding: 1.2rem;
		text-align: center;
	}

	.checkout-error-close {
		justify-self: end;
		padding: 0;
		border: 0;
		background: transparent;
		color: rgba(248, 244, 238, 0.72);
		font-size: 0.76rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.bulk-hero-copy {
		display: grid;
		gap: 0.45rem;
	}

	.hero-band,
	.concierge-band {
		display: grid;
		grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
		gap: 0.65rem;
		padding: 0.72rem;
	}

	.hero-copy,
	.spotlight-card,
	.bundle-card,
	.concierge-copy,
	.concierge-actions,
	.concierge-note {
		display: grid;
		gap: 0.62rem;
	}

	.hero-subcopy {
		max-width: 30rem;
		font-size: 0.84rem;
	}

	.spotlight-card {
		align-content: start;
		padding: 0.72rem;
		border-radius: 1rem;
		background:
			radial-gradient(circle at top left, rgba(122, 240, 255, 0.16), transparent 34%),
			radial-gradient(circle at bottom right, rgba(255, 111, 145, 0.14), transparent 36%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
			rgba(8, 16, 30, 0.76);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.spotlight-kicker,
	.kicker,
	.checkout-form span,
	.bundle-side span {
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.spotlight-kicker,
	.kicker,
	.checkout-form span {
		color: var(--accent);
	}

	.spotlight-price {
		display: grid;
		gap: 0.1rem;
	}

	.spotlight-price span {
		font-size: 0.72rem;
		color: rgba(248, 248, 244, 0.74);
	}

	.spotlight-price strong {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.55rem, 3.3vw, 2.15rem);
		line-height: 0.92;
		letter-spacing: -0.05em;
		color: #fff5de;
	}

	.spotlight-copy {
		color: rgba(245, 245, 240, 0.78);
	}

	.spotlight-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.spotlight-tags span {
		padding: 0.38rem 0.58rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 0.68rem;
		color: rgba(248, 248, 244, 0.82);
	}

	.bundle-stage,
	.bundle-grid,
	.bundle-list {
		display: grid;
		gap: 0.62rem;
	}

	.bundle-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bundle-card {
		padding: 0.7rem;
		border-radius: 1rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018)),
			linear-gradient(160deg, rgba(9, 18, 34, 0.92), rgba(8, 13, 24, 0.9));
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 28px 60px rgba(4, 10, 22, 0.24);
	}

	.featured-card {
		border-color: rgba(224, 205, 162, 0.24);
	}

	.elevated-card {
		background:
			radial-gradient(circle at top right, rgba(255, 182, 92, 0.12), transparent 26%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018)),
			linear-gradient(160deg, rgba(9, 18, 34, 0.92), rgba(8, 13, 24, 0.9));
	}

	.bundle-top {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 0.55rem;
	}

	.bundle-chip {
		flex: none;
		padding: 0.4rem 0.58rem;
		border-radius: 999px;
		background: rgba(122, 240, 255, 0.12);
		border: 1px solid rgba(122, 240, 255, 0.2);
		font-size: 0.68rem;
		color: #ecfbff;
	}

	.bundle-chip.warm {
		background: rgba(255, 182, 92, 0.12);
		border-color: rgba(255, 182, 92, 0.18);
		color: #fff1d8;
	}

	.bundle-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.6rem;
		padding: 0.6rem;
		border-radius: 0.8rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease,
			box-shadow 180ms ease;
	}

	.bundle-row:hover {
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.13);
		background: rgba(255, 255, 255, 0.045);
		box-shadow: 0 18px 38px rgba(4, 10, 22, 0.18);
	}

	.bundle-row-featured {
		border-color: rgba(122, 240, 255, 0.2);
		background:
			linear-gradient(135deg, rgba(122, 240, 255, 0.08), rgba(255, 111, 145, 0.05)),
			rgba(255, 255, 255, 0.04);
	}

	.bundle-copy {
		display: grid;
		gap: 0.18rem;
	}

	.bundle-label {
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(248, 248, 244, 0.52);
	}

	.bundle-side {
		display: grid;
		align-content: start;
		justify-items: end;
		gap: 0.35rem;
		text-align: right;
	}

	.bundle-side span {
		color: var(--accent);
	}

	.bundle-side small {
		color: rgba(248, 248, 244, 0.58);
		font-size: 0.68rem;
	}

	.checkout-form {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.25rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.checkout-form label {
		display: grid;
		gap: 0.4rem;
	}

	.size-note {
		display: grid;
		gap: 0.4rem;
	}

	.size-note p {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: rgba(236, 228, 216, 0.72);
	}

	.checkout-form button {
		grid-column: 1 / -1;
	}

	.checkout-form select,
	.checkout-form input {
		padding: 0.68rem 0.78rem;
		border-radius: 0.78rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(180deg, rgba(15, 15, 17, 0.96), rgba(11, 11, 13, 0.94)),
			rgba(255, 255, 255, 0.03);
		color: #f8f4ee;
		font-size: 0.88rem;
		color-scheme: dark;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.checkout-form select option {
		background: #111214;
		color: #f8f4ee;
	}

	.concierge-actions {
		display: grid;
		gap: 0.7rem;
		align-content: center;
	}

	.concierge-note {
		padding: 0.68rem;
		border-radius: 0.8rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	@media (max-width: 960px) {
		.bulk-hero,
		.hero-band,
		.concierge-band,
		.bundle-grid {
			grid-template-columns: 1fr;
		}

		.checkout-form {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		h1 {
			font-size: clamp(1.7rem, 7.5vw, 2.2rem);
		}

		h2 {
			font-size: clamp(1.18rem, 5.2vw, 1.5rem);
		}

		h3 {
			font-size: 1rem;
		}

		.bulk-hero,
		.hero-band,
		.concierge-band,
		.bundle-card {
			padding: 0.68rem;
		}

		.bundle-top,
		.bundle-row {
			grid-template-columns: 1fr;
		}

		.bundle-top {
			display: grid;
		}

		.bundle-side {
			justify-items: start;
			text-align: left;
		}

		.spotlight-tags {
			gap: 0.45rem;
		}
	}
</style>
