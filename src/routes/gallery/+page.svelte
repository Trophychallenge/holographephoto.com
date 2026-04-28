<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Gallery | Holograph</title>
	<meta
		name="description"
		content="A simple gallery space for the photos and keepsakes coming soon."
	/>
</svelte:head>

<section class="section gallery-page">
	<div class="page-wrap gallery-layout">
		<section class="gallery-hero glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Gallery</p>
				<h1>Sweet moments, coming soon.</h1>
				<p>Photos coming soon.</p>
			</div>

			<div class="showcase-card">
				<p class="showcase-kicker">Soon</p>
				<h2>More soon.</h2>
				<div class="showcase-tags">
					<span>Family</span>
					<span>Glow</span>
					<span>Giftable</span>
				</div>
				<a class="button-primary" href={`${resolve('/')}#preview-builder`}>Make The Magic</a>
			</div>
		</section>

		<section class="gallery-grid">
			<article class="story-card glass-card"><h3>Photo gallery coming soon</h3></article>
			<article class="story-card glass-card"><h3>Your uploads will shine here</h3></article>
		</section>

		<section class="cta-band glass-card">
			<div class="cta-copy">
				<p class="eyebrow">Next</p>
				<h2>See yours.</h2>
				<p>See yours next.</p>
			</div>
			<div class="cta-actions">
				<a class="button-primary" href={`${resolve('/')}#preview-builder`}>Bring It To Life</a>
				<a class="button-secondary" href={resolve('/prices')}>See Bundles</a>
			</div>
		</section>
	</div>
</section>

<style>
	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #f8f8f5;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.7rem);
		line-height: 0.96;
	}

	h2 {
		font-size: clamp(1.45rem, 3vw, 2.15rem);
		line-height: 1;
	}

	h3 {
		font-size: clamp(1.1rem, 2vw, 1.45rem);
		line-height: 1.08;
	}

	p {
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.gallery-page {
		padding-top: 1.2rem;
	}

	.gallery-layout,
	.hero-copy,
	.showcase-card,
	.gallery-grid,
	.cta-band,
	.cta-copy,
	.cta-actions {
		display: grid;
		gap: 1rem;
	}

	.gallery-layout {
		gap: 1.15rem;
	}

	.gallery-hero,
	.cta-band {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
		gap: 1rem;
		padding: 1.15rem;
	}

	.showcase-card {
		align-content: start;
		padding: 1rem;
		border-radius: 1.45rem;
		background:
			radial-gradient(circle at top left, rgba(122, 240, 255, 0.14), transparent 34%),
			radial-gradient(circle at bottom right, rgba(255, 111, 145, 0.12), transparent 36%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
			rgba(8, 16, 30, 0.76);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.showcase-kicker {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.showcase-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.showcase-tags span {
		padding: 0.52rem 0.75rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 0.76rem;
		color: rgba(248, 248, 244, 0.82);
	}

	.gallery-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.story-card {
		display: grid;
		align-items: center;
		min-height: 12rem;
		padding: 1.05rem;
		text-align: center;
	}

	@media (max-width: 960px) {
		.gallery-hero,
		.cta-band,
		.gallery-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.gallery-hero,
		.cta-band,
		.story-card {
			padding: 0.9rem;
		}
	}
</style>
