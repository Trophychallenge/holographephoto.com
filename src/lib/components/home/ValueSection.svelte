<script lang="ts">
	import { featuredCheckoutOffers } from '$lib/pricing';
</script>

<section class="section value-section">
	<div class="page-wrap value-layout">
		<div class="section-head">
			<p class="eyebrow">Simple bundles</p>
			<h2>Pick a favorite.</h2>
		</div>

		<div class="value-grid">
			{#each featuredCheckoutOffers as offer (offer.quantity)}
				<div class="value-card glass-card">
					<span>{offer.label}</span>
					<strong>{offer.priceLabel}</strong>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.value-layout,
	.value-grid {
		display: grid;
		gap: 1rem;
	}

	.value-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.value-card {
		display: grid;
		gap: 0.35rem;
		padding: 1.1rem;
		text-align: center;
	}

	.value-card span {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(236, 228, 216, 0.58);
	}

	.value-card::before {
		content: '';
		display: block;
		width: 3rem;
		height: 1px;
		margin: 0 auto 0.15rem;
		background: linear-gradient(90deg, transparent, rgba(234, 211, 182, 0.8), transparent);
	}

	.value-card strong {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1;
		color: #f6f0e9;
	}

	@media (max-width: 760px) {
		.value-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
