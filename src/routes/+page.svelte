<script lang="ts">
	type Preview = {
		id: string;
		label: string;
		src: string;
		alt: string;
		vibe: string;
	};

	const vibeTags = ['Custom photo', 'Personal text', 'Keepsake gift'];

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
		{ title: 'Shimmery finish', body: 'Holographic glow in real light' },
		{ title: 'Made personal', body: 'Add text or handwriting' },
		{ title: 'Easy gift', body: 'Includes envelope + ribbon' }
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
	let personalText = $state('Love you forever');

	const activeVibe = $derived(vibes.find((vibe) => vibe.id === activeVibeId) ?? vibes[0]);

	function setPreview(preview: Preview) {
		activePreview = preview;
		activeVibeId = preview.vibe;
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
				<p class="lede">Add a photo, a name, or handwriting. Keep it close or give it well.</p>

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
						<p>{activeVibe.copy}</p>
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
					<div class="interactive-tools">
						<label class="toggle">
							<input type="checkbox" bind:checked={shimmerOn} />
							<span>Shimmer</span>
						</label>

						<label class="text-demo">
							<span>Preview your text</span>
							<input type="text" bind:value={personalText} maxlength="28" />
						</label>
					</div>

					<div class:shimmer-on={shimmerOn} class="hero-image-wrap">
						<img class="hero-image" src={activePreview.src} alt={activePreview.alt} />
						<div class="preview-overlay">{personalText || 'Your keepsake text'}</div>
						<div class="spark spark-one"></div>
						<div class="spark spark-two"></div>
						<div class="shimmer-band"></div>
					</div>

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
				<p class="eyebrow">Preview options</p>
				<h2>View different keepsake styles and update the main preview.</h2>
			</div>

			<div class="gallery-stage">
				{#each previews as preview, index}
					<button
						type="button"
						class={`stage-card ${index === 0 ? 'stage-card-small' : index === 1 ? 'stage-card-large' : 'stage-card-medium'}`}
						aria-label={`Show ${preview.label.toLowerCase()} preview`}
						onclick={() => setPreview(preview)}
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
</div>

<style>
	:global(:root) {
		--panel: rgba(255, 255, 255, 0.72);
		--line: rgba(152, 137, 114, 0.18);
		--tone-strong: #2a2520;
		--tone-soft: rgba(60, 53, 44, 0.78);
		--tone-muted: rgba(117, 102, 82, 0.72);
		--accent: #8f7a5c;
		--accent-soft: #d8cab4;
		--iridescent: #cfdaf2;
		--font-display: 'Georgia', 'Iowan Old Style', serif;
		--font-body:
			'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(body) {
		margin: 0;
		font-family: var(--font-body);
		background:
			radial-gradient(circle at 10% 10%, rgba(216, 202, 180, 0.22), transparent 20%),
			radial-gradient(circle at 85% 12%, rgba(207, 218, 242, 0.2), transparent 22%),
			radial-gradient(circle at 50% 48%, rgba(255, 249, 240, 0.5), transparent 34%),
			linear-gradient(180deg, #fffefc 0%, #faf7f2 42%, #f4f4f7 100%);
		color: var(--tone-strong);
	}

	.page-shell {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
	}

	.ambient {
		position: absolute;
		border-radius: 999px;
		filter: blur(80px);
		opacity: 0.55;
		pointer-events: none;
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
		background: linear-gradient(135deg, #ff8fcb, #ffc6e6 46%, #c9e6ff);
		color: #3a153c;
		box-shadow: 0 18px 40px rgba(255, 114, 190, 0.18);
	}

	.button-secondary {
		border: 1px solid var(--line);
		color: var(--tone-strong);
		background: rgba(255, 255, 255, 0.55);
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
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid rgba(152, 137, 114, 0.14);
		box-shadow: 0 10px 24px rgba(143, 122, 92, 0.08);
		color: #6c5d49;
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
		background: rgba(255, 255, 255, 0.62);
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
		border: 1px solid rgba(193, 115, 174, 0.14);
		background: white;
		font-weight: 700;
		color: var(--tone-soft);
	}

	.vibe-switcher button.active,
	.vibe-switcher button:hover {
		border-color: rgba(143, 122, 92, 0.32);
		background: linear-gradient(135deg, #f8f1e6, #eef2f8);
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
			linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.5)), var(--panel);
		backdrop-filter: blur(18px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			0 24px 60px rgba(126, 114, 93, 0.1);
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
			linear-gradient(155deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.56)),
			linear-gradient(135deg, rgba(236, 227, 211, 0.4), rgba(207, 218, 242, 0.22));
		display: grid;
		gap: 0.8rem;
	}

	.interactive-tools {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.7rem;
		align-items: center;
	}

	.toggle,
	.text-demo {
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

	.text-demo input {
		width: 100%;
		min-height: 2.4rem;
		padding: 0 0.8rem;
		border-radius: 999px;
		border: 1px solid rgba(193, 115, 174, 0.18);
		border: 1px solid rgba(152, 137, 114, 0.18);
		background: rgba(255, 255, 255, 0.86);
		color: var(--tone-strong);
	}

	.hero-image-wrap {
		position: relative;
		display: flex;
		justify-content: center;
		padding: 0.35rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(135deg, rgba(236, 227, 211, 0.45), rgba(207, 218, 242, 0.24)),
			rgba(255, 255, 255, 0.03);
		overflow: hidden;
	}

	.hero-image {
		display: block;
		width: min(12rem, 100%);
		border-radius: 1rem;
		transition: transform 180ms ease;
	}

	.hero-image-wrap:hover .hero-image {
		transform: scale(1.02);
	}

	.preview-overlay {
		position: absolute;
		left: 50%;
		bottom: 1rem;
		transform: translateX(-50%);
		max-width: 70%;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.82);
		color: #5f5344;
		font-size: 0.74rem;
		font-weight: 700;
		text-align: center;
		box-shadow: 0 10px 24px rgba(143, 122, 92, 0.1);
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
		border: 1px solid rgba(152, 137, 114, 0.16);
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.6);
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			border-color 160ms ease;
	}

	.preview-picker button:hover,
	.preview-picker button.active {
		transform: translateY(-2px);
		border-color: rgba(143, 122, 92, 0.34);
		box-shadow: 0 14px 28px rgba(143, 122, 92, 0.12);
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
		max-width: 38rem;
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
		box-shadow: 0 24px 50px rgba(186, 103, 160, 0.16);
		box-shadow: 0 24px 50px rgba(126, 114, 93, 0.14);
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
		border-bottom: 1px solid rgba(255, 114, 190, 0.08);
		border-bottom: 1px solid rgba(152, 137, 114, 0.08);
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
