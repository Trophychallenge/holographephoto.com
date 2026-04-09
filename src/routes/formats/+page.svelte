<script lang="ts">
	const formats = [
		{
			name: 'Photo only',
			copy: 'A clean holographic magnet built from a single selected image for customers who want the premium finish without extra customization.'
		},
		{
			name: 'Photo + handwriting',
			copy: 'Add a personal note, date, signature, or short message so the magnet feels more intimate and specific.'
		},
		{
			name: 'Photo + custom drawing',
			copy: 'Layer in a simple illustration, traced motif, or accent drawing to give the product a more bespoke visual identity.'
		},
		{
			name: 'Full custom keepsake',
			copy: 'Combine the holographic photo with both writing and drawn elements for the richest, most personalized version of the product.'
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
			<h1>Choose how personal you want the piece to feel.</h1>
			<p>
				The core product stays the same: a premium holographic photo magnet. What changes is how
				much custom meaning gets layered into it.
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
