<script lang="ts">
	type Preview = {
		id: string;
		label: string;
		src: string;
		alt: string;
		vibe: string;
	};

	type LightboxItem = {
		id: string;
		label: string;
		src: string;
		alt: string;
		vibe: string;
		overlaySrc?: string;
	};

	const vibeTags = ['Custom photo', 'Handwriting', 'Gift-ready'];

	const previews: Preview[] = [
		{
			id: 'baby',
			label: 'Baby',
			src: '/holographe/jessholo.png',
			alt: 'Holographe baby keepsake with holographic shimmer',
			vibe: 'soft'
		},
		{
			id: 'wedding',
			label: 'Wedding',
			src: '/holographe/lydholowed.png',
			alt: 'Holographe wedding keepsake with holographic shimmer',
			vibe: 'romantic'
		},
		{
			id: 'portrait',
			label: 'Portrait',
			src: '/holographe/leo.png',
			alt: 'Holographe portrait keepsake with holographic shimmer',
			vibe: 'bold'
		}
	];

	const vibes = [
		{
			id: 'soft',
			label: 'Quiet',
			headline: 'Soft light, gentle details, timeless feeling.',
			copy: 'Ideal for baby photos, family moments, and keepsakes with a calmer tone.'
		},
		{
			id: 'romantic',
			label: 'Ceremony',
			headline: 'Elegant, sentimental, and made to keep.',
			copy: 'Best for wedding photos, anniversaries, and meaningful gifts.'
		},
		{
			id: 'bold',
			label: 'Signature',
			headline: 'A more striking finish with modern contrast.',
			copy: 'Well suited to portraits, standout memories, and statement keepsakes.'
		}
	];

	const highlights = [
		{ value: '$15', label: 'Price' },
		{ value: '8x10', label: 'Size' },
		{ value: '2', label: 'Photos' }
	];

	const featureCards = [
		{ title: 'Shimmery finish', body: 'Light-catching in real life' },
		{ title: 'Personal layers', body: 'Photo, note, or drawing' },
		{ title: 'Gift-ready', body: 'Envelope + ribbon included' }
	];

	const useCases = [
		'Weddings',
		'Baby memories',
		'Pet keepsakes',
		'Memorial gifts',
		"Mother's Day",
		"Father's Day"
	];

	const specs = [
		['Price', '$15.00'],
		['Size', '8x10'],
		['Color', 'Holographic'],
		['Included', 'Magnet, envelope, ribbon'],
		['Custom', '2 images + 1 text input']
	];

	let activePreview = $state(previews[0]);
	let activeVibeId = $state('soft');
	let shimmerOn = $state(true);
	let uploadedBaseSrc = $state('');
	let uploadedBaseName = $state('');
	let uploadedOverlaySrc = $state('');
	let uploadedOverlayName = $state('');
	let expandedPreview = $state<LightboxItem | null>(null);

	const activeVibe = $derived(vibes.find((vibe) => vibe.id === activeVibeId) ?? vibes[0]);
	const expandedIndex = $derived(
		expandedPreview && expandedPreview.id !== 'custom'
			? previews.findIndex((preview) => preview.id === (expandedPreview as Preview).id)
			: -1
	);
	const currentBaseSrc = $derived(uploadedBaseSrc || activePreview.src);
	const currentBaseAlt = $derived(uploadedBaseName || activePreview.alt);
	const currentOverlaySrc = $derived(uploadedOverlaySrc);

	function setPreview(preview: Preview) {
		activePreview = preview;
		activeVibeId = preview.vibe;
	}

	function openPreview(preview: LightboxItem) {
		setPreview(preview);
		expandedPreview = preview;
	}

	function openCurrentPreview() {
		expandedPreview = {
			id: uploadedBaseSrc ? 'custom' : activePreview.id,
			label: uploadedBaseName || activePreview.label,
			src: currentBaseSrc,
			alt: currentBaseAlt,
			vibe: activePreview.vibe,
			overlaySrc: currentOverlaySrc || undefined
		};
	}

	function showPreviousPreview() {
		if (!expandedPreview || expandedPreview.id === 'custom') return;
		const nextIndex = expandedIndex <= 0 ? previews.length - 1 : expandedIndex - 1;
		expandedPreview = previews[nextIndex];
		setPreview(previews[nextIndex]);
	}

	function showNextPreview() {
		if (!expandedPreview || expandedPreview.id === 'custom') return;
		const nextIndex = expandedIndex >= previews.length - 1 ? 0 : expandedIndex + 1;
		expandedPreview = previews[nextIndex];
		setPreview(previews[nextIndex]);
	}

	function updateUploadedImage(event: Event, type: 'base' | 'overlay') {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const nextUrl = URL.createObjectURL(file);
		if (type === 'base') {
			if (uploadedBaseSrc) URL.revokeObjectURL(uploadedBaseSrc);
			uploadedBaseSrc = nextUrl;
			uploadedBaseName = file.name;
		} else {
			if (uploadedOverlaySrc) URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = nextUrl;
			uploadedOverlayName = file.name;
		}

		input.value = '';
	}

	function clearUploadedImage(type: 'base' | 'overlay') {
		if (type === 'base' && uploadedBaseSrc) {
			URL.revokeObjectURL(uploadedBaseSrc);
			uploadedBaseSrc = '';
			uploadedBaseName = '';
		}

		if (type === 'overlay' && uploadedOverlaySrc) {
			URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = '';
			uploadedOverlayName = '';
		}
	}
