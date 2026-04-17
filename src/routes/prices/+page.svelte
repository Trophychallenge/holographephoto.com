<script lang="ts">
	import { resolve } from '$app/paths';
	import { featuredCheckoutOffers, largerCheckoutOffers } from '$lib/pricing';
</script>

<svelte:head>
	<title>Prices | Holographe</title>
	<meta
		name="description"
		content="Pricing for Holographe custom holographic photo magnets, including base pricing, group discounts, and seasonal deals."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap prices-layout" id="secure-checkout">
		<div class="section-head">
			<span class="eyebrow">Prices</span>
			<h1>Sale pricing with free shipping.</h1>
			<p>The sale is live now. Checkout runs through Stripe, and larger bundles stay discounted.</p>
		</div>

		<div class="prices-grid">
			<article class="glass-card price-card featured">
				<p class="kicker">Featured sale</p>
				<h2>$14.99 and free shipping</h2>
				<p>Pick one of the current featured bundles.</p>
				<div class="offer-list" aria-label="Featured sale bundles">
					{#each featuredCheckoutOffers as offer (offer.quantity)}
						<div class="offer-row">
							<div>
								<h3>{offer.quantity} for {offer.priceLabel}</h3>
								<p>{offer.subtitle}</p>
							</div>
							<span>{offer.highlight}</span>
						</div>
					{/each}
				</div>
				<form class="checkout-form" method="POST" action="/checkout">
					<label>
						<span>Featured bundles</span>
						<select name="quantity">
							{#each featuredCheckoutOffers as offer (offer.quantity)}
								<option value={offer.quantity}>
									{offer.quantity} for {offer.priceLabel} • {offer.highlight}
								</option>
							{/each}
						</select>
					</label>
					<button class="button-primary" type="submit">Checkout this bundle</button>
				</form>
			</article>

			<article class="glass-card price-card">
				<p class="kicker">Larger discounted bundles</p>
				<h2>More pieces, lower effective cost</h2>
				<p>Use one of the larger online bundle sizes below.</p>
				<div class="offer-list" aria-label="Larger sale bundles">
					{#each largerCheckoutOffers as offer (offer.quantity)}
						<div class="offer-row">
							<div>
								<h3>{offer.quantity} for {offer.priceLabel}</h3>
								<p>{offer.subtitle}</p>
							</div>
							<span>{offer.highlight}</span>
						</div>
					{/each}
				</div>
				<form class="checkout-form" method="POST" action="/checkout">
					<label>
						<span>Larger bundles</span>
						<select name="quantity">
							{#each largerCheckoutOffers as offer (offer.quantity)}
								<option value={offer.quantity}>
									{offer.quantity} for {offer.priceLabel} • {offer.subtitle}
								</option>
							{/each}
						</select>
					</label>
					<button class="button-primary" type="submit">Checkout larger order</button>
				</form>
			</article>
		</div>

		<div class="bulk-section glass-card">
			<div>
				<p class="kicker">Bulk gift pricing</p>
				<h2>Better for group orders.</h2>
			</div>

			<div class="bulk-grid">
				<div>
					<h3>10-piece bundle</h3>
					<p>$114.99</p>
				</div>
				<div>
					<h3>20-piece bundle</h3>
					<p>$219.99</p>
				</div>
				<div>
					<h3>50+ pieces</h3>
					<p>Custom quote</p>
				</div>
			</div>

			<p class="bulk-copy">
				Great for party favors, wedding favors, holiday gifts for family, and other keepsake-style
				group orders.
			</p>
		</div>

		<div class="extras-grid">
			<article class="glass-card info-card">
				<p class="kicker">Checkout</p>
				<h3>Secure card payment</h3>
				<p>
					Stripe handles payment collection, billing details, shipping address, and confirmations.
				</p>
			</article>

			<article class="glass-card info-card">
				<p class="kicker">Custom work</p>
				<h3>More detailed overlays</h3>
				<p>
					Complex handwriting clean-up, custom layouts, or large-event requests can be quoted
					separately.
				</p>
			</article>

			<article class="glass-card info-card">
				<p class="kicker">Large orders</p>
				<h3>50+ pieces</h3>
				<p>
					<a class="button-secondary inline-button" href={resolve('/contact')}
						>Request a custom quote</a
					>
				</p>
			</article>
		</div>
	</div>
</section>

<style>
	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
		line-height: 0.96;
	}

	h2 {
		font-size: clamp(1.8rem, 3vw, 2.6rem);
	}

	h3 {
		font-size: 1.1rem;
	}

	p {
		color: var(--muted);
		line-height: 1.65;
	}

	.prices-layout {
		display: grid;
		gap: 1rem;
	}

	.prices-grid,
	.bulk-grid,
	.extras-grid {
		display: grid;
		gap: 1rem;
	}

	.prices-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.price-card,
	.bulk-section,
	.info-card {
		padding: 1.2rem;
	}

	.price-card {
		display: grid;
		gap: 0.75rem;
	}

	.checkout-form {
		display: grid;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.offer-list {
		display: grid;
		gap: 0.7rem;
	}

	.offer-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.offer-row h3 {
		font-size: 1rem;
	}

	.offer-row span {
		flex: none;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.checkout-form label {
		display: grid;
		gap: 0.45rem;
		color: var(--muted);
	}

	.checkout-form select {
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text);
		padding: 0.85rem 1rem;
	}

	.featured {
		border-color: rgba(224, 205, 162, 0.22);
	}

	.kicker {
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}

	.bulk-section {
		display: grid;
		gap: 1rem;
	}

	.bulk-grid,
	.extras-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bulk-grid > div,
	.info-card {
		padding: 0.9rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.bulk-copy {
		max-width: 46rem;
	}

	.inline-button {
		padding: 0.75rem 1rem;
	}

	@media (max-width: 860px) {
		.prices-grid,
		.bulk-grid,
		.extras-grid {
			grid-template-columns: 1fr;
		}

		.offer-row {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
