<script lang="ts">
	const cards = [
		{
			title: 'For Moms',
			copy: 'A gift that feels personal the second they open it.'
		},
		{
			title: 'For Babies',
			copy: 'Baby footprints, first smiles, and little moments worth keeping.'
		},
		{
			title: 'For Pets',
			copy: 'A favorite face, a paw print, or a memory that still feels close.'
		},
		{
			title: 'For Meaningful Moments',
			copy: 'Photos, handwriting, and memories turned into something tangible.'
		}
	];
</script>

<section class="section gift-section">
	<div class="page-wrap gift-layout">
		<div class="heading">
			<p class="eyebrow">Why people gift it</p>
			<h2>Made to feel personal right away.</h2>
		</div>

		<div class="card-grid">
			{#each cards as card (card.title)}
				<article class="gift-card">
					<h3>{card.title}</h3>
					<p>{card.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.gift-layout,
	.heading,
	.card-grid {
		display: grid;
		gap: 1rem;
	}

	.heading {
		text-align: center;
		justify-items: center;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	h2,
	h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		color: #f8f8f4;
		letter-spacing: -0.04em;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 0.98;
	}

	h3 {
		font-size: 1.45rem;
	}

	.card-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.gift-card {
		display: grid;
		gap: 0.7rem;
		padding: 1.2rem;
		border-radius: 1.55rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(15, 15, 17, 0.95), rgba(8, 8, 10, 0.95));
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24);
		text-align: center;
	}

	.gift-card p {
		color: rgba(234, 234, 230, 0.68);
		line-height: 1.7;
	}

	@media (max-width: 620px) {
		.card-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
