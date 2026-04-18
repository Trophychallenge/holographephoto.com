<script lang="ts">
	const descriptions = [
		{
			title: 'For the photo they still stop and stare at',
			note: 'Turn one unforgettable moment into a keepsake that catches the light and brings the feeling back instantly.'
		},
		{
			title: 'A gift that feels intimate, not generic',
			note: 'More personal than flowers, more lasting than a card, and designed to feel chosen with real care.'
		},
		{
			title: 'Made for names, dates, vows, and little details',
			note: 'Layer in the handwriting, the anniversary, the nickname, or the tiny detail that makes it theirs.'
		},
		{
			title: 'For the memories people never want to put away',
			note: 'The kind of piece that lives on the fridge, the desk, or the mirror because it means too much to store.'
		},
		{
			title: 'Premium enough to impress, emotional enough to keep',
			note: 'A polished holographic finish turns a simple photo into something giftable, display-worthy, and deeply sentimental.'
		}
	];
</script>

<svelte:head>
	<title>Gallery | Holographe</title>
	<meta
		name="description"
		content="Quick visual inspiration for Holographe keepsakes, from family photos to weddings and pets."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap gallery-layout">
		<div class="section-head center">
			<span class="eyebrow">Gallery</span>
			<h1>Sentimental gifting with main-character energy.</h1>
			<p>
				Five premium product stories built to make the gift feel emotional, polished, and worth
				keeping and posting about.
			</p>
		</div>

		<div class="feature-panel glass-card">
			<div class="feature-copy">
				<p class="panel-kicker">Why it works online</p>
				<h2>The best gifts feel emotional in person and irresistible on camera.</h2>
				<p>These descriptions are written to feel premium, sentimental, and socially magnetic.</p>
			</div>
			<div class="idea-grid">
				{#each descriptions as item (item.title)}
					<article class="idea-card">
						<div class="idea-orb"></div>
						<h3>{item.title}</h3>
						<p>{item.note}</p>
					</article>
				{/each}
			</div>
		</div>
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
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
	}

	h2 {
		font-size: clamp(1.8rem, 4vw, 2.7rem);
	}

	h3 {
		font-size: 1.2rem;
	}

	p {
		color: var(--muted);
		line-height: 1.65;
	}

	.gallery-layout,
	.feature-panel,
	.feature-copy,
	.idea-grid {
		display: grid;
		gap: 1rem;
	}

	.center {
		text-align: center;
		margin-inline: auto;
	}

	.feature-panel {
		padding: 1.2rem;
	}

	.feature-copy {
		max-width: 36rem;
	}

	.panel-kicker {
		font-size: 0.75rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}

	.idea-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.idea-card {
		display: grid;
		gap: 0.6rem;
		padding: 1.15rem;
		border-radius: 1.3rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.idea-orb {
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background:
			radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), transparent 30%),
			linear-gradient(
				135deg,
				rgba(122, 240, 255, 0.8),
				rgba(255, 111, 145, 0.7),
				rgba(255, 182, 92, 0.8)
			);
		box-shadow: 0 10px 30px rgba(122, 240, 255, 0.2);
	}

	@media (max-width: 900px) {
		.idea-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
