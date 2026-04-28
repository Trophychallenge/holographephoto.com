<script lang="ts">
	const options = [
		{
			name: 'Clean',
			copy: 'Photo only, polished fast, and intentionally minimal for a refined keepsake feel.'
		},
		{
			name: 'Signature',
			copy: 'Add a name, date, or handwritten detail to make the memory feel more intimate.'
		},
		{
			name: 'Layered',
			copy: 'Pair the photo with artwork, footprints, or custom overlays for a richer story.'
		}
	] as const;
</script>

<svelte:head>
	<title>Personalization | Holographe</title>
	<meta
		name="description"
		content="Choose the style that fits your photo best."
	/>
</svelte:head>

<section class="section formats-page">
	<div class="page-wrap formats-layout">
		<section class="formats-hero glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Styles</p>
				<h1>Three easy ways to personalize.</h1>
				<p class="hero-subcopy">Clean. Sweet. Simple.</p>
			</div>

			<div class="hero-card">
				<p class="hero-kicker">Choose</p>
				<h2>Clean, signature, or layered.</h2>
				<p>Choose what feels right.</p>
			</div>
		</section>

		<section class="option-grid">
			{#each options as option (option.name)}
				<article class="option-card glass-card">
					<p class="option-tag">{option.name}</p>
					<h2>{option.name}</h2>
					<p>{option.copy}</p>
				</article>
			{/each}
		</section>
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
		color: #f8f8f5;
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
		line-height: 0.95;
		max-width: 12ch;
	}

	h2 {
		font-size: clamp(1.45rem, 2.6vw, 2.2rem);
		line-height: 0.98;
	}

	p {
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.formats-page {
		padding-top: 1.2rem;
	}

	.formats-layout,
	.formats-hero,
	.hero-copy,
	.hero-card,
	.option-grid,
	.option-card {
		display: grid;
		gap: 1rem;
	}

	.formats-layout {
		gap: 1.15rem;
	}

	.formats-hero {
		grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
		padding: 1.15rem;
	}

	.hero-subcopy {
		max-width: 34rem;
		font-size: 1rem;
	}

	.hero-card {
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

	.hero-kicker,
	.option-tag {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.option-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.option-card {
		padding: 1rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.option-card:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow: 0 24px 52px rgba(4, 10, 22, 0.22);
	}

	@media (max-width: 960px) {
		.formats-hero,
		.option-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		h1 {
			font-size: clamp(2rem, 9vw, 2.8rem);
		}

		h2 {
			font-size: clamp(1.35rem, 6vw, 1.9rem);
		}

		.formats-hero,
		.option-card {
			padding: 0.9rem;
		}
	}
</style>