</script>

<svelte:head>
	<title>Holographe | Custom Holographic Photo Magnet</title>
	<meta
		name="description"
		content="Custom holographic photo magnets with text or handwriting personalization."
	/>
</svelte:head>

<div class="page-shell">
	<div class="ambient ambient-one"></div>
	<div class="ambient ambient-two"></div>
	<div class="ambient ambient-three"></div>

	<header class="site-header">
		<div class="brand-block">
			<img class="brand-logo" src="/holographe/logo.png" alt="Holographe" />
			<p class="brand-subtitle">Personalized Keepsakes</p>
		</div>

		<a class="button button-secondary" href="https://www.amazon.com/dp/B0GWN48WZV">Shop Amazon</a>
	</header>

	<main>
		<section class="hero">
			<div class="hero-copy">
				<p class="eyebrow">Custom holographic photo magnet</p>
				<h1>Turn a meaningful photo into a lasting keepsake.</h1>
				<p class="lede">
					Upload a favorite photo. Add a note or drawing. See it come together here.
				</p>

				<div class="hero-actions">
					<a class="button button-primary" href="https://www.amazon.com/dp/B0GWN48WZV"
						>Customize now</a
					>
				</div>

				<div class="tag-row">
					{#each vibeTags as tag}
						<span>{tag}</span>
					{/each}
				</div>

				<div class="vibe-panel">
					<div class="vibe-switcher" aria-label="Choose a vibe">
						{#each vibes as vibe}
							<button
								type="button"
								class:active={activeVibeId === vibe.id}
								onclick={() => (activeVibeId = vibe.id)}
								aria-pressed={activeVibeId === vibe.id}
							>
								{vibe.label}
							</button>
						{/each}
					</div>
					<div class="vibe-copy">
						<p class="vibe-headline">{activeVibe.headline}</p>
					</div>
				</div>

				<div class="highlight-grid">
					{#each highlights as item}
						<div class="highlight-pill">
							<span>{item.value}</span>
							<p>{item.label}</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="hero-card">
				<div class="floating-note floating-note-top">text or handwriting</div>
				<div class="floating-note floating-note-bottom">ready to gift</div>

				<div class="product-frame">
					<div class="tool-head">
						<p class="tool-kicker">Preview your keepsake</p>
						<h2>See your image come to life.</h2>
						<p>Upload a main photo and, if you want, layer in handwriting or artwork.</p>
					</div>

					<div class="interactive-tools">
						<label class="toggle">
							<input type="checkbox" bind:checked={shimmerOn} />
							<span>Shimmer</span>
						</label>

						<div class="upload-stack">
							<label class="upload-control">
								<span>Main photo</span>
								<input
									type="file"
									accept="image/*"
									onchange={(event) => updateUploadedImage(event, 'base')}
								/>
							</label>
							<p class="upload-helper">Upload the photo you want as the base magnet image.</p>
							{#if uploadedBaseName}
								<div class="upload-meta">
									<p>{uploadedBaseName}</p>
									<button type="button" onclick={() => clearUploadedImage('base')}>Remove</button>
								</div>
							{/if}
						</div>

						<div class="upload-stack">
							<label class="upload-control">
								<span>Overlay artwork</span>
								<input
									type="file"
									accept="image/png,image/webp,image/*"
									onchange={(event) => updateUploadedImage(event, 'overlay')}
								/>
							</label>
							<p class="upload-helper">Try a transparent note, drawing, or sketch on top.</p>
							{#if uploadedOverlayName}
								<div class="upload-meta">
									<p>{uploadedOverlayName}</p>
									<button type="button" onclick={() => clearUploadedImage('overlay')}>Remove</button
									>
								</div>
							{/if}
						</div>
					</div>

					<button
						type="button"
						class:shimmer-on={shimmerOn}
						class="hero-image-wrap"
						aria-label="Enlarge current preview"
						onclick={openCurrentPreview}
					>
						<img class="hero-image" src={currentBaseSrc} alt={currentBaseAlt} />
						{#if currentOverlaySrc}
							<img class="hero-overlay-image" src={currentOverlaySrc} alt="Overlay preview" />
						{/if}
						<div class="spark spark-one"></div>
						<div class="spark spark-two"></div>
						<div class="shimmer-band"></div>
					</button>

					<div class="preview-picker" aria-label="Preview examples">
						{#each previews as preview}
							<button
								type="button"
								class:active={activePreview.id === preview.id}
								onclick={() => setPreview(preview)}
								aria-pressed={activePreview.id === preview.id}
							>
								<img src={preview.src} alt={preview.alt} />
								<span>{preview.label}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<section class="gallery">
			<div class="gallery-copy">
				<p class="eyebrow">Preview gallery</p>
				<h2>Choose a mood, then make it your own.</h2>
			</div>

			<div class="gallery-stage">
				{#each previews as preview, index}
					<button
						type="button"
						class={`stage-card ${index === 0 ? 'stage-card-small' : index === 1 ? 'stage-card-large' : 'stage-card-medium'}`}
						aria-label={`Enlarge ${preview.label.toLowerCase()} preview`}
						onclick={() => openPreview(preview)}
					>
						<img src={preview.src} alt={preview.alt} />
					</button>
				{/each}
				<div class="stage-badge">{activePreview.label} preview selected</div>
			</div>

			<div class="use-case-list">
				{#each useCases as useCase}
					<span>{useCase}</span>
				{/each}
			</div>
		</section>

		<section class="features">
			{#each featureCards as card}
				<article class="feature-card">
					<h3>{card.title}</h3>
					<p>{card.body}</p>
				</article>
			{/each}
		</section>

		<section class="bottom-grid">
			<div class="spec-grid">
				{#each specs as [label, value]}
					<div class="spec-row">
						<p>{label}</p>
						<span>{value}</span>
					</div>
				{/each}
			</div>

			<div class="buy-card">
				<p class="buy-kicker">Order on Amazon</p>
				<h2>Personal, polished, and easy to customize.</h2>
				<p class="buy-copy">
					Also well suited to bulk gifting, including party favors, wedding favors, holiday gifts
					for family, and other keepsake-style group orders.
				</p>
				<a class="button button-primary" href="https://www.amazon.com/dp/B0GWN48WZV"
					>Customize on Amazon</a
				>
			</div>
		</section>
	</main>

	{#if expandedPreview}
		<div
			class="lightbox"
			role="presentation"
			onclick={(event) => {
				if (event.target === event.currentTarget) expandedPreview = null;
			}}
		>
			<div
				class="lightbox-dialog"
				role="dialog"
				aria-modal="true"
				aria-label="Expanded photo preview"
			>
				<button
					type="button"
					class="lightbox-nav lightbox-nav-left"
					aria-label="Previous image"
					onclick={showPreviousPreview}
					disabled={expandedPreview.id === 'custom'}
				>
					<span>&larr;</span>
				</button>
				<button
					type="button"
					class="lightbox-nav lightbox-nav-right"
					aria-label="Next image"
					onclick={showNextPreview}
					disabled={expandedPreview.id === 'custom'}
				>
					<span>&rarr;</span>
				</button>
				<button
					type="button"
					class="lightbox-close"
					aria-label="Close enlarged preview"
					onclick={() => (expandedPreview = null)}
				>
					Close
				</button>
				<div class="lightbox-media">
					<img class="lightbox-image" src={expandedPreview.src} alt={expandedPreview.alt} />
					{#if expandedPreview.overlaySrc}
						<img
							class="lightbox-overlay-image"
							src={expandedPreview.overlaySrc}
							alt="Overlay preview"
						/>
					{/if}
				</div>
				<aside class="lightbox-sidebar">
					<p class="lightbox-kicker">Selected keepsake</p>
					<h3>{expandedPreview.label}</h3>
					<p class="lightbox-copy">
						A larger preview for viewing the holographic finish, image detail, and overall keepsake
						presentation.
					</p>
					<div class="lightbox-meta">
						<span>Holographic finish</span>
						<span>Overlay artwork option</span>
						<span>Gift-ready format</span>
					</div>
				</aside>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(:root) {
		--panel: rgba(14, 14, 17, 0.78);
		--line: rgba(224, 205, 162, 0.14);
		--tone-strong: #f7f0e2;
		--tone-soft: rgba(241, 232, 214, 0.8);
		--tone-muted: rgba(204, 186, 150, 0.7);
		--accent: #d9b466;
		--accent-soft: #f0dec0;
		--iridescent: #c7d8ff;
		--font-display: 'Georgia', 'Iowan Old Style', serif;
		--font-body:
			'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(body) {
		margin: 0;
		font-family: var(--font-body);
		background: linear-gradient(180deg, #060607 0%, #0b0b0e 45%, #060607 100%);
		color: var(--tone-strong);
	}

	.page-shell {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
	}

	.ambient {
		display: none;
	}

	.ambient-one {
		top: -8rem;
		right: -6rem;
		width: 24rem;
		height: 24rem;
		background: rgba(216, 202, 180, 0.34);
	}

	.ambient-two {
		top: 28rem;
		left: -8rem;
		width: 22rem;
		height: 22rem;
		background: rgba(207, 218, 242, 0.2);
	}

	.ambient-three {
		top: 12rem;
		right: 25%;
		width: 18rem;
		height: 18rem;
		background: rgba(232, 226, 214, 0.3);
	}

	.site-header,
	main {
		position: relative;
		z-index: 1;
		width: min(980px, calc(100% - 2rem));
		margin: 0 auto;
	}

	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 0 0;
	}

	.brand-block {
		display: grid;
		gap: 0.55rem;
	}

	.brand-subtitle {
		margin: 0;
		font-size: 0.78rem;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--tone-muted);
	}

	.brand-logo {
		width: min(18rem, 58vw);
		max-width: 100%;
		display: block;
	}

	main {
		display: grid;
		gap: 2.5rem;
		padding: 2rem 0 4rem;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 0.88fr);
		gap: 1.5rem;
		align-items: start;
	}

	.eyebrow {
		margin: 0 0 0.8rem;
		color: var(--tone-muted);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.34em;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 5vw, 3.8rem);
		font-weight: 500;
		line-height: 0.98;
		letter-spacing: -0.05em;
		max-width: 10ch;
	}

	h2 {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 500;
		line-height: 1.15;
	}

	.lede {
		max-width: 28rem;
		margin-top: 0.8rem;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--tone-soft);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 1.2rem;
	}

	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.9rem;
		padding: 0 1.1rem;
		border-radius: 999px;
		text-decoration: none;
		font-weight: 700;
		transition: transform 160ms ease;
	}

	.button:hover {
		transform: translateY(-1px);
	}

	.button-primary {
		background: linear-gradient(180deg, #f0d796, #d8a84d);
		color: #1a140a;
		box-shadow: 0 18px 40px rgba(208, 162, 71, 0.18);
	}

	.button-secondary {
		border: 1px solid var(--line);
		color: var(--tone-strong);
		background: rgba(255, 255, 255, 0.04);
	}

	.tag-row,
	.use-case-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 1rem;
	}

	.tag-row span,
	.use-case-list span,
	.stage-badge,
	.floating-note {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.78rem;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(224, 205, 162, 0.12);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
		color: var(--tone-soft);
	}

	.vibe-panel,
	.highlight-grid,
	.features,
	.bottom-grid {
		display: grid;
		gap: 0.8rem;
	}

	.vibe-panel {
		margin-top: 1rem;
		padding: 0.9rem;
		border-radius: 1rem;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.03);
	}

	.vibe-switcher {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.vibe-switcher button,
	.stage-card {
		cursor: pointer;
	}

	.vibe-switcher button {
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.1);
		background: rgba(255, 255, 255, 0.03);
		font-weight: 700;
		color: var(--tone-soft);
	}

	.vibe-switcher button.active,
	.vibe-switcher button:hover {
		border-color: rgba(224, 205, 162, 0.22);
		background: linear-gradient(135deg, rgba(240, 222, 192, 0.16), rgba(199, 216, 255, 0.1));
	}

	.vibe-copy {
		display: grid;
		gap: 0.25rem;
	}

	.vibe-headline {
		font-weight: 700;
	}

	.highlight-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin-top: 1rem;
	}

	.highlight-pill,
	.hero-card,
	.gallery-stage,
	.feature-card,
	.spec-grid,
	.buy-card {
		border: 1px solid var(--line);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)), var(--panel);
		backdrop-filter: blur(18px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 24px 60px rgba(0, 0, 0, 0.28);
	}

	.highlight-pill {
		padding: 0.75rem;
		border-radius: 1rem;
	}

	.highlight-pill span {
		display: block;
		color: var(--accent);
		font-family: var(--font-display);
		font-size: 1.15rem;
		margin-bottom: 0.2rem;
	}

	.highlight-pill p {
		font-size: 0.82rem;
		line-height: 1.35;
	}

	.hero-card {
		position: relative;
		padding: 0.8rem;
		border-radius: 1.75rem;
		transform: rotate(-1deg);
	}

	.product-frame {
		padding: 1rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(155deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			linear-gradient(135deg, rgba(93, 74, 37, 0.26), rgba(92, 114, 170, 0.14));
		display: grid;
		gap: 0.8rem;
	}

	.tool-head {
		display: grid;
		gap: 0.35rem;
	}

	.tool-kicker {
		color: var(--tone-muted);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.tool-head h2 {
		font-size: clamp(1.2rem, 2vw, 1.6rem);
	}

	.tool-head p {
		color: var(--tone-soft);
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.interactive-tools {
		display: grid;
		grid-template-columns: auto 1fr 1fr;
		gap: 0.7rem;
		align-items: start;
	}

	.toggle,
	.upload-control {
		display: grid;
		gap: 0.35rem;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--tone-soft);
	}

	.toggle {
		grid-template-columns: auto auto;
		align-items: center;
		gap: 0.55rem;
	}

	.upload-stack {
		display: grid;
		gap: 0.4rem;
	}

	.upload-helper {
		color: var(--tone-muted);
		font-size: 0.74rem;
		line-height: 1.45;
	}

	.upload-control input {
		width: 100%;
		padding: 0.55rem 0.7rem;
		border-radius: 0.9rem;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: var(--tone-strong);
	}

	.upload-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.upload-meta p {
		font-size: 0.72rem;
		color: var(--tone-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.upload-meta button {
		padding: 0.3rem 0.55rem;
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: var(--tone-soft);
		cursor: pointer;
	}

	.hero-image-wrap {
		position: relative;
		display: flex;
		justify-content: center;
		padding: 0.35rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(135deg, rgba(240, 222, 192, 0.18), rgba(199, 216, 255, 0.14)),
			rgba(255, 255, 255, 0.03);
		overflow: hidden;
		border: 0;
		width: 100%;
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f4dfa8'/%3E%3Cstop offset='50%25' stop-color='%23c9d8ff'/%3E%3Cstop offset='100%25' stop-color='%23f2b6df'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='14' cy='14' r='8.5' fill='none' stroke='url(%23g)' stroke-width='2.5'/%3E%3Cpath d='M20.5 20.5L29 29' stroke='url(%23g)' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E")
				14 14,
			zoom-in;
	}

	.hero-image {
		display: block;
		width: min(12rem, 100%);
		border-radius: 1rem;
		transition: transform 180ms ease;
	}

	.hero-overlay-image {
		position: absolute;
		inset: 0.35rem;
		width: calc(100% - 0.7rem);
		height: calc(100% - 0.7rem);
		object-fit: contain;
		border-radius: 1rem;
		pointer-events: none;
	}

	.hero-image-wrap:hover .hero-image {
		transform: scale(1.02);
	}

	.shimmer-band {
		position: absolute;
		inset: -20% auto -20% -35%;
		width: 40%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0.6),
			rgba(255, 255, 255, 0.08),
			transparent
		);
		transform: skewX(-18deg);
		opacity: 0;
		pointer-events: none;
	}

	.shimmer-on .shimmer-band {
		opacity: 1;
		animation: shimmer-pass 2.8s linear infinite;
	}

	.spark {
		position: absolute;
		width: 1rem;
		height: 1rem;
		background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0) 70%);
		filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9));
	}

	.spark-one {
		top: 0.8rem;
		right: 1.2rem;
	}

	.spark-two {
		left: 1rem;
		bottom: 1rem;
	}

	.floating-note {
		position: absolute;
		z-index: 2;
	}

	.floating-note-top {
		top: -0.5rem;
		right: 0.8rem;
		transform: rotate(4deg);
	}

	.floating-note-bottom {
		left: -0.5rem;
		bottom: 1rem;
		transform: rotate(-5deg);
	}

	.preview-picker {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.55rem;
	}

	.preview-picker button {
		display: grid;
		gap: 0.35rem;
		padding: 0.4rem;
		border: 1px solid rgba(224, 205, 162, 0.1);
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.04);
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			border-color 160ms ease;
	}

	.preview-picker button:hover,
	.preview-picker button.active {
		transform: translateY(-2px);
		border-color: rgba(224, 205, 162, 0.22);
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.24);
	}

	.preview-picker img {
		display: block;
		width: 100%;
		height: 5rem;
		object-fit: cover;
		border-radius: 0.7rem;
	}

	.preview-picker span {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--tone-soft);
	}

	.gallery {
		display: grid;
		gap: 1rem;
	}

	.gallery-copy {
		display: grid;
		gap: 0.5rem;
		max-width: 32rem;
	}

	.gallery-stage {
		position: relative;
		min-height: 22rem;
		border-radius: 1.7rem;
		overflow: hidden;
	}

	.stage-card {
		position: absolute;
		border-radius: 1.2rem;
		border: 6px solid rgba(255, 255, 255, 0.92);
		overflow: hidden;
		box-shadow: 0 24px 50px rgba(0, 0, 0, 0.32);
		padding: 0;
		background: transparent;
		transition: transform 180ms ease;
	}

	.stage-card:hover {
		transform: scale(1.02);
	}

	.stage-card img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.stage-card-large {
		inset: 2rem 3rem 3rem 3.6rem;
		transform: rotate(-4deg);
	}

	.stage-card-medium {
		width: 8rem;
		height: 10rem;
		right: 1.2rem;
		bottom: 1.2rem;
		transform: rotate(5deg);
	}

	.stage-card-small {
		width: 9rem;
		height: 11.5rem;
		left: 1rem;
		bottom: 1rem;
		transform: rotate(7deg);
	}

	.stage-card-large:hover {
		transform: rotate(-4deg) scale(1.02);
	}

	.stage-card-medium:hover {
		transform: rotate(5deg) scale(1.02);
	}

	.stage-card-small:hover {
		transform: rotate(7deg) scale(1.02);
	}

	.stage-badge {
		position: absolute;
		right: 1rem;
		top: 1rem;
		transform: rotate(6deg);
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		padding: 1.2rem;
		background: rgba(4, 4, 6, 0.82);
		backdrop-filter: blur(10px);
	}

	.lightbox-dialog {
		position: relative;
		width: min(94vw, 1240px);
		height: min(84vh, 900px);
		padding: 1rem;
		border-radius: 1.5rem;
		border: 1px solid var(--line);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)), var(--panel);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
		display: grid;
		grid-template-columns: minmax(0, 1fr) 240px;
		gap: 1rem;
		align-items: stretch;
	}

	.lightbox-close {
		position: absolute;
		top: 0.9rem;
		right: 0.9rem;
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.16),
				rgba(199, 216, 255, 0.14),
				rgba(242, 182, 223, 0.12)
			),
			rgba(255, 255, 255, 0.04);
		color: var(--tone-strong);
		cursor: pointer;
	}

	.lightbox-media {
		display: grid;
		place-items: center;
		min-height: 0;
		border-radius: 1.1rem;
		background:
			radial-gradient(circle at top, rgba(217, 180, 102, 0.08), transparent 30%),
			rgba(0, 0, 0, 0.18);
	}

	.lightbox-image {
		display: block;
		width: 100%;
		height: 100%;
		max-height: 80vh;
		object-fit: contain;
		border-radius: 1rem;
	}

	.lightbox-overlay-image {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 100%;
		height: 100%;
		max-height: 80vh;
		object-fit: contain;
		border-radius: 1rem;
		pointer-events: none;
	}

	.lightbox-sidebar {
		display: grid;
		align-content: start;
		gap: 0.85rem;
		padding: 1.05rem;
		border-radius: 1.1rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
			linear-gradient(
				160deg,
				rgba(240, 222, 192, 0.12),
				rgba(199, 216, 255, 0.12),
				rgba(242, 182, 223, 0.08)
			);
		border: 1px solid rgba(224, 205, 162, 0.12);
	}

	.lightbox-kicker {
		color: var(--tone-muted);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.lightbox-sidebar h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.55rem;
		font-weight: 500;
	}

	.lightbox-copy {
		color: var(--tone-soft);
		font-size: 0.94rem;
		line-height: 1.6;
	}

	.lightbox-meta {
		display: grid;
		gap: 0.55rem;
	}

	.lightbox-meta span {
		padding: 0.55rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.12),
				rgba(199, 216, 255, 0.12),
				rgba(242, 182, 223, 0.08)
			),
			rgba(255, 255, 255, 0.03);
		color: var(--tone-soft);
		font-size: 0.82rem;
		font-weight: 700;
	}

	.lightbox-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 3.15rem;
		height: 3.15rem;
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.16);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.16),
				rgba(199, 216, 255, 0.14),
				rgba(242, 182, 223, 0.12)
			),
			rgba(10, 10, 13, 0.86);
		color: var(--tone-strong);
		box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f4dfa8'/%3E%3Cstop offset='50%25' stop-color='%23c9d8ff'/%3E%3Cstop offset='100%25' stop-color='%23f2b6df'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M17 3l3.3 10.7H31l-8.6 6.2L25.8 31 17 24.9 8.2 31l3.4-11.1L3 13.7h10.7L17 3z' fill='url(%23g)'/%3E%3C/svg%3E")
				12 12,
			pointer;
	}

	.lightbox-nav:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.lightbox-nav span {
		font-size: 1.35rem;
		line-height: 1;
	}

	.lightbox-nav-left {
		left: 1rem;
	}

	.lightbox-nav-right {
		right: 15.5rem;
	}

	.lightbox-nav:hover {
		transform: translateY(-50%) scale(1.03);
	}

	.features {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.feature-card {
		padding: 1rem;
		border-radius: 1rem;
	}

	.feature-card h3 {
		font-size: 1rem;
	}

	.feature-card p {
		margin-top: 0.35rem;
		color: var(--tone-soft);
		font-size: 0.9rem;
	}

	.bottom-grid {
		grid-template-columns: minmax(0, 1fr) minmax(260px, 0.8fr);
		align-items: start;
	}

	.spec-grid {
		border-radius: 1.2rem;
		overflow: hidden;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.82rem 1rem;
		border-bottom: 1px solid rgba(224, 205, 162, 0.08);
	}

	.spec-row:last-child {
		border-bottom: 0;
	}

	.spec-row p,
	.spec-row span {
		margin: 0;
	}

	.spec-row p {
		color: var(--tone-muted);
	}

	.spec-row span {
		font-weight: 600;
	}

	.buy-card {
		padding: 1.2rem;
		border-radius: 1.2rem;
		display: grid;
		gap: 0.8rem;
	}

	.buy-copy {
		color: var(--tone-soft);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.buy-kicker {
		color: var(--tone-muted);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	@keyframes shimmer-pass {
		from {
			transform: translateX(0) skewX(-18deg);
		}

		to {
			transform: translateX(420%) skewX(-18deg);
		}
	}

	@media (max-width: 900px) {
		.hero,
		.features,
		.bottom-grid {
			grid-template-columns: 1fr;
		}

		.site-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.hero-card {
			transform: none;
		}

		.interactive-tools {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.site-header,
		main {
			width: min(980px, calc(100% - 1.1rem));
		}

		main {
			gap: 2rem;
			padding-top: 1.5rem;
		}

		h1 {
			font-size: clamp(2.1rem, 12vw, 3rem);
		}

		.highlight-grid,
		.preview-picker {
			grid-template-columns: 1fr;
		}

		.lightbox-dialog {
			grid-template-columns: 1fr;
			height: auto;
			max-height: 88vh;
		}

		.lightbox-nav {
			top: auto;
			bottom: 1rem;
			transform: none;
		}

		.lightbox-nav:hover {
			transform: scale(1.03);
		}

		.lightbox-nav-left {
			left: 1rem;
		}

		.lightbox-nav-right {
			right: 1rem;
		}

		.stage-card-large {
			inset: 2.8rem 1rem 1rem;
		}

		.stage-card-medium {
			width: 5.5rem;
			height: 7rem;
			right: 0.8rem;
			bottom: 0.8rem;
		}

		.stage-card-small {
			width: 6.8rem;
			height: 8.6rem;
			left: 0.8rem;
			bottom: 0.8rem;
		}

		.brand-logo {
			width: min(14rem, 82vw);
		}

		.floating-note {
			display: none;
		}
	}
</style>
