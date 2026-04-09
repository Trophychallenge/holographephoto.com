<script lang="ts">
	const formats = [
		{
			name: 'Signature Event Installation',
			copy: 'A hero setup for galas, weddings, launches, and private events where the guest experience needs a central visual magnet.'
		},
		{
			name: 'Brand Activation Format',
			copy: 'Designed for retail, experiential campaigns, and press moments where shareability and foot traffic both matter.'
		},
		{
			name: 'Commissioned Portrait Piece',
			copy: 'A more intimate format for collectors, families, artists, or milestone gifting with a gallery-minded finish.'
		},
		{
			name: 'Window / Pop-Up Display',
			copy: 'A visible-from-the-street format that creates curiosity before someone even walks into the room.'
		}
	];
</script>

<svelte:head>
	<title>Formats | Holographe</title>
	<meta
		name="description"
		content="Explore Holographe formats for events, retail installations, portraits, and custom commissions."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Formats</span>
			<h1>Different footprints. Same cinematic effect.</h1>
			<p>
				The Holographe format should fit the audience, the venue, and the way people are expected to
				interact with it.
			</p>
		</div>
		<div class="format-grid">
			{#each formats as format (format.name)}
				<article class="glass-card format-card">
					<h2>{format.name}</h2>
					<p>{format.copy}</p>
				</article>
			{/each}
		</div>
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
		font-size: clamp(3rem, 7vw, 5.3rem);
	}

	h2 {
		font-size: 1.65rem;
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.75;
	}

	.format-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.format-card {
		padding: 1.6rem;
		min-height: 15rem;
	}

	@media (max-width: 900px) {
		.format-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
