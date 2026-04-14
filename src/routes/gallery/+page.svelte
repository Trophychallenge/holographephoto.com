<script lang="ts">
	const galleryItems = [
		'Couple portrait magnet with anniversary date',
		'Pet photo magnet with handwritten note',
		'Baby photo keepsake with custom illustration',
		'Travel memory magnet with location script',
		'Memorial magnet with signature detail',
		'Minimal portrait magnet in premium packaging'
	];
</script>

<svelte:head>
	<title>Gallery | Holographe</title>
	<meta
		name="description"
		content="Explore the visual direction for Holographe personalized holographic photo magnets and custom keepsake variations."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Gallery</span>
			<h1>Visual directions for different keepsake moments.</h1>
			<p>Simple ideas for gifting, family, and custom versions.</p>
		</div>
		<div class="gallery-grid">
			{#each galleryItems as item, index (item)}
				<article class="glass-card gallery-card">
					<div class="art art-{index + 1}"></div>
					<p>{item}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	h1 {
		margin: 1rem 0 0.8rem;
		line-height: 0.96;
		letter-spacing: -0.04em;
		font-weight: 500;
		font-size: clamp(2.2rem, 5vw, 3.5rem);
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.gallery-card {
		padding: 0.9rem;
	}

	.art {
		min-height: 12rem;
		border-radius: 1.2rem;
		margin-bottom: 1rem;
		background: repeating-linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0.08) 1px,
			transparent 1px,
			transparent 16px
		);
	}

	.art-1,
	.art-4 {
		background-color: #122336;
		background-image:
			radial-gradient(circle at 30% 20%, rgba(159, 232, 255, 0.36), transparent 24%),
			linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(7, 17, 26, 0.3));
	}

	.art-2,
	.art-5 {
		background-color: #1b1728;
		background-image:
			radial-gradient(circle at 70% 22%, rgba(255, 202, 135, 0.28), transparent 28%),
			linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(7, 17, 26, 0.22));
	}

	.art-3,
	.art-6 {
		background-color: #101c2c;
		background-image:
			radial-gradient(circle at 50% 18%, rgba(129, 150, 255, 0.28), transparent 26%),
			linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(7, 17, 26, 0.24));
	}

	@media (max-width: 900px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
