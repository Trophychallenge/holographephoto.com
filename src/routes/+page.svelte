<script lang="ts">
	type Preview = {
		id: string;
		label: string;
		src: string;
		alt: string;
		mode: 'quiet' | 'ceremony' | 'signature';
	};

	type GiftMode = {
		id: 'quiet' | 'ceremony' | 'signature';
		label: string;
		headline: string;
	};

	type Mockup = 'fridge' | 'locker' | 'envelope';

	const previews: Preview[] = [
		{
			id: 'baby',
			label: 'Baby',
			src: '/holographe/jessholo.png',
			alt: 'Baby keepsake with holographic shimmer',
			mode: 'quiet'
		},
		{
			id: 'wedding',
			label: 'Wedding',
			src: '/holographe/lydholowed.png',
			alt: 'Wedding keepsake with holographic shimmer',
			mode: 'ceremony'
		},
		{
			id: 'portrait',
			label: 'Portrait',
			src: '/holographe/leo.png',
			alt: 'Portrait keepsake with holographic shimmer',
			mode: 'signature'
		}
	];

	const modes: GiftMode[] = [
		{ id: 'quiet', label: 'Quiet', headline: 'Soft, personal, and easy to gift.' },
		{ id: 'ceremony', label: 'Ceremony', headline: 'Elegant for weddings and milestone moments.' },
		{
			id: 'signature',
			label: 'Signature',
			headline: 'Stronger contrast with a more statement finish.'
		}
	];

	const mockups: { id: Mockup; label: string }[] = [
		{ id: 'fridge', label: 'Fridge' },
		{ id: 'locker', label: 'Locker' },
		{ id: 'envelope', label: 'Envelope' }
	];

	const storySteps = [
		{ title: 'Upload the photo', copy: 'Start with the image that matters.' },
		{ title: 'Layer the detail', copy: 'Add handwriting, a drawing, or a note.' },
		{ title: 'Let it shimmer', copy: 'Preview the holographic light pass.' },
		{ title: 'Gift or keep', copy: 'Make one or build a full set.' }
	];

	let activePreview = $state(previews[0]);
	let activeModeId = $state<GiftMode['id']>('quiet');
	let uploadedBaseSrc = $state('');
	let uploadedBaseName = $state('');
	let uploadedOverlaySrc = $state('');
	let uploadedOverlayName = $state('');
	let shimmerOn = $state(true);
	let shimmerValue = $state(58);
	let revealOverlay = $state(true);
	let compareSplit = $state(48);
	let activeMockup = $state<Mockup>('fridge');
	let bulkEvent = $state('Wedding favor');
	let bulkQty = $state('24');
	let bulkStyle = $state('Photo + handwriting');
	let storyIndex = $state(0);
	let expanded = $state(false);

	let overlayX = $state(50);
	let overlayY = $state(58);
	let overlayScale = $state(68);
	let overlayRotation = $state(-4);

	let previewStage: HTMLDivElement | null = null;
	let draggingOverlay = $state(false);

	const currentMode = $derived(modes.find((mode) => mode.id === activeModeId) ?? modes[0]);
	const currentBaseSrc = $derived(uploadedBaseSrc || activePreview.src);
	const currentBaseAlt = $derived(uploadedBaseName || activePreview.alt);
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const activePreviewIndex = $derived(
		previews.findIndex((preview) => preview.id === activePreview.id)
	);
	const bulkRecommendation = $derived.by(() => {
		const qty = Number.parseInt(bulkQty, 10);
		if (bulkEvent === 'Wedding favor') {
			return qty >= 40
				? 'A coordinated wedding-favor set with one image style and names or dates layered on top.'
				: 'A polished small-batch wedding favor set for close family or the bridal party.';
		}

		if (bulkEvent === 'Christmas gifts') {
			return 'A family gift run with one photo direction and personalized handwriting or short notes.';
		}

		if (bulkEvent === 'Party favors') {
			return 'A playful favor set that still feels personal and elevated, especially with simple overlays.';
		}

		return `A ${bulkStyle.toLowerCase()} set sized for ${bulkQty} keepsakes.`;
	});

	function setPreview(preview: Preview) {
		activePreview = preview;
		activeModeId = preview.mode;
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
			applySignaturePlacement();
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

	function applySignaturePlacement() {
		overlayX = 67;
		overlayY = 79;
		overlayScale = 42;
		overlayRotation = -6;
		revealOverlay = true;
	}

	function applyArtworkPlacement() {
		overlayX = 50;
		overlayY = 50;
		overlayScale = 72;
		overlayRotation = 0;
		revealOverlay = true;
	}

	function updateOverlayPosition(event: PointerEvent) {
		if (!previewStage) return;
		const bounds = previewStage.getBoundingClientRect();
		overlayX = Math.max(10, Math.min(90, ((event.clientX - bounds.left) / bounds.width) * 100));
		overlayY = Math.max(10, Math.min(90, ((event.clientY - bounds.top) / bounds.height) * 100));
	}

	function startOverlayDrag(event: PointerEvent) {
		draggingOverlay = true;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		updateOverlayPosition(event);
	}

	function continueOverlayDrag(event: PointerEvent) {
		if (!draggingOverlay) return;
		updateOverlayPosition(event);
	}

	function endOverlayDrag(event: PointerEvent) {
		draggingOverlay = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
	}

	function openExpanded() {
		expanded = true;
	}

	function closeExpanded() {
		expanded = false;
	}

	function showPreviousPreview() {
		const nextIndex = activePreviewIndex <= 0 ? previews.length - 1 : activePreviewIndex - 1;
		setPreview(previews[nextIndex]);
	}

	function showNextPreview() {
		const nextIndex = activePreviewIndex >= previews.length - 1 ? 0 : activePreviewIndex + 1;
		setPreview(previews[nextIndex]);
	}
</script>

<svelte:head>
	<title>Holographe | Custom Holographic Photo Magnet</title>
	<meta
		name="description"
		content="Premium holographic photo magnets with layered handwriting, drawing, and gift-ready keepsake styling."
	/>
</svelte:head>

<div class="page-shell">
	<section class="hero section">
		<div class="page-wrap hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">Custom holographic photo magnet</p>
				<h1>Photo in. Keepsake out.</h1>
				<p class="hero-text">Upload, layer, preview, and make it feel special.</p>

				<div class="hero-actions">
					<a class="button-primary" href="https://www.amazon.com/dp/B0GWN48WZV"
						>Customize on Amazon</a
					>
					<button class="button-secondary" type="button" onclick={openExpanded}>View larger</button>
				</div>

				<div class="mode-switcher" aria-label="Gift mode">
					{#each modes as mode}
						<button
							type="button"
							class:active={activeModeId === mode.id}
							onclick={() => (activeModeId = mode.id)}
						>
							{mode.label}
						</button>
					{/each}
				</div>

				<p class="mode-headline">{currentMode.headline}</p>
			</div>

			<div class="glass-card studio-card">
				<div class="studio-head">
					<p class="studio-kicker">Preview your keepsake</p>
					<h2>See your image come to life.</h2>
				</div>

				<div class="upload-grid">
					<div class="upload-stack">
						<label class="upload-control">
							<span>Main photo</span>
							<input
								type="file"
								accept="image/*"
								onchange={(event) => updateUploadedImage(event, 'base')}
							/>
						</label>
						<p class="upload-helper">Upload the base image for the magnet.</p>
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
						<p class="upload-helper">Add transparent handwriting, a note, or a drawing.</p>
						{#if uploadedOverlayName}
							<div class="upload-meta">
								<p>{uploadedOverlayName}</p>
								<button type="button" onclick={() => clearUploadedImage('overlay')}>Remove</button>
							</div>
						{/if}
					</div>

					<label class="toggle">
						<input type="checkbox" bind:checked={shimmerOn} />
						<span>Shimmer</span>
					</label>
				</div>

				<div
					bind:this={previewStage}
					class:shimmer-on={shimmerOn}
					class="preview-stage"
					style={`--overlay-x:${overlayX}%; --overlay-y:${overlayY}%; --overlay-scale:${overlayScale / 100}; --overlay-rotation:${overlayRotation}deg; --shimmer:${shimmerValue}%`}
				>
					<button
						type="button"
						class="preview-surface"
						aria-label="Open larger preview"
						onclick={openExpanded}
					>
						<img class="base-image" src={currentBaseSrc} alt={currentBaseAlt} />
						{#if currentOverlaySrc}
							<img
								class:revealed={revealOverlay}
								class="overlay-image"
								src={currentOverlaySrc}
								alt="Overlay artwork preview"
								onpointerdown={startOverlayDrag}
								onpointermove={continueOverlayDrag}
								onpointerup={endOverlayDrag}
								onpointercancel={endOverlayDrag}
							/>
						{/if}
						<div class="shimmer-band"></div>
					</button>
				</div>

				<div class="control-grid">
					<div class="control-card">
						<p class="control-title">Signature scan tool</p>
						<div class="mini-button-row">
							<button type="button" class="mini-button" onclick={applySignaturePlacement}
								>Place as signature</button
							>
							<button type="button" class="mini-button" onclick={applyArtworkPlacement}
								>Center artwork</button
							>
						</div>
					</div>

					<div class="control-card">
						<p class="control-title">Handwriting reveal</p>
						<button
							type="button"
							class="mini-button wide"
							onclick={() => (revealOverlay = !revealOverlay)}
						>
							{revealOverlay ? 'Hide overlay' : 'Reveal overlay'}
						</button>
					</div>

					<div class="control-card">
						<p class="control-title">Shimmer slider</p>
						<input class="slider" type="range" min="12" max="88" bind:value={shimmerValue} />
					</div>

					<div class="control-card">
						<p class="control-title">Overlay size</p>
						<input class="slider" type="range" min="20" max="95" bind:value={overlayScale} />
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap sample-row">
			{#each previews as preview}
				<button
					type="button"
					class="sample-card glass-card"
					class:active={activePreview.id === preview.id}
					onclick={() => setPreview(preview)}
				>
					<img src={preview.src} alt={preview.alt} />
					<span>{preview.label}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="section">
		<div class="page-wrap compare-grid">
			<div class="section-head compact">
				<span class="eyebrow">Before / after</span>
				<h2>See the change.</h2>
			</div>

			<div class="glass-card compare-card">
				<div class="compare-stage">
					<img class="compare-base" src={currentBaseSrc} alt={currentBaseAlt} />
					<div class="compare-after" style={`clip-path: inset(0 ${100 - compareSplit}% 0 0)`}>
						<img class="compare-base" src={currentBaseSrc} alt={currentBaseAlt} />
						{#if currentOverlaySrc}
							<img
								class="compare-overlay"
								src={currentOverlaySrc}
								alt="Overlay artwork preview"
								style={`left:${overlayX}%; top:${overlayY}%; transform: translate(-50%, -50%) scale(${overlayScale / 100}) rotate(${overlayRotation}deg); opacity:${revealOverlay ? 1 : 0}`}
							/>
						{/if}
						<div class="compare-shimmer" style={`left:${shimmerValue}%`}></div>
					</div>
					<div class="compare-line" style={`left:${compareSplit}%`}></div>
				</div>
				<input class="slider" type="range" min="10" max="90" bind:value={compareSplit} />
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap mockup-grid">
			<div class="section-head compact">
				<span class="eyebrow">Live mockups</span>
				<h2>See it in place.</h2>
			</div>

			<div class="mockup-tabs">
				{#each mockups as mockup}
					<button
						type="button"
						class:active={activeMockup === mockup.id}
						onclick={() => (activeMockup = mockup.id)}
					>
						{mockup.label}
					</button>
				{/each}
			</div>

			<div class={`glass-card mockup-stage mockup-${activeMockup}`}>
				<div class="mockup-target">
					<img class="mockup-image" src={currentBaseSrc} alt={currentBaseAlt} />
					{#if currentOverlaySrc}
						<img
							class="mockup-overlay"
							src={currentOverlaySrc}
							alt="Overlay artwork preview"
							style={`left:${overlayX}%; top:${overlayY}%; transform: translate(-50%, -50%) scale(${overlayScale / 100}) rotate(${overlayRotation}deg); opacity:${revealOverlay ? 1 : 0}`}
						/>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap utility-grid">
			<div class="glass-card bulk-card">
				<span class="eyebrow">Bulk gift builder</span>
				<h2>Plan a group order.</h2>
				<div class="bulk-controls">
					<label>
						Event
						<select bind:value={bulkEvent}>
							<option>Wedding favor</option>
							<option>Christmas gifts</option>
							<option>Party favors</option>
						</select>
					</label>
					<label>
						Quantity
						<select bind:value={bulkQty}>
							<option>12</option>
							<option>24</option>
							<option>50</option>
							<option>100</option>
						</select>
					</label>
					<label>
						Style
						<select bind:value={bulkStyle}>
							<option>Photo only</option>
							<option>Photo + handwriting</option>
							<option>Photo + drawing</option>
						</select>
					</label>
				</div>
				<p class="bulk-result">{bulkRecommendation}</p>
			</div>

			<div class="glass-card story-card">
				<span class="eyebrow">Story mode</span>
				<h2>Keep it simple.</h2>
				<div class="story-panel">
					<p class="story-step">0{storyIndex + 1}</p>
					<h3>{storySteps[storyIndex].title}</h3>
					<p>{storySteps[storyIndex].copy}</p>
				</div>
				<div class="mini-button-row">
					<button
						type="button"
						class="mini-button"
						onclick={() => (storyIndex = storyIndex === 0 ? storySteps.length - 1 : storyIndex - 1)}
					>
						Prev
					</button>
					<button
						type="button"
						class="mini-button"
						onclick={() => (storyIndex = storyIndex === storySteps.length - 1 ? 0 : storyIndex + 1)}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap cta-card glass-card">
			<div>
				<span class="eyebrow">Ready when you are</span>
				<h2>Made for one keepsake or a full gifting run.</h2>
			</div>
			<div class="hero-actions">
				<a class="button-primary" href="https://www.amazon.com/dp/B0GWN48WZV">Customize on Amazon</a
				>
				<a class="button-secondary" href="/contact">Start a custom order</a>
			</div>
		</div>
	</section>

	{#if expanded}
		<div
			class="lightbox"
			role="presentation"
			onclick={(event) => {
				if (event.target === event.currentTarget) closeExpanded();
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
				>
					<span>&larr;</span>
				</button>
				<button
					type="button"
					class="lightbox-nav lightbox-nav-right"
					aria-label="Next image"
					onclick={showNextPreview}
				>
					<span>&rarr;</span>
				</button>
				<button
					type="button"
					class="lightbox-close"
					aria-label="Close enlarged preview"
					onclick={closeExpanded}
				>
					Close
				</button>
				<div class="lightbox-media">
					<img class="lightbox-image" src={currentBaseSrc} alt={currentBaseAlt} />
					{#if currentOverlaySrc}
						<img
							class="lightbox-overlay"
							src={currentOverlaySrc}
							alt="Overlay artwork preview"
							style={`left:${overlayX}%; top:${overlayY}%; transform: translate(-50%, -50%) scale(${overlayScale / 100}) rotate(${overlayRotation}deg); opacity:${revealOverlay ? 1 : 0}`}
						/>
					{/if}
				</div>
				<aside class="lightbox-sidebar">
					<p class="lightbox-kicker">Selected keepsake</p>
					<h3>{uploadedBaseName || activePreview.label}</h3>
					<p class="lightbox-copy">
						A larger view for checking the image, overlay placement, and holographic feel.
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
		--pink-soft: #f2b6df;
		--font-display: 'Georgia', 'Iowan Old Style', serif;
		--font-body: 'Space Grotesk', 'Avenir Next', sans-serif;
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
	}

	.ambient {
		display: none;
	}

	.hero-grid,
	.compare-grid,
	.mockup-grid,
	.utility-grid {
		display: grid;
		gap: 1rem;
	}

	.hero-grid {
		grid-template-columns: minmax(0, 0.88fr) minmax(320px, 1.12fr);
		align-items: start;
	}

	.hero-copy {
		display: grid;
		gap: 0.85rem;
		padding-top: 1rem;
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 6vw, 4.6rem);
		line-height: 0.96;
		letter-spacing: -0.05em;
		font-weight: 500;
		max-width: 9ch;
	}

	h2 {
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 2.5vw, 2rem);
		font-weight: 500;
		line-height: 1.1;
	}

	h3 {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 500;
	}

	.hero-text,
	.mode-headline,
	.bulk-result,
	.story-panel p,
	.lightbox-copy {
		color: var(--tone-soft);
		line-height: 1.55;
	}

	.hero-actions,
	.mini-button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	.mode-switcher,
	.mockup-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.mode-switcher button,
	.mockup-tabs button,
	.mini-button,
	.preview-surface,
	.sample-card,
	.stage-card,
	.lightbox-nav,
	.lightbox-close {
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f4dfa8'/%3E%3Cstop offset='50%25' stop-color='%23c9d8ff'/%3E%3Cstop offset='100%25' stop-color='%23f2b6df'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M17 3l3.3 10.7H31l-8.6 6.2L25.8 31 17 24.9 8.2 31l3.4-11.1L3 13.7h10.7L17 3z' fill='url(%23g)'/%3E%3C/svg%3E")
				12 12,
			pointer;
	}

	.mode-switcher button,
	.mockup-tabs button,
	.mini-button {
		padding: 0.55rem 0.8rem;
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.08),
				rgba(199, 216, 255, 0.08),
				rgba(242, 182, 223, 0.08)
			),
			rgba(255, 255, 255, 0.03);
		color: var(--tone-soft);
		font-weight: 700;
	}

	.mode-switcher button.active,
	.mockup-tabs button.active {
		border-color: rgba(224, 205, 162, 0.22);
		color: var(--tone-strong);
	}

	.studio-card,
	.compare-card,
	.bulk-card,
	.story-card,
	.cta-card,
	.sample-card,
	.feature-card,
	.mockup-stage,
	.spec-grid {
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: 1.35rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)), var(--panel);
		backdrop-filter: blur(18px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 24px 60px rgba(0, 0, 0, 0.28);
	}

	.studio-card {
		display: grid;
		gap: 0.9rem;
	}

	.studio-head,
	.section-head.compact {
		display: grid;
		gap: 0.35rem;
	}

	.studio-kicker,
	.control-title,
	.bulk-card label,
	.lightbox-kicker,
	.story-step {
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--tone-muted);
		font-weight: 700;
	}

	.upload-grid,
	.control-grid,
	.features {
		display: grid;
		gap: 0.8rem;
	}

	.upload-grid {
		grid-template-columns: 1fr 1fr auto;
		align-items: start;
	}

	.control-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.control-card {
		display: grid;
		gap: 0.55rem;
	}

	.upload-stack {
		display: grid;
		gap: 0.35rem;
	}

	.upload-control {
		display: grid;
		gap: 0.35rem;
		color: var(--tone-soft);
		font-weight: 700;
		font-size: 0.82rem;
	}

	.upload-control input,
	.bulk-card select {
		width: 100%;
		padding: 0.6rem 0.75rem;
		border-radius: 0.9rem;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: var(--tone-strong);
	}

	.upload-helper {
		color: var(--tone-muted);
		font-size: 0.74rem;
		line-height: 1.4;
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
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding-top: 1.8rem;
		color: var(--tone-soft);
		font-weight: 700;
	}

	.preview-stage {
		position: relative;
		padding: 0.35rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.18),
				rgba(199, 216, 255, 0.14),
				rgba(242, 182, 223, 0.12)
			),
			rgba(255, 255, 255, 0.03);
		overflow: hidden;
	}

	.preview-surface {
		position: relative;
		display: flex;
		justify-content: center;
		width: 100%;
		padding: 0;
		background: transparent;
		border: 0;
	}

	.base-image {
		display: block;
		width: min(14rem, 100%);
		border-radius: 1rem;
	}

	.overlay-image,
	.compare-overlay,
	.mockup-overlay,
	.lightbox-overlay {
		position: absolute;
		left: var(--overlay-x);
		top: var(--overlay-y);
		transform: translate(-50%, -50%) scale(var(--overlay-scale)) rotate(var(--overlay-rotation));
		transform-origin: center;
		max-width: 70%;
		max-height: 70%;
		object-fit: contain;
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.overlay-image {
		inset: auto;
		cursor: move;
	}

	.overlay-image.revealed,
	.compare-overlay,
	.mockup-overlay,
	.lightbox-overlay {
		opacity: 1;
	}

	.shimmer-band {
		position: absolute;
		inset: -18% auto -18% calc(var(--shimmer) - 78%);
		width: 30%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0.56),
			rgba(255, 255, 255, 0.08),
			transparent
		);
		transform: skewX(-18deg);
		opacity: 0;
		pointer-events: none;
	}

	.shimmer-on .shimmer-band {
		opacity: 1;
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

	.slider {
		width: 100%;
	}

	.sample-row,
	.features,
	.utility-grid,
	.bottom-grid {
		display: grid;
		gap: 0.8rem;
	}

	.sample-row,
	.features {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.sample-card {
		display: grid;
		gap: 0.55rem;
		text-align: left;
	}

	.sample-card img {
		display: block;
		width: 100%;
		height: 8rem;
		object-fit: cover;
		border-radius: 0.9rem;
	}

	.sample-card.active {
		border-color: rgba(224, 205, 162, 0.26);
	}

	.compare-card,
	.mockup-stage {
		display: grid;
		gap: 0.8rem;
	}

	.compare-stage {
		position: relative;
		min-height: 18rem;
		border-radius: 1rem;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.03);
	}

	.compare-base {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.compare-after {
		position: absolute;
		inset: 0;
	}

	.compare-shimmer {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 18%;
		transform: translateX(-50%);
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.38), transparent);
	}

	.compare-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		background: linear-gradient(180deg, transparent, var(--accent-soft), transparent);
	}

	.mockup-tabs {
		margin-top: 0.2rem;
	}

	.mockup-stage {
		min-height: 22rem;
		place-items: center;
	}

	.mockup-target {
		position: relative;
		width: min(16rem, 56vw);
		aspect-ratio: 0.82;
		border-radius: 1.2rem;
		overflow: hidden;
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.3);
	}

	.mockup-fridge {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			linear-gradient(180deg, #24272f, #17191e);
	}

	.mockup-locker {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
			linear-gradient(180deg, #28313a, #151a21);
	}

	.mockup-envelope {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
			linear-gradient(180deg, #3a3029, #1e1814);
	}

	.mockup-image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.utility-grid {
		grid-template-columns: 1.1fr 0.9fr;
	}

	.bulk-controls {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
		margin-top: 0.9rem;
	}

	.bulk-card label {
		display: grid;
		gap: 0.35rem;
	}

	.bulk-result {
		margin-top: 0.9rem;
	}

	.story-card,
	.story-panel {
		display: grid;
		gap: 0.75rem;
	}

	.cta-card,
	.lightbox-dialog {
		display: grid;
		gap: 1rem;
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
		grid-template-columns: minmax(0, 1fr) 240px;
		align-items: stretch;
	}

	.lightbox-media {
		position: relative;
		display: grid;
		place-items: center;
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

	.lightbox-nav,
	.lightbox-close {
		position: absolute;
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
	}

	.lightbox-nav {
		top: 50%;
		transform: translateY(-50%);
		width: 3.15rem;
		height: 3.15rem;
	}

	.lightbox-nav-left {
		left: 1rem;
	}

	.lightbox-nav-right {
		right: 15.5rem;
	}

	.lightbox-close {
		top: 0.9rem;
		right: 0.9rem;
		padding: 0.45rem 0.75rem;
	}

	@media (max-width: 960px) {
		.hero-grid,
		.utility-grid,
		.upload-grid,
		.features,
		.sample-row {
			grid-template-columns: 1fr;
		}

		.upload-grid,
		.control-grid,
		.bulk-controls {
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

		.lightbox-nav-right {
			right: 1rem;
		}
	}

	@media (max-width: 640px) {
		.base-image,
		.mockup-target {
			width: min(18rem, 100%);
		}

		.stage-card-medium {
			display: none;
		}
	}
</style>
