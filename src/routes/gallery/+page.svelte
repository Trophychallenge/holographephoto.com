<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Gallery | Holographe</title>
	<meta
		name="description"
		content="A selection of Holographe product examples, from photo magnets to seasonal pieces."
	/>
</svelte:head>

<section class="section gallery-page">
	<div class="page-wrap gallery-layout">
		<section class="gallery-hero glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Gallery</p>
				<h1>Made to catch the light.</h1>
				<p>These are Holographe product examples. Customer uploads stay private unless their owner chooses to share them.</p>
				<a class="button-primary" href={resolve('/customize')}>Create from your photo</a>
			</div>
			<figure class="showcase-card"><img src="/holographe/jess-holo-hero.webp" alt="A Holographe keepsake" /><figcaption>Photo magnet example</figcaption></figure>
		</section>

		<section class="gallery-grid">
			<figure class="story-card glass-card"><img src="/holographe/packaging-front.png" alt="Holographe packaging example" /><figcaption><h3>Gift-ready presentation</h3><p>Product packaging from the Holographe studio.</p></figcaption></figure>
			<figure class="story-card glass-card"><img src="/media/halloween/creepy-carnival.jpg" alt="Creepy Carnival Halloween collection artwork" /><figcaption><h3>Creepy Carnival</h3><p>Artwork from the Halloween collection.</p></figcaption></figure>
			<figure class="story-card glass-card"><img src="/media/business/howdy-social.jpg" alt="Howdy Social business card with a holographic finish" /><figcaption><h3>Business-card magnets</h3><p>A real Howdy Social product example.</p></figcaption></figure>
			<figure class="story-card glass-card"><img src="/holographe/lydholowed.png" alt="Wedding Holographe keepsake" /><figcaption><h3>Milestone keepsakes</h3><p>A holographic photo-magnet example.</p></figcaption></figure>
		</section>

		<section class="cta-band glass-card">
			<div class="cta-copy">
				<p class="eyebrow">Your next piece</p>
				<h2>Start with a favorite image.</h2>
				<p>Upload, personalize, review, then continue to secure checkout.</p>
			</div>
			<div class="cta-actions">
				<a class="button-primary" href={resolve('/customize')}>Customize a photo magnet</a>
				<a class="button-secondary" href={resolve('/prices')}>See photo-magnet sets</a>
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
		margin: 0;
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
	.showcase-card img { width:100%; min-height:20rem; height:100%; object-fit:cover; border-radius:1rem; }
	.showcase-card figcaption { color:var(--muted); font-size:.82rem; }

	.gallery-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.story-card {
		display: grid;
		grid-template-rows: minmax(12rem, 1fr) auto;
		min-height: 20rem;
		padding: 1.05rem;
		gap: .9rem;
		margin:0;
	}
	.story-card img { width:100%; height:100%; min-height:12rem; object-fit:cover; border-radius:1rem; }
	.story-card figcaption { display:grid; gap:.35rem; }
	.story-card figcaption p { font-size:.85rem; }

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
