<script lang="ts">
	const items = [
		{ title: 'Warm and personal', mark: '◌' },
		{ title: 'Made for everyday spots', mark: '◐' },
		{ title: 'Easy to gift', mark: '✦' }
	];
</script>

<section class="section why-section">
	<div class="page-wrap why-layout">
		<div class="section-head">
			<p class="eyebrow">Why it feels special</p>
			<h2>Small, bright, personal.</h2>
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
		font-size: 1.12rem;
		line-height: 1.12;
		letter-spacing: -0.04em;
		color: #f6f0e9;
	}

	.why-card {
		display: grid;
		gap: 0.8rem;
		padding: 1.05rem;
		text-align: center;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(16, 16, 16, 0.92), rgba(8, 8, 8, 0.95));
	}

	.mark {
		font-size: 1rem;
		color: #ead3b6;
	}

	@media (max-width: 860px) {
		.why-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
