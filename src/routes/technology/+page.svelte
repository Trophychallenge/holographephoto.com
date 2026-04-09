<script lang="ts">
	const systemCards = [
		{
			title: 'Holographic finish',
			copy: 'The visual effect is the hero. The final magnet should catch light, shift subtly, and feel more dimensional than a normal printed keepsake.'
		},
		{
			title: 'Photo-first design',
			copy: 'Everything begins with a strong image selection, then the composition is refined so the final piece feels clean and intentional.'
		},
		{
			title: 'Giftable quality',
			copy: 'The product direction should read as premium and polished, not novelty-store. That applies to layout, finish, packaging, and presentation.'
		}
	];
</script>

<svelte:head>
	<title>Product | Holographe</title>
	<meta
		name="description"
		content="See how Holographe positions its personalized holographic photo magnet as a premium, design-led keepsake product."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Product</span>
			<h1>A small object designed to feel special.</h1>
			<p>
				Holographe is not being sold as abstract tech. It is being sold as a premium personalized
				holographic photo magnet that feels emotionally valuable and visually refined.
			</p>
		</div>
		<div class="tech-hero glass-card">
			<div>
				<p class="label">Core product idea</p>
				<p>
					A personal photo becomes a keepsake with more presence, more light-play, and a more
					finished feel than a flat print or basic magnet.
				</p>
			</div>
			<div class="tech-grid">
				<div>
					<p class="metric">01</p>
					<p>Premium holographic surface</p>
				</div>
				<div>
					<p class="metric">02</p>
					<p>Thoughtful photo selection</p>
				</div>
				<div>
					<p class="metric">03</p>
					<p>Personalized finishing options</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap three-up">
		{#each systemCards as card (card.title)}
			<article class="glass-card panel">
				<h2>{card.title}</h2>
				<p>{card.copy}</p>
			</article>
		{/each}
	</div>
</section>

<section class="section">
	<div class="page-wrap glass-card technology-note">
		<div>
			<span class="eyebrow">Positioning</span>
			<h2>High quality first. Personal second. Memorable throughout.</h2>
		</div>
		<p>
			The website should keep explaining the product in plain language: a personalized holographic
			magnet, upgraded with design quality and optional handwritten or illustrated customization.
		</p>
	</div>
</section>

<style>
	h1,
	h2 {
		margin: 1rem 0 0.8rem;
		line-height: 0.96;
		letter-spacing: -0.04em;
		font-weight: 500;
	}

	h1 {
		font-size: clamp(3rem, 7vw, 5.4rem);
	}

	h2 {
		font-size: clamp(1.6rem, 3vw, 2.4rem);
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.75;
	}

	.tech-hero,
	.technology-note {
		display: grid;
		gap: 1.5rem;
		padding: 2rem;
	}

	.tech-grid,
	.three-up {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.label,
	.metric {
		font-size: 0.78rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent-2);
	}

	.panel {
		padding: 1.5rem;
	}

	@media (max-width: 900px) {
		.tech-grid,
		.three-up {
			grid-template-columns: 1fr;
		}
	}
</style>
