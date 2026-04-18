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
			<h1>Gift-ready pricing, with a luxury feel.</h1>
			<p>
				Choose the size that fits the moment. Every bundle is designed to feel personal, polished,
				and easy to gift.
			</p>
		</div>

		<div class="prices-grid">
			<article class="glass-card price-card featured">
				<p class="kicker">Most giftable</p>
				<h2>Starting at $14.99 with free shipping</h2>
				<p>The easiest way to turn one meaningful photo into a polished keepsake gift.</p>
				<div class="offer-list" aria-label="Featured sale bundles">
					{#each featuredCheckoutOffers as offer (offer.quantity)}
						<div class="offer-row">
							<div>
								<h3>{offer.quantity} for {offer.priceLabel}</h3>
								<p>
									{offer.quantity === 1
										? 'A thoughtful one-piece gift'
										: offer.quantity === 3
											? 'Perfect for siblings, grandparents, or a small set'
											: 'A fuller gift set for family moments'}
								</p>
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
									{offer.quantity} for {offer.priceLabel} • luxury gift pricing
								</option>
							{/each}
						</select>
					</label>
					<button class="button-primary" type="submit">Choose this gift bundle</button>
				</form>
			</article>

			<article class="glass-card price-card">
				<p class="kicker">For bigger moments</p>
				<h2>Bundle more keepsakes for the same emotional impact</h2>
				<p>
					Ideal for weddings, family gifting, memorial sets, or events where one memory deserves
					more than one copy.
				</p>
				<div class="offer-list" aria-label="Larger sale bundles">
					{#each largerCheckoutOffers as offer (offer.quantity)}
						<div class="offer-row">
							<div>
								<h3>{offer.quantity} for {offer.priceLabel}</h3>
								<p>
									{offer.quantity === 10
										? 'A refined small-batch gift order'
										: offer.quantity === 20
											? 'Strong value for celebrations and family sets'
											: offer.quantity === 40
												? 'For larger sentimental gifting moments'
												: offer.subtitle}
								</p>
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
									{offer.quantity} for {offer.priceLabel} • premium bulk gifting
								</option>
							{/each}
						</select>
					</label>
					<button class="button-primary" type="submit">Choose larger bundle</button>
				</form>
			</article>
		</div>

		<div class="bulk-section glass-card">
			<div>
				<p class="kicker">Occasion pricing</p>
				<h2>Made for gifts that travel well and stay meaningful.</h2>
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
				Ideal for wedding favors, memorial keepsakes, holiday gifting, baby milestones, and other
				high-emotion moments where a photo deserves a premium presentation.
			</p>
		</div>

		<div class="extras-grid">
			<article class="glass-card info-card">
				<p class="kicker">Confidence</p>
				<h3>Secure, polished checkout</h3>
				<p>
					Stripe handles payment, confirmation, and shipping details so the purchase feels easy and
					premium.
				</p>
			</article>

			<article class="glass-card info-card">
				<p class="kicker">Personal detail</p>
				<h3>More custom, when you want it</h3>
				<p>
					Handwriting clean-up, more complex layouts, and higher-touch sentimental requests can be
					quoted separately.
				</p>
			</article>

			<article class="glass-card info-card">
				<p class="kicker">White-glove option</p>
				<h3>50+ pieces or custom event needs</h3>
				<p>
					<a class="button-secondary inline-button" href={resolve('/contact')}
						>Request a private quote</a
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
		font-size: clamp(2rem, 4.4vw, 3.1rem);
		line-height: 0.98;
	}

	h2 {
		font-size: clamp(1.45rem, 2.8vw, 2.1rem);
	}

	h3 {
		font-size: 1rem;
	}

	p {
		color: var(--muted);
		line-height: 1.58;
		font-size: 0.94rem;
	}

	.prices-layout {
		display: grid;
		gap: 0.9rem;
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
		padding: 1rem;
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
