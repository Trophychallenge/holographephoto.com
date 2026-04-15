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
		heading: string;
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
		{ id: 'quiet', label: 'Quiet', heading: 'Soft and personal.' },
		{ id: 'ceremony', label: 'Ceremony', heading: 'Elegant for weddings and milestones.' },
		{ id: 'signature', label: 'Signature', heading: 'A cleaner, bolder finish.' }
	];

	const mockups: { id: Mockup; label: string }[] = [
		{ id: 'fridge', label: 'Fridge' },
		{ id: 'locker', label: 'Locker' },
		{ id: 'envelope', label: 'Gift envelope' }
	];

	const storySteps = [
		{ title: 'Upload', copy: 'Start with the photo you want to keep.' },
		{ title: 'Layer', copy: 'Add a drawing, note, or handwriting overlay.' },
		{ title: 'Preview', copy: 'See the finished keepsake before ordering.' },
		{ title: 'Gift', copy: 'Order one or plan a full set.' }
	];

	let activePreview = $state(previews[0]);
	let activeModeId = $state<GiftMode['id']>('quiet');
	let uploadedBaseSrc = $state('');
	let uploadedBaseName = $state('');
	let uploadedOverlaySrc = $state('');
	let uploadedOverlayName = $state('');
	let revealOverlay = $state(true);
	let compareSplit = $state(52);
	let activeMockup = $state<Mockup>('fridge');
	let bulkEvent = $state('Wedding favor');
	let bulkQty = $state('24');
	let bulkStyle = $state('Photo + handwriting');
	let storyIndex = $state(0);
	let expanded = $state(false);

	let overlayX = $state(66);
	let overlayY = $state(78);
	let overlayScale = $state(42);
	let overlayRotation = $state(-6);

	let baseUploadInput: HTMLInputElement | null = null;
	let baseCameraInput: HTMLInputElement | null = null;
	let overlayUploadInput: HTMLInputElement | null = null;
	let overlayCameraInput: HTMLInputElement | null = null;
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
		if (bulkEvent === 'Wedding favor') {
			return bulkQty === '100'
				? 'Best for large wedding tables, welcome gifts, and coordinated favor sets.'
				: 'A refined wedding favor run with one image style and names, dates, or short notes.';
		}

		if (bulkEvent === 'Christmas gifts') {
			return 'Ideal for a family set with one visual direction and personalized handwriting.';
		}

		if (bulkEvent === 'Party favors') {
			return 'A playful group order that still feels polished and personal.';
		}

		return `${bulkQty} keepsakes with a ${bulkStyle.toLowerCase()} finish.`;
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
		overlayX = 66;
		overlayY = 78;
		overlayScale = 42;
		overlayRotation = -6;
		revealOverlay = true;
	}

	function applyArtworkPlacement() {
		overlayX = 50;
		overlayY = 51;
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
	<title>Holographe | Personalized Holographic Photo Magnet</title>
	<meta
		name="description"
		content="Upload a photo, add handwriting or artwork, and preview a premium holographic keepsake magnet."
	/>
</svelte:head>

<div class="page-shell">
	<section class="section hero">
		<div class="page-wrap hero-wrap">
			<div class="hero-copy">
				<p class="eyebrow">Premium personalized keepsake</p>
				<h1>Your photo, made worth keeping.</h1>
				<p class="hero-text">Upload a photo. Add a note or drawing. Preview it instantly.</p>

				<div class="hero-actions">
					<a class="button-primary" href="https://www.amazon.com/dp/B0GWN48WZV">Shop Amazon</a>
					<a class="button-secondary" href="/prices">See pricing</a>
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

				<p class="mode-headline">{currentMode.heading}</p>
			</div>

			<div class="glass-card studio-card">
				<div class="studio-top">
					<div>
						<p class="studio-kicker">Preview your keepsake</p>
						<h2>Try your image here.</h2>
					</div>
					<p class="studio-price">From $25</p>
				</div>

				<div class="upload-grid">
					<div class="upload-card">
						<p class="upload-label">Main photo</p>
						<div class="action-row">
							<button type="button" class="action-button" onclick={() => baseUploadInput?.click()}>
								Upload
							</button>
							<button
								type="button"
								class="action-button ghost"
								onclick={() => baseCameraInput?.click()}
							>
								Take photo
							</button>
						</div>
						<input
							bind:this={baseUploadInput}
							class="hidden-input"
							type="file"
							accept="image/*"
							onchange={(event) => updateUploadedImage(event, 'base')}
						/>
						<input
							bind:this={baseCameraInput}
							class="hidden-input"
							type="file"
							accept="image/*"
							capture="environment"
							onchange={(event) => updateUploadedImage(event, 'base')}
						/>
						{#if uploadedBaseName}
							<div class="upload-meta">
								<p>{uploadedBaseName}</p>
								<button type="button" onclick={() => clearUploadedImage('base')}>Remove</button>
							</div>
						{:else}
							<p class="upload-helper">Best for the main photo.</p>
						{/if}
					</div>

					<div class="upload-card">
						<p class="upload-label">Overlay artwork</p>
						<div class="action-row">
							<button
								type="button"
								class="action-button"
								onclick={() => overlayUploadInput?.click()}
							>
								Upload
							</button>
							<button
								type="button"
								class="action-button ghost"
								onclick={() => overlayCameraInput?.click()}
							>
								Take photo
							</button>
						</div>
						<input
							bind:this={overlayUploadInput}
							class="hidden-input"
							type="file"
							accept="image/png,image/webp,image/*"
							onchange={(event) => updateUploadedImage(event, 'overlay')}
						/>
						<input
							bind:this={overlayCameraInput}
							class="hidden-input"
							type="file"
							accept="image/png,image/webp,image/*"
							capture="environment"
							onchange={(event) => updateUploadedImage(event, 'overlay')}
						/>
						{#if uploadedOverlayName}
							<div class="upload-meta">
								<p>{uploadedOverlayName}</p>
								<button type="button" onclick={() => clearUploadedImage('overlay')}>Remove</button>
							</div>
						{:else}
							<p class="upload-helper">Perfect for handwriting, notes, or a child’s drawing.</p>
						{/if}
					</div>
				</div>

				<div
					bind:this={previewStage}
					class="preview-stage shimmer-on"
					style={`--overlay-x:${overlayX}%; --overlay-y:${overlayY}%; --overlay-scale:${overlayScale / 100}; --overlay-rotation:${overlayRotation}deg;`}
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

				<div class="control-row">
					<button type="button" class="mini-button" onclick={applySignaturePlacement}>
						Signature placement
					</button>
					<button type="button" class="mini-button" onclick={applyArtworkPlacement}>
						Center overlay
					</button>
					<button
						type="button"
						class="mini-button"
						onclick={() => (revealOverlay = !revealOverlay)}
					>
						{revealOverlay ? 'Hide overlay' : 'Show overlay'}
					</button>
					<button type="button" class="mini-button" onclick={openExpanded}
						>Open large preview</button
					>
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
		<div class="page-wrap feature-grid">
			<div class="glass-card compare-card">
				<div class="section-head compact">
					<span class="eyebrow">Before / after</span>
					<h2>See the difference.</h2>
				</div>

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
						<div class="compare-shimmer"></div>
					</div>
					<div class="compare-line" style={`left:${compareSplit}%`}></div>
				</div>

				<input class="slider" type="range" min="10" max="90" bind:value={compareSplit} />
			</div>

			<div class="glass-card story-card">
				<div class="section-head compact">
					<span class="eyebrow">Story mode</span>
					<h2>Fast and simple.</h2>
				</div>

				<div class="story-panel">
					<p class="story-step">0{storyIndex + 1}</p>
					<h3>{storySteps[storyIndex].title}</h3>
					<p>{storySteps[storyIndex].copy}</p>
				</div>

				<div class="mini-nav">
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
		<div class="page-wrap">
			<div class="section-head compact">
				<span class="eyebrow">Mockups</span>
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
				<div class="section-head compact">
					<span class="eyebrow">Bulk gift builder</span>
					<h2>Plan a group order.</h2>
				</div>

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
				<a class="button-secondary bulk-link" href="/prices">See bulk pricing</a>
			</div>

			<div class="glass-card mini-gallery">
				<div class="section-head compact">
					<span class="eyebrow">A few ways to use it</span>
					<h2>Gift-ready from the start.</h2>
				</div>

				<ul>
					<li>Wedding favors</li>
					<li>Christmas gifts for family</li>
					<li>Baby keepsakes</li>
					<li>Memorial pieces</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap cta-card glass-card">
			<div>
				<span class="eyebrow">Ready to order</span>
				<h2>Made for one keepsake or a full gift run.</h2>
			</div>
			<div class="hero-actions">
				<a class="button-primary" href="https://www.amazon.com/dp/B0GWN48WZV">Order on Amazon</a>
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
						A larger look at the image, artwork overlay, and final finish.
					</p>
					<div class="lightbox-meta">
						<span>Premium holographic finish</span>
						<span>Handwriting and drawing overlay</span>
						<span>Gift-ready keepsake format</span>
					</div>
				</aside>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(:root) {
		--panel: rgba(14, 14, 17, 0.8);
		--line: rgba(224, 205, 162, 0.14);
		--tone-strong: #f7f0e2;
		--tone-soft: rgba(241, 232, 214, 0.84);
		--tone-muted: rgba(204, 186, 150, 0.74);
		--accent: #d9b466;
		--accent-soft: #f0dec0;
		--iridescent: #c7d8ff;
		--rose: #f2b6df;
		--font-display: 'Georgia', 'Iowan Old Style', serif;
		--font-body: 'Space Grotesk', 'Avenir Next', sans-serif;
	}

	:global(body) {
		margin: 0;
		font-family: var(--font-body);
		background: linear-gradient(180deg, #060607 0%, #0b0b0e 48%, #060607 100%);
		color: var(--tone-strong);
	}

	.page-shell {
		min-height: 100vh;
	}

	h1,
	h2,
	h3,
	p,
	ul {
		margin: 0;
	}

	.hero-wrap {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr);
		align-items: center;
		gap: 1.2rem;
		padding-top: 0.5rem;
	}

	.hero-copy {
		display: grid;
		gap: 0.85rem;
		max-width: 29rem;
		margin: 0 auto 0 0;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.7rem, 6vw, 4.9rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		font-weight: 500;
		max-width: 8.5ch;
	}

	h2 {
		font-family: var(--font-display);
		font-size: clamp(1.45rem, 2.7vw, 2.2rem);
		font-weight: 500;
		line-height: 1.08;
	}

	h3 {
		font-family: var(--font-display);
		font-size: 1.22rem;
		font-weight: 500;
	}

	.hero-text,
	.mode-headline,
	.bulk-result,
	.story-panel p,
	.lightbox-copy,
	.upload-helper {
		color: var(--tone-soft);
		line-height: 1.55;
	}

	.hero-actions,
	.mode-switcher,
	.control-row,
	.action-row,
	.mini-nav,
	.mockup-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.studio-card,
	.sample-card,
	.compare-card,
	.story-card,
	.mockup-stage,
	.bulk-card,
	.mini-gallery,
	.cta-card {
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: 1.4rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)), var(--panel);
		backdrop-filter: blur(18px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 24px 60px rgba(0, 0, 0, 0.28);
	}

	.studio-card {
		display: grid;
		gap: 0.95rem;
		max-width: 100%;
	}

	.studio-top,
	.section-head.compact {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
	}

	.section-head.compact {
		align-items: start;
		flex-direction: column;
	}

	.studio-kicker,
	.story-step,
	.lightbox-kicker,
	.upload-label,
	.bulk-card label {
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--tone-muted);
		font-weight: 700;
	}

	.studio-price {
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		background: linear-gradient(
			135deg,
			rgba(240, 222, 192, 0.16),
			rgba(199, 216, 255, 0.14),
			rgba(242, 182, 223, 0.12)
		);
		border: 1px solid rgba(224, 205, 162, 0.16);
		color: var(--tone-strong);
		font-weight: 700;
	}

	.mode-switcher button,
	.mockup-tabs button,
	.mini-button,
	.action-button,
	.upload-meta button,
	.lightbox-nav,
	.lightbox-close,
	.sample-card {
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease,
			box-shadow 180ms ease;
	}

	.mode-switcher button,
	.mockup-tabs button,
	.mini-button,
	.action-button,
	.upload-meta button,
	.lightbox-nav,
	.lightbox-close {
		border-radius: 999px;
		border: 1px solid rgba(224, 205, 162, 0.13);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.1),
				rgba(199, 216, 255, 0.08),
				rgba(242, 182, 223, 0.08)
			),
			rgba(255, 255, 255, 0.03);
		color: var(--tone-strong);
	}

	.mode-switcher button,
	.mockup-tabs button,
	.mini-button,
	.action-button {
		padding: 0.62rem 0.92rem;
		font-weight: 700;
	}

	.action-button {
		min-width: 7.4rem;
	}

	.action-button.ghost {
		color: var(--tone-soft);
		background: rgba(255, 255, 255, 0.03);
	}

	.mode-switcher button.active,
	.mockup-tabs button.active,
	.mode-switcher button:hover,
	.mockup-tabs button:hover,
	.mini-button:hover,
	.action-button:hover,
	.upload-meta button:hover,
	.lightbox-nav:hover,
	.lightbox-close:hover,
	.sample-card:hover {
		transform: translateY(-1px);
		border-color: rgba(224, 205, 162, 0.28);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
	}

	.upload-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.8rem;
	}

	.upload-card {
		display: grid;
		gap: 0.55rem;
		padding: 0.85rem;
		border-radius: 1rem;
		border: 1px solid rgba(224, 205, 162, 0.1);
		background: rgba(255, 255, 255, 0.03);
	}

	.hidden-input {
		display: none;
	}

	.upload-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.55rem;
	}

	.upload-meta p {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.78rem;
		color: var(--tone-muted);
	}

	.upload-meta button {
		padding: 0.38rem 0.7rem;
	}

	.preview-stage {
		position: relative;
		padding: 0.4rem;
		border-radius: 1.3rem;
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
		border: 0;
		background: transparent;
	}

	.base-image {
		display: block;
		width: min(16rem, 100%);
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
		cursor: grab;
	}

	.overlay-image.revealed,
	.compare-overlay,
	.mockup-overlay,
	.lightbox-overlay {
		opacity: 1;
	}

	.shimmer-band {
		position: absolute;
		inset: -18% auto -18% -8%;
		width: 24%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.12),
			rgba(255, 255, 255, 0.56),
			rgba(255, 255, 255, 0.1),
			transparent
		);
		transform: skewX(-18deg);
		animation: shimmerPass 4.8s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes shimmerPass {
		0%,
		18% {
			transform: translateX(0) skewX(-18deg);
			opacity: 0;
		}

		28%,
		62% {
			transform: translateX(380%) skewX(-18deg);
			opacity: 1;
		}

		100% {
			transform: translateX(460%) skewX(-18deg);
			opacity: 0;
		}
	}

	.control-row,
	.sample-row,
	.feature-grid,
	.utility-grid {
		display: grid;
		gap: 0.8rem;
	}

	.control-row {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.sample-row {
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
		height: 8.2rem;
		object-fit: cover;
		border-radius: 0.9rem;
	}

	.sample-card.active {
		border-color: rgba(224, 205, 162, 0.26);
	}

	.feature-grid {
		grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
	}

	.compare-card,
	.story-card,
	.bulk-card,
	.mini-gallery,
	.cta-card {
		display: grid;
		gap: 0.85rem;
	}

	.compare-stage {
		position: relative;
		min-height: 19rem;
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
		left: 54%;
		width: 18%;
		transform: translateX(-50%);
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.34), transparent);
	}

	.compare-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		background: linear-gradient(180deg, transparent, var(--accent-soft), transparent);
	}

	.slider {
		width: 100%;
	}

	.story-panel {
		display: grid;
		gap: 0.5rem;
		padding: 0.95rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
	}

	.mockup-stage {
		display: grid;
		place-items: center;
		min-height: 22rem;
		margin-top: 0.8rem;
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
	}

	.bulk-card label {
		display: grid;
		gap: 0.35rem;
	}

	.bulk-card select {
		width: 100%;
		padding: 0.72rem 0.82rem;
		border-radius: 0.9rem;
		border: 1px solid rgba(224, 205, 162, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: var(--tone-strong);
	}

	.bulk-link {
		justify-self: start;
	}

	.mini-gallery ul {
		padding-left: 1rem;
		color: var(--tone-soft);
		line-height: 1.8;
	}

	.cta-card {
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		padding: 1.2rem;
		background: rgba(4, 4, 6, 0.84);
		backdrop-filter: blur(10px);
	}

	.lightbox-dialog {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 250px;
		align-items: stretch;
		gap: 1rem;
		width: min(94vw, 1240px);
		height: min(82vh, 900px);
		padding: 1rem;
		border-radius: 1.5rem;
		border: 1px solid var(--line);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)), var(--panel);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
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
		padding: 1rem;
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
		box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
	}

	.lightbox-nav {
		top: 50%;
		transform: translateY(-50%);
		width: 3.1rem;
		height: 3.1rem;
	}

	.lightbox-nav-left {
		left: 1rem;
	}

	.lightbox-nav-right {
		right: 16rem;
	}

	.lightbox-close {
		top: 0.9rem;
		right: 0.9rem;
		padding: 0.45rem 0.75rem;
	}

	@media (max-width: 960px) {
		.hero-wrap,
		.feature-grid,
		.utility-grid,
		.upload-grid,
		.control-row,
		.sample-row,
		.bulk-controls,
		.cta-card {
			grid-template-columns: 1fr;
		}

		.hero-copy {
			max-width: none;
			margin: 0;
		}

		.control-row {
			display: grid;
		}

		.lightbox-dialog {
			grid-template-columns: 1fr;
			height: auto;
			max-height: 88vh;
		}

		.lightbox-nav-right {
			right: 1rem;
		}

		.lightbox-sidebar {
			padding-top: 0.4rem;
		}
	}
</style>
