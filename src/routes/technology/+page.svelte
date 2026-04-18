<script lang="ts">
	const highlights = [
		{ title: 'Shimmer', copy: 'Light-catching finish with more personality than a flat print.' },
		{ title: 'Color', copy: 'Brighter tone, playful glow, and a premium feel.' },
		{ title: 'Personal detail', copy: 'Room for names, handwriting, art, and occasion dates.' }
	];
</script>

<svelte:head>
	<title>Product | Holographe</title>
	<meta
		name="description"
		content="A short overview of what makes Holographe keepsakes feel premium: shimmer, color, and personal detail."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap product-layout">
		<div class="section-head center">
			<span class="eyebrow">Product</span>
			<h1>Small format. Big feeling.</h1>
			<p>Holographe is built around shimmer, color, and one strong memory.</p>
		</div>

		<div class="highlight-grid">
			{#each highlights as item (item.title)}
				<article class="glass-card highlight-card">
					<div class="swatch"></div>
					<h2>{item.title}</h2>
					<p>{item.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
	}

	h2 {
		font-size: 1.6rem;
	}

	p {
		color: var(--muted);
		line-height: 1.65;
	}

	.center {
		text-align: center;
		margin-inline: auto;
	}

	.product-layout,
	.highlight-grid {
		display: grid;
		gap: 1rem;
	}

	.highlight-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.highlight-card {
		display: grid;
		gap: 0.7rem;
		padding: 1.2rem;
	}

	.swatch {
		width: 100%;
		height: 0.9rem;
		border-radius: 999px;
		background: linear-gradient(90deg, #7af0ff, #ffd36d, #ff86a3);
	}

	@media (max-width: 900px) {
		.highlight-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
