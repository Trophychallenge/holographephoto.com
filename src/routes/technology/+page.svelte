<script lang="ts">
	const highlights = [
		{
			title: 'Shimmer',
			copy: 'A light-catching finish that feels more alive and premium than a flat photo print.'
		},
		{
			title: 'Color',
			copy: 'Brighter tone, richer atmosphere, and a more giftable visual presence.'
		},
		{
			title: 'Personal detail',
			copy: 'Room for names, dates, handwriting, artwork, and the details people actually remember.'
		}
	] as const;
</script>

<svelte:head>
	<title>Product | Holographe</title>
	<meta
		name="description"
		content="What makes Holographe feel premium: shimmer, color, and personalized detail in a collectible keepsake format."
	/>
</svelte:head>

<section class="section product-page">
	<div class="page-wrap product-layout">
		<section class="product-hero glass-card">
			<div class="hero-copy">
				<p class="eyebrow">What makes it different</p>
				<h1>Small format. Big feeling.</h1>
				<p class="hero-subcopy">More than a flat print.</p>
			</div>

			<div class="hero-card">
				<p class="hero-kicker">Feel</p>
				<h2>Glossy. Colorful. Personal.</h2>
				<p>That’s the difference.</p>
			</div>
		</section>

		<section class="highlight-grid">
			{#each highlights as item (item.title)}
				<article class="highlight-card glass-card">
					<div class="swatch"></div>
					<h2>{item.title}</h2>
					<p>{item.copy}</p>
				</article>
			{/each}
		</section>
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
		color: #f8f8f5;
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
		line-height: 0.95;
		max-width: 12ch;
	}

	h2 {
		font-size: clamp(1.45rem, 2.6vw, 2.15rem);
		line-height: 0.98;
	}

	p {
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.product-page {
		padding-top: 1.2rem;
	}

	.product-layout,
	.product-hero,
	.hero-copy,
	.hero-card,
	.highlight-grid,
	.highlight-card {
		display: grid;
		gap: 1rem;
	}

	.product-layout {
		gap: 1.15rem;
	}

	.product-hero {
		grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
		padding: 1.15rem;
	}

	.hero-subcopy {
		max-width: 34rem;
		font-size: 1rem;
	}

	.hero-card {
		align-content: start;
		padding: 1rem;
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at top left, rgba(122, 240, 255, 0.16), transparent 34%),
			radial-gradient(circle at bottom right, rgba(255, 111, 145, 0.14), transparent 36%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
			rgba(8, 16, 30, 0.76);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.hero-kicker {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.highlight-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.highlight-card {
		padding: 1rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.highlight-card:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow: 0 24px 52px rgba(4, 10, 22, 0.22);
	}

	.swatch {
		width: 100%;
		height: 0.95rem;
		border-radius: 999px;
		background: linear-gradient(90deg, #7af0ff, #ffd36d, #ff86a3);
		box-shadow: 0 10px 24px rgba(122, 240, 255, 0.18);
	}

	@media (max-width: 960px) {
		.product-hero,
		.highlight-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		h1 {
			font-size: clamp(2rem, 9vw, 2.8rem);
		}

		h2 {
			font-size: clamp(1.35rem, 6vw, 1.9rem);
		}

		.product-hero,
		.highlight-card {
			padding: 0.9rem;
		}
	}
</style>
