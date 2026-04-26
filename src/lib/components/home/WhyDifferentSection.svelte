<script lang="ts">
	const items = [
		{ title: 'Feels like a memory, not a product', mark: '●' },
		{ title: 'Made to be seen every day', mark: '◐' },
		{ title: 'More personal than a frame', mark: '✦' }
	];
</script>

<section class="section why-section">
	<div class="page-wrap why-layout">
		<div class="section-head">
			<p class="eyebrow">Why it feels different</p>
			<h2>Quiet, personal, easy to keep.</h2>
		</div>

		<div class="why-grid">
			{#each items as item (item.title)}
				<article class="why-card glass-card">
					<div class="mark">{item.mark}</div>
					<h3>{item.title}</h3>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.why-layout,
	.why-grid {
		display: grid;
		gap: 1rem;
	}

	.why-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	h3 {
		margin: 0;
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: 1.2rem;
		line-height: 1.12;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	.why-card {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
	}

	.mark {
		font-size: 1.2rem;
		color: var(--accent);
	}

	@media (max-width: 860px) {
		.why-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
