<svelte:head>
	<title>Prices | Holographe</title>
	<meta
		name="description"
		content="Pricing for Holographe custom holographic photo magnets, including base pricing, group discounts, and seasonal deals."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap prices-layout">
		<div class="section-head">
			<span class="eyebrow">Prices</span>
			<h1>Simple pricing.</h1>
			<p>Premium keepsakes starting at $25, with lower pricing for larger group orders.</p>
		</div>

		<div class="prices-grid">
			<article class="glass-card price-card featured">
				<p class="kicker">Standard order</p>
				<h2>$25</h2>
				<p>Per personalized magnet.</p>
				<ul>
					<li>Holographic finish</li>
					<li>Photo-based keepsake</li>
					<li>Optional handwriting or artwork overlay</li>
				</ul>
			</article>

			<article class="glass-card price-card">
				<p class="kicker">Amazon promo</p>
				<h2>$15</h2>
				<p>Temporary starter price on Amazon while the listing is new.</p>
				<a class="button-secondary" href="https://www.amazon.com/dp/B0GWN48WZV">Shop Amazon</a>
			</article>
		</div>

		<div class="bulk-section glass-card">
			<div>
				<p class="kicker">Bulk gift pricing</p>
				<h2>Better for group orders.</h2>
			</div>

			<div class="bulk-grid">
				<div>
					<h3>12-23 pieces</h3>
					<p>$23 each</p>
				</div>
				<div>
					<h3>24-49 pieces</h3>
					<p>$21 each</p>
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
				<p class="kicker">Deals</p>
				<h3>Seasonal offers</h3>
				<p>Occasional holiday or launch promotions may run for a limited time.</p>
			</article>

			<article class="glass-card info-card">
				<p class="kicker">Custom work</p>
				<h3>More detailed overlays</h3>
				<p>
					Complex handwriting clean-up, custom layouts, or large-event requests can be quoted
					separately.
				</p>
			</article>
		</div>
	</div>
</section>

<style>
	h1,
	h2,
	h3,
	p,
	ul {
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

	p,
	li {
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

	.price-card ul {
		padding-left: 1rem;
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

	@media (max-width: 860px) {
		.prices-grid,
		.bulk-grid,
		.extras-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
