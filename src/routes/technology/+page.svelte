<script lang="ts">
	const systemCards = [
		{
			title: 'Holographic finish',
			copy: 'Light-catching and more dimensional than a flat print.'
		},
		{
			title: 'Photo-first',
			copy: 'A strong image does most of the emotional work.'
		},
		{
			title: 'Giftable quality',
			copy: 'Premium, polished, and meant to stay on display.'
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
			<h1>A small keepsake with a bigger feeling.</h1>
			<p>Premium holographic magnets made to feel personal, polished, and worth keeping.</p>
		</div>
		<div class="tech-hero glass-card">
			<div>
				<p class="label">Core product idea</p>
				<p>A personal photo with more glow, more presence, and a more finished feel.</p>
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
			<h2>Personal first. Beautiful throughout.</h2>
		</div>
		<p>A keepsake magnet with a premium holographic finish and room for personal detail.</p>
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
		font-size: clamp(2.2rem, 5vw, 3.6rem);
	}

	h2 {
		font-size: clamp(1.3rem, 2.6vw, 1.9rem);
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.tech-hero,
	.technology-note {
		display: grid;
		gap: 1.5rem;
		padding: 1.3rem;
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
		padding: 1.1rem;
	}

	@media (max-width: 900px) {
		.tech-grid,
		.three-up {
			grid-template-columns: 1fr;
		}
	}
</style>
