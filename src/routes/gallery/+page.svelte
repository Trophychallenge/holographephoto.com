<script lang="ts">
	import { resolve } from '$app/paths';

	const stories = [
		{
			title: 'For the photo they still stop and stare at',
			note: 'Turn one unforgettable moment into a keepsake that catches the light and brings the feeling back instantly.',
			tag: 'Signature moment'
		},
		{
			title: 'A gift that feels intimate, never generic',
			note: 'More personal than flowers, more lasting than a card, and designed to feel chosen with real care.',
			tag: 'Luxury gifting'
		},
		{
			title: 'Made for names, dates, vows, and details',
			note: 'Add the tiny personal touch that makes the gift feel impossible to forget.',
			tag: 'Personal detail'
		},
		{
			title: 'For memories people never want to put away',
			note: 'The kind of piece that lives on the fridge, the desk, or the mirror because it means too much to store.',
			tag: 'Everyday display'
		},
		{
			title: 'Premium enough to impress, emotional enough to keep',
			note: 'A polished holographic finish turns a simple photo into something giftable, display-worthy, and deeply sentimental.',
			tag: 'Keepsake energy'
		}
	] as const;

	const galleryNotes = [
		{
			title: 'Scroll-stopping shine',
			copy: 'Designed to feel visually magnetic online and deeply personal in real life.'
		},
		{
			title: 'Gift-first storytelling',
			copy: 'Every description is written to sell emotion, quality, and personal meaning.'
		},
		{
			title: 'Luxury without clutter',
			copy: 'A cleaner presentation that feels expensive, easy to navigate, and built to convert.'
		}
	] as const;
</script>

<svelte:head>
	<title>Gallery | Holographe</title>
	<meta
		name="description"
		content="Luxury gallery inspiration for Holographe holographic photo magnets, designed around sentimental gifting and premium keepsake storytelling."
	/>
</svelte:head>

<section class="section gallery-page">
	<div class="page-wrap gallery-layout">
		<section class="gallery-hero glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Gallery direction</p>
				<h1>Sentimental gifting, styled like a luxury brand and shared like a creator favorite.</h1>
				<p class="hero-subcopy">
					This page is built to make the product feel aspirational, emotional, and instantly worth
					exploring further.
				</p>

				<div class="hero-notes">
					{#each galleryNotes as note (note.title)}
						<article class="hero-note">
							<h2>{note.title}</h2>
							<p>{note.copy}</p>
						</article>
					{/each}
				</div>
			</div>

			<div class="showcase-card">
				<p class="showcase-kicker">Gallery mood</p>
				<h2>Polished, emotional, display-worthy.</h2>
				<p>
					The right memory, the right shine, and a premium finish that feels more like a keepsake
					object than a basic print.
				</p>
				<div class="showcase-tags">
					<span>Giftable</span>
					<span>Glossy</span>
					<span>Personal</span>
					<span>Worth showing off</span>
				</div>
				<a class="button-primary" href={resolve('/customize')}>Start your design</a>
			</div>
		</section>

		<section class="stories-stage">
			<div class="section-head">
				<span class="eyebrow">Product stories</span>
				<h2>Five ways to make the product feel irresistible.</h2>
				<p>
					These are emotional angles that frame the holographic magnet as a premium keepsake, not a
					commodity.
				</p>
			</div>

			<div class="stories-grid">
				{#each stories as story, index (story.title)}
					<article class:story-card={true} class:story-card-wide={index === 0 || index === 4}>
						<div class="story-top">
							<p class="story-index">0{index + 1}</p>
							<span>{story.tag}</span>
						</div>
						<h3>{story.title}</h3>
						<p>{story.note}</p>
					</article>
				{/each}
			</div>
		</section>

		<section class="cta-band glass-card">
			<div class="cta-copy">
				<p class="eyebrow">Next step</p>
				<h2>See the feeling in your own photo.</h2>
				<p>
					Upload a memory, personalize it, and go straight into checkout without leaving the
					experience.
				</p>
			</div>
			<div class="cta-actions">
				<a class="button-primary" href={resolve('/customize')}>Customize now</a>
				<a class="button-secondary" href={resolve('/prices')}>View bundles</a>
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
		font-size: clamp(2.3rem, 5vw, 3.9rem);
		line-height: 0.95;
		max-width: 12ch;
	}

	h2 {
		font-size: clamp(1.7rem, 3vw, 2.55rem);
		line-height: 0.98;
	}

	h3 {
		font-size: clamp(1.28rem, 2vw, 1.75rem);
		line-height: 1.02;
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
	.stories-stage,
	.stories-grid,
	.hero-copy,
	.showcase-card,
	.cta-band,
	.cta-copy {
		display: grid;
		gap: 1rem;
	}

	.gallery-layout {
		gap: 1.15rem;
	}

	.gallery-hero,
	.cta-band {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
		gap: 1.1rem;
		padding: 1.15rem;
	}

	.hero-subcopy {
		max-width: 36rem;
		font-size: 1rem;
	}

	.hero-notes {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.hero-note {
		padding: 0.92rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.hero-note h2 {
		font-size: 1rem;
	}

	.hero-note p {
		font-size: 0.88rem;
	}

	.showcase-card {
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

	.showcase-kicker,
	.story-top span,
	.story-index {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.showcase-kicker,
	.story-top span {
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

	.stories-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.story-card {
		display: grid;
		gap: 0.8rem;
		padding: 1.05rem;
		border-radius: 1.45rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.018)),
			linear-gradient(160deg, rgba(9, 18, 34, 0.92), rgba(8, 13, 24, 0.9));
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 24px 52px rgba(4, 10, 22, 0.22);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease,
			background 180ms ease;
	}

	.story-card:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.13);
		box-shadow: 0 28px 60px rgba(4, 10, 22, 0.28);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.022)),
			linear-gradient(160deg, rgba(9, 18, 34, 0.95), rgba(8, 13, 24, 0.93));
	}

	.story-card-wide {
		grid-column: span 2;
	}

	.story-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.story-index {
		color: rgba(248, 248, 244, 0.46);
	}

	.cta-actions {
		display: grid;
		align-content: center;
		gap: 0.8rem;
	}

	@media (max-width: 960px) {
		.gallery-hero,
		.cta-band,
		.stories-grid {
			grid-template-columns: 1fr;
		}

		.hero-notes {
			grid-template-columns: 1fr;
		}

		.story-card-wide {
			grid-column: span 1;
		}
	}

	@media (max-width: 640px) {
		h1 {
			font-size: clamp(2rem, 9vw, 2.8rem);
		}

		h2 {
			font-size: clamp(1.45rem, 6vw, 2rem);
		}

		h3 {
			font-size: 1.2rem;
		}

		.gallery-hero,
		.cta-band,
		.story-card {
			padding: 0.9rem;
		}

		.story-top {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.4rem;
		}
	}
</style>
