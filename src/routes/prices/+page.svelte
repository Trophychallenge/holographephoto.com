<script lang="ts">
	import { resolve } from '$app/paths';
	import { featuredCheckoutOffers, largerCheckoutOffers } from '$lib/pricing';
</script>

<svelte:head>
	<title>Prices | Holographe</title>
	<meta
		name="description"
		content="Luxury bundle pricing for custom holographic photo magnets with direct checkout and free shipping on current sale offers."
	/>
</svelte:head>

<section class="section prices-page">
	<div class="page-wrap prices-layout" id="secure-checkout">
		<section class="hero-band glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Luxury pricing, simplified</p>
				<h1>Choose the bundle that makes the gift feel unforgettable.</h1>
				<p class="hero-subcopy">
					Start with one photo or choose a larger gift set. The page is intentionally simple so the
					right bundle is easy to pick.
				</p>
			</div>

			<div class="spotlight-card">
				<p class="spotlight-kicker">Current signature offer</p>
				<div class="spotlight-price">
					<span>Starting at</span>
					<strong>$14.99</strong>
				</div>
				<p class="spotlight-copy">Free shipping, premium finish, and a fast path from design to checkout.</p>
				<div class="spotlight-tags">
					<span>Free shipping</span>
					<span>Premium finish</span>
					<span>Easy checkout</span>
				</div>
				<a class="button-primary" href="#bundle-shop">Shop the sale bundles</a>
			</div>
		</section>

		<section class="bundle-stage" id="bundle-shop">
			<div class="section-head">
				<span class="eyebrow">Bundle shop</span>
				<h2>Shop by moment, not just by quantity.</h2>
				<p>
					Choose the size that fits your gift and check out directly.
				</p>
			</div>

			<div class="bundle-grid">
				<article class="bundle-card featured-card">
					<div class="bundle-top">
						<div>
							<p class="kicker">Most-loved bundles</p>
							<h3>Small sets with the strongest emotional impact</h3>
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
											? 'For one magnetic memory that feels intimate and elevated.'
											: offer.quantity === 3
												? 'The sweetest set for parents, grandparents, or closest family.'
												: 'A fuller gift set with a richer presentation for multiple moments.'}
									</p>
								</div>
								<div class="bundle-side">
									<span>{offer.highlight}</span>
									<small>{offer.subtitle}</small>
								</div>
							</div>
						{/each}
					</div>

					<form class="checkout-form" method="POST" action="/checkout">
						<label>
							<span>Choose your featured bundle</span>
							<select name="quantity">
								{#each featuredCheckoutOffers as offer (offer.quantity)}
									<option value={offer.quantity}>
										{offer.quantity} for {offer.priceLabel}
									</option>
								{/each}
							</select>
						</label>
						<button class="button-primary" type="submit">Checkout this bundle</button>
					</form>
				</article>

				<article class="bundle-card elevated-card">
					<div class="bundle-top">
						<div>
							<p class="kicker">Larger gifting moments</p>
							<h3>Premium sets for events, family circles, and meaningful occasions</h3>
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
											? 'Great for a polished small-batch order with strong visual impact.'
											: offer.quantity === 20
												? 'For larger family gifting and milestone celebrations.'
												: offer.quantity === 40
													? 'A statement-making keepsake order for the biggest moments.'
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

					<form class="checkout-form" method="POST" action="/checkout">
						<label>
							<span>Choose your larger bundle</span>
							<select name="quantity">
								{#each largerCheckoutOffers as offer (offer.quantity)}
									<option value={offer.quantity}>
										{offer.quantity} for {offer.priceLabel}
									</option>
								{/each}
							</select>
						</label>
						<button class="button-primary" type="submit">Checkout larger bundle</button>
					</form>
				</article>
			</div>
		</section>

		<section class="concierge-band glass-card">
			<div class="concierge-copy">
				<p class="eyebrow">Concierge option</p>
				<h2>Need 50+ pieces, event help, or something more custom?</h2>
				<p>
					For larger orders or higher-touch sentimental requests, we can quote a more private,
					white-glove package.
				</p>
			</div>

			<div class="concierge-actions">
				<div class="concierge-note">
					<p class="kicker">Private quote</p>
					<p>Best for wedding favors, memorial sets, branded gifting, and curated event bundles.</p>
				</div>
				<a class="button-secondary" href={resolve('/contact')}>Request a custom quote</a>
			</div>
		</section>
	</div>
</section>

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
		font-size: clamp(1.9rem, 3.8vw, 3rem);
		line-height: 0.98;
		max-width: 11ch;
	}

	h2 {
		font-size: clamp(1.35rem, 2.1vw, 1.95rem);
		line-height: 1.02;
	}

	h3 {
		font-size: clamp(1.05rem, 1.45vw, 1.35rem);
		line-height: 1.06;
	}

	h4 {
		font-size: 0.98rem;
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
		gap: 0.8rem;
	}

	.hero-band,
	.concierge-band {
		display: grid;
		grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
		gap: 0.8rem;
		padding: 0.82rem;
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
		font-size: 0.92rem;
	}

	.spotlight-card {
		align-content: start;
		padding: 0.82rem;
		border-radius: 1.15rem;
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
		font-size: clamp(1.9rem, 4.2vw, 2.8rem);
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
		gap: 0.75rem;
	}

	.bundle-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bundle-card {
		padding: 0.82rem;
		border-radius: 1.18rem;
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
		gap: 0.7rem;
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
		gap: 0.75rem;
		padding: 0.72rem;
		border-radius: 0.85rem;
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
		gap: 0.58rem;
		margin-top: 0.25rem;
	}

	.checkout-form label {
		display: grid;
		gap: 0.48rem;
	}

	.checkout-form select {
		padding: 0.75rem 0.85rem;
		border-radius: 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text);
	}

	.concierge-actions {
		align-content: center;
	}

	.concierge-note {
		padding: 0.75rem;
		border-radius: 0.85rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	@media (max-width: 960px) {
		.hero-band,
		.concierge-band,
		.bundle-grid {
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

		.hero-band,
		.concierge-band,
		.bundle-card {
			padding: 0.72rem;
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
