<script lang="ts">
	const formats = [
		{
			name: 'Photo only',
			copy: 'A clean keepsake built from one photo.'
		},
		{
			name: 'Photo + handwriting',
			copy: 'Add a note, date, or signature.'
		},
		{
			name: 'Photo + custom drawing',
			copy: 'Layer in a drawing or traced artwork.'
		},
		{
			name: 'Full custom keepsake',
			copy: 'Combine photo, writing, and artwork together.'
		}
	];
</script>

<svelte:head>
	<title>Personalization | Holographe</title>
	<meta
		name="description"
		content="Explore Holographe personalization options including photo-only, handwriting add-ons, custom drawing add-ons, and fully customized keepsakes."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Personalization</span>
			<h1>Choose your level of personalization.</h1>
			<p>Keep it minimal or layer in more meaning.</p>
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
		font-size: clamp(2.2rem, 5vw, 3.5rem);
	}

	h2 {
		font-size: 1.3rem;
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.format-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.format-card {
		padding: 1.15rem;
		min-height: 11rem;
	}

	@media (max-width: 900px) {
		.format-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
