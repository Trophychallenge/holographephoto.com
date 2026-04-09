<script lang="ts">
	const systemCards = [
		{
			title: 'Capture',
			copy: 'Portrait sessions are planned around controlled light, wardrobe contrast, and movement that reads well in reflective space.'
		},
		{
			title: 'Build',
			copy: 'Each piece is assembled around layers, reflective surfaces, and presentation formats chosen for the specific venue or use case.'
		},
		{
			title: 'Install',
			copy: 'The final environment is tuned for sightline, ambient light, foot traffic, and the distance from first glance to close inspection.'
		}
	];
</script>

<svelte:head>
	<title>Technology | Holographe</title>
	<meta
		name="description"
		content="Learn how Holographe blends reflective materials, light control, layered surfaces, and motion cues into premium holographic photo experiences."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Technology</span>
			<h1>Depth is the product.</h1>
			<p>
				The technical side of Holographe exists to support a single outcome: images that feel more
				physical, luminous, and intriguing than a flat print or ordinary screen.
			</p>
		</div>
		<div class="tech-hero glass-card">
			<div>
				<p class="label">Core system</p>
				<p>
					Reflective layering, directed light, controlled contrast, and presentation design work
					together so the image shifts as viewers move around it.
				</p>
			</div>
			<div class="tech-grid">
				<div>
					<p class="metric">01</p>
					<p>Refraction-minded composition</p>
				</div>
				<div>
					<p class="metric">02</p>
					<p>Venue-specific lighting logic</p>
				</div>
				<div>
					<p class="metric">03</p>
					<p>Display formats matched to audience flow</p>
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
			<span class="eyebrow">Approach</span>
			<h2>No gimmick language. Just a stronger visual experience.</h2>
		</div>
		<p>
			Holographe is most effective when the creative direction is restrained, intentional, and
			well-produced. The result should feel like a premium object, not a temporary novelty.
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
