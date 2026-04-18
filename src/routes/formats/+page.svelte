<script lang="ts">
	const options = [
		{ name: 'Clean', copy: 'Photo only, polished fast, minimal look.' },
		{ name: 'Signature', copy: 'Add handwriting, a date, or a name.' },
		{ name: 'Layered', copy: 'Photo plus drawing, art, or footprint overlay.' }
	];
</script>

<svelte:head>
	<title>Personalization | Holographe</title>
	<meta
		name="description"
		content="Choose a simple Holographe personalization style: clean, signature, or layered."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap format-layout">
		<div class="section-head center">
			<span class="eyebrow">Personalization</span>
			<h1>Three clear ways to personalize.</h1>
			<p>Simple options. No confusing menu.</p>
		</div>

		<div class="format-grid">
			{#each options as option (option.name)}
				<article class="glass-card format-card">
					<p class="tag">{option.name}</p>
					<h2>{option.name}</h2>
					<p>{option.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
	}

	h2 {
		font-size: 1.7rem;
	}

	p {
		color: var(--muted);
		line-height: 1.65;
	}

	.center {
		text-align: center;
		margin-inline: auto;
	}

	.format-layout,
	.format-grid {
		display: grid;
		gap: 1rem;
	}

	.format-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.format-card {
		display: grid;
		gap: 0.6rem;
		padding: 1.2rem;
	}

	.tag {
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--accent);
		font-weight: 700;
	}

	@media (max-width: 900px) {
		.format-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
