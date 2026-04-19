<script lang="ts">
	import { resolve } from '$app/paths';
	import { checkoutOffers } from '$lib/pricing';

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
		{ id: 'signature', label: 'Signature', heading: 'Clean, bold, and gift-ready.' }
	];

	const mockups: { id: Mockup; label: string }[] = [
		{ id: 'fridge', label: 'Fridge' },
		{ id: 'locker', label: 'Locker' },
		{ id: 'envelope', label: 'Envelope' }
	];

	const reelTags = ['Real shimmer', 'Closer preview', 'Deluxe finish'];
	const heroVideoSrc = '/holographe/hero-reel.mov';
	const heroVideoPoster = '/holographe/lydholowed.png';

	let activePreview = $state(previews[0]);
	let activeModeId = $state<GiftMode['id']>('quiet');
	let uploadedBaseSrc = $state('');
	let uploadedBaseName = $state('');
	let uploadedOverlaySrc = $state('');
	let uploadedOverlayName = $state('');
	let uploadedBaseBlobUrl = $state('');
	let uploadedOverlayBlobUrl = $state('');
	let baseUploadState = $state<'idle' | 'uploading' | 'saved' | 'error'>('idle');
	let overlayUploadState = $state<'idle' | 'uploading' | 'saved' | 'error'>('idle');
	let baseUploadMessage = $state('');
	let overlayUploadMessage = $state('');
	let revealOverlay = $state(true);
	let compareSplit = $state(52);
	let activeMockup = $state<Mockup>('fridge');
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
	let selectedBundle = $state(String(checkoutOffers[0].quantity));

	const currentMode = $derived(modes.find((mode) => mode.id === activeModeId) ?? modes[0]);
	const currentBaseSrc = $derived(uploadedBaseSrc || activePreview.src);
	const currentBaseAlt = $derived(uploadedBaseName || activePreview.alt);
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const activePreviewIndex = $derived(
		previews.findIndex((preview) => preview.id === activePreview.id)
	);

	function setPreview(preview: Preview) {
		activePreview = preview;
		activeModeId = preview.mode;
	}

	async function persistDesignAsset(file: File, slot: 'base' | 'overlay') {
		const payload = new FormData();
		payload.set('file', file);
		payload.set('slot', slot);

		const response = await fetch('/api/upload-design', {
			method: 'POST',
			body: payload
		});

		const result = (await response.json()) as { error?: string; url?: string };

		if (!response.ok || !result.url) {
			throw new Error(result.error || 'Upload failed.');
		}

		return result.url;
	}

	async function updateUploadedImage(event: Event, type: 'base' | 'overlay') {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const nextUrl = URL.createObjectURL(file);
		if (type === 'base') {
			if (uploadedBaseSrc) URL.revokeObjectURL(uploadedBaseSrc);
			uploadedBaseSrc = nextUrl;
			uploadedBaseName = file.name;
			uploadedBaseBlobUrl = '';
			baseUploadState = 'uploading';
			baseUploadMessage = 'Saving your photo...';
		} else {
			if (uploadedOverlaySrc) URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = nextUrl;
			uploadedOverlayName = file.name;
			uploadedOverlayBlobUrl = '';
			overlayUploadState = 'uploading';
			overlayUploadMessage = 'Saving your overlay...';
			applySignaturePlacement();
		}

		input.value = '';

		try {
			const blobUrl = await persistDesignAsset(file, type);
			if (type === 'base') {
				uploadedBaseBlobUrl = blobUrl;
				baseUploadState = 'saved';
				baseUploadMessage = 'Photo saved with this design.';
			} else {
				uploadedOverlayBlobUrl = blobUrl;
				overlayUploadState = 'saved';
				overlayUploadMessage = 'Overlay saved with this design.';
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Upload failed.';
			if (type === 'base') {
				baseUploadState = 'error';
				baseUploadMessage = message;
			} else {
				overlayUploadState = 'error';
				overlayUploadMessage = message;
			}
		}
	}

	function clearUploadedImage(type: 'base' | 'overlay') {
		if (type === 'base' && uploadedBaseSrc) {
			URL.revokeObjectURL(uploadedBaseSrc);
			uploadedBaseSrc = '';
			uploadedBaseName = '';
			uploadedBaseBlobUrl = '';
			baseUploadState = 'idle';
			baseUploadMessage = '';
		}

		if (type === 'overlay' && uploadedOverlaySrc) {
			URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = '';
			uploadedOverlayName = '';
			uploadedOverlayBlobUrl = '';
			overlayUploadState = 'idle';
			overlayUploadMessage = '';
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
	<title>Customize | Holographe</title>
	<meta
		name="description"
		content="Use the Holographe customizer to upload your photo, add an overlay, preview the keepsake, and order."
	/>
</svelte:head>

<div class="studio-shell">
	<section class="section studio-hero">
		<div class="page-wrap studio-head">
			<div class="studio-copy">
				<p class="eyebrow">Interactive customizer</p>
				<h1>Build your keepsake.</h1>
				<p>
					Upload a photo, add an overlay, and preview the final piece before ordering. Built to work
					cleanly on mobile.
				</p>
			</div>

			<div class="order-bar glass-card">
				<div>
					<p class="order-kicker">Buy right after designing</p>
					<h2>Personalize, then purchase here.</h2>
				</div>
				<form class="order-checkout" method="POST" action="/checkout">
					<input type="hidden" name="source" value="customize-hero" />
					<input type="hidden" name="base_name" value={uploadedBaseName} />
					<input type="hidden" name="overlay_name" value={uploadedOverlayName} />
					<input type="hidden" name="base_blob_url" value={uploadedBaseBlobUrl} />
					<input type="hidden" name="overlay_blob_url" value={uploadedOverlayBlobUrl} />
					<input type="hidden" name="gift_mode" value={activeModeId} />
					<label>
						<span>Bundle</span>
						<select name="quantity" bind:value={selectedBundle}>
							{#each checkoutOffers as offer (offer.quantity)}
								<option value={offer.quantity}>{offer.quantity} for {offer.priceLabel}</option>
							{/each}
						</select>
					</label>
					<div class="order-actions">
						<button
							class="button-primary"
							type="submit"
							disabled={baseUploadState === 'uploading' || overlayUploadState === 'uploading'}
						>
							{baseUploadState === 'uploading' || overlayUploadState === 'uploading'
								? 'Saving design...'
								: 'Buy this design'}
						</button>
						<a class="button-secondary" href={resolve('/contact')}>Need help?</a>
					</div>
				</form>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap reel-grid">
			<div class="glass-card reel-card">
				<p class="card-kicker">Motion preview</p>
				<h2>See the finish in motion while you build.</h2>
				<p>
					Use the reel as a live reference for shimmer, depth, and the finished keepsake feel while
					you upload and place your image.
				</p>
				<div class="reel-tags">
					{#each reelTags as item}
						<span>{item}</span>
					{/each}
				</div>
			</div>

			<div class="glass-card reel-video-card">
				<div class="reel-shell">
					<!-- svelte-ignore a11y_media_has_caption because the current preview reel has no spoken audio -->
					<video
						class="reel-video"
						src={heroVideoSrc}
						poster={heroVideoPoster}
						playsinline
						controls
						preload="metadata"
						aria-label="Reference video preview of the holographic keepsake"
					>
						<p>
							Your browser does not support embedded video.
							<a href={heroVideoSrc}>Open the preview reel directly.</a>
						</p>
					</video>
					<div class="reel-glow"></div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap studio-grid">
			<div class="glass-card preview-card">
				<div class="card-top">
					<div>
						<p class="card-kicker">Preview your keepsake</p>
						<h2>Upload and adjust in one place.</h2>
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
				</div>

				<p class="mode-copy">{currentMode.heading}</p>

				<div
					bind:this={previewStage}
					class="preview-stage"
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

				<div class="sample-row">
					{#each previews as preview}
						<button
							type="button"
							class="sample-card"
							class:active={activePreview.id === preview.id}
							onclick={() => setPreview(preview)}
						>
							<img src={preview.src} alt={preview.alt} />
							<span>{preview.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="side-stack">
				<div class="glass-card action-card">
					<p class="card-kicker">Upload photo</p>
					<h2>Main image</h2>
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
						{#if baseUploadMessage}
							<p class:upload-error={baseUploadState === 'error'} class="upload-note">
								{baseUploadMessage}
							</p>
						{/if}
					{:else}
						<p class="helper">Use the main photo for the magnet.</p>
					{/if}
				</div>

				<div class="glass-card action-card">
					<p class="card-kicker">Upload overlay</p>
					<h2>Handwriting or artwork</h2>
					<div class="action-row">
						<button type="button" class="action-button" onclick={() => overlayUploadInput?.click()}>
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
						{#if overlayUploadMessage}
							<p class:upload-error={overlayUploadState === 'error'} class="upload-note">
								{overlayUploadMessage}
							</p>
						{/if}
					{:else}
						<p class="helper">Ideal for signatures, letters, notes, or child art.</p>
					{/if}
				</div>

				<div class="glass-card action-card">
					<p class="card-kicker">Placement</p>
					<h2>Adjust the overlay</h2>
					<div class="control-row">
						<button type="button" class="mini-button" onclick={applySignaturePlacement}>
							Signature
						</button>
						<button type="button" class="mini-button" onclick={applyArtworkPlacement}>
							Center
						</button>
						<button
							type="button"
							class="mini-button"
							onclick={() => (revealOverlay = !revealOverlay)}
						>
							{revealOverlay ? 'Hide' : 'Show'}
						</button>
						<button type="button" class="mini-button" onclick={openExpanded}>Enlarge</button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap lower-grid">
			<div class="glass-card compare-card">
				<p class="card-kicker">Before / after</p>
				<h2>See the finished effect.</h2>
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

			<div class="glass-card mockup-card">
				<p class="card-kicker">Mockups</p>
				<h2>See it in place.</h2>
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

				<div class={`mockup-stage mockup-${activeMockup}`}>
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
			<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded preview">
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
					aria-label="Close preview"
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
					<p class="card-kicker">Selected keepsake</p>
					<h2>{uploadedBaseName || activePreview.label}</h2>
					<p>A closer look at the image, overlay, and final finish.</p>
					<div class="order-actions">
						<form class="lightbox-checkout" method="POST" action="/checkout">
							<input type="hidden" name="source" value="customize-lightbox" />
							<input type="hidden" name="base_name" value={uploadedBaseName} />
							<input type="hidden" name="overlay_name" value={uploadedOverlayName} />
							<input type="hidden" name="base_blob_url" value={uploadedBaseBlobUrl} />
							<input type="hidden" name="overlay_blob_url" value={uploadedOverlayBlobUrl} />
							<input type="hidden" name="gift_mode" value={activeModeId} />
							<input type="hidden" name="quantity" value={selectedBundle} />
							<button
								class="button-primary"
								type="submit"
								disabled={baseUploadState === 'uploading' || overlayUploadState === 'uploading'}
							>
								{baseUploadState === 'uploading' || overlayUploadState === 'uploading'
									? 'Saving design...'
									: 'Buy this design'}
							</button>
						</form>
						<a class="button-secondary" href={resolve('/contact')}>Need help?</a>
					</div>
				</aside>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at 10% 0%, rgba(199, 216, 255, 0.16), transparent 24%),
			radial-gradient(circle at 90% 12%, rgba(242, 182, 223, 0.14), transparent 22%),
			radial-gradient(circle at 80% 84%, rgba(217, 180, 102, 0.12), transparent 20%),
			linear-gradient(180deg, #060607 0%, #0b0b10 52%, #060607 100%);
	}

	.studio-shell {
		min-height: 100vh;
	}

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
		font-size: clamp(2.2rem, 4vw, 3.45rem);
		line-height: 0.98;
	}

	h2 {
		font-size: clamp(1.18rem, 1.9vw, 1.7rem);
		line-height: 1.12;
	}

	p {
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.96rem;
	}

	.studio-head,
	.reel-grid,
	.studio-grid,
	.lower-grid {
		display: grid;
		gap: 1rem;
	}

	.studio-head {
		grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
		align-items: end;
	}

	.studio-copy {
		display: grid;
		gap: 0.75rem;
		max-width: 33rem;
		justify-self: center;
		text-align: center;
	}

	.reel-grid {
		grid-template-columns: minmax(250px, 0.76fr) minmax(0, 1.16fr);
		align-items: center;
	}

	.order-bar,
	.reel-card,
	.reel-video-card,
	.preview-card,
	.action-card,
	.compare-card,
	.mockup-card {
		padding: 1.05rem;
		border-radius: 1.28rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
			linear-gradient(160deg, rgba(14, 14, 18, 0.9), rgba(10, 10, 14, 0.82));
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 24px 60px rgba(0, 0, 0, 0.28);
	}

	.order-bar,
	.order-actions,
	.card-top,
	.reel-tags,
	.mode-switcher,
	.action-row,
	.control-row,
	.mockup-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
	}

	.order-bar {
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		text-align: center;
	}

	.order-checkout,
	.lightbox-checkout {
		display: grid;
		gap: 0.8rem;
		width: 100%;
	}

	.order-checkout label {
		display: grid;
		gap: 0.45rem;
		color: var(--text);
		width: 100%;
	}

	.order-checkout span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.order-checkout select {
		padding: 0.8rem 0.95rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text);
	}

	.upload-note {
		font-size: 0.82rem;
		color: rgba(122, 240, 255, 0.82);
	}

	.upload-error {
		color: #ff9bb1;
	}

	.reel-card,
	.reel-video-card {
		display: grid;
		gap: 0.82rem;
	}

	.order-kicker,
	.card-kicker {
		font-size: 0.68rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}

	.studio-grid {
		grid-template-columns: minmax(0, 1.08fr) minmax(290px, 0.82fr);
		align-items: start;
	}

	.reel-tags span {
		padding: 0.48rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.1),
				rgba(199, 216, 255, 0.1),
				rgba(242, 182, 223, 0.08)
			),
			rgba(255, 255, 255, 0.03);
		color: var(--text);
		font-size: 0.8rem;
	}

	.reel-shell {
		position: relative;
		padding: 0.7rem;
		border-radius: 1.2rem;
		background: linear-gradient(145deg, rgba(18, 18, 24, 0.98), rgba(10, 10, 14, 0.94));
		overflow: hidden;
	}

	.reel-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		padding: 1px;
		border-radius: 1.2rem;
		background: linear-gradient(
			120deg,
			rgba(240, 222, 192, 0.75),
			rgba(199, 216, 255, 0.85),
			rgba(242, 182, 223, 0.75),
			rgba(240, 222, 192, 0.75)
		);
		background-size: 200% 100%;
		animation: borderFlow 6s linear infinite;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
		pointer-events: none;
	}

	.reel-video {
		position: relative;
		display: block;
		width: 100%;
		max-height: 31rem;
		border-radius: 0.9rem;
		background: #08090d;
		object-fit: cover;
		box-shadow: 0 26px 56px rgba(0, 0, 0, 0.34);
		z-index: 1;
	}

	.reel-glow {
		position: absolute;
		inset: auto 8% 4% 8%;
		height: 18%;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(240, 222, 192, 0.18),
			rgba(199, 216, 255, 0.28),
			rgba(242, 182, 223, 0.18)
		);
		filter: blur(28px);
		opacity: 0.8;
	}

	.preview-card,
	.side-stack,
	.action-card,
	.compare-card,
	.mockup-card {
		display: grid;
		gap: 0.85rem;
	}

	.mode-switcher button,
	.mockup-tabs button,
	.action-button,
	.mini-button,
	.upload-meta button,
	.lightbox-nav,
	.lightbox-close,
	.sample-card {
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease,
			background 180ms ease;
	}

	.mode-switcher button,
	.mockup-tabs button,
	.action-button,
	.mini-button,
	.upload-meta button,
	.lightbox-nav,
	.lightbox-close {
		padding: 0.6rem 0.88rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.11);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.12),
				rgba(199, 216, 255, 0.1),
				rgba(242, 182, 223, 0.08)
			),
			rgba(255, 255, 255, 0.03);
		color: var(--text);
		font-weight: 700;
	}

	.mode-switcher button.active,
	.mode-switcher button:hover,
	.mockup-tabs button.active,
	.mockup-tabs button:hover,
	.action-button:hover,
	.mini-button:hover,
	.upload-meta button:hover,
	.lightbox-nav:hover,
	.lightbox-close:hover,
	.sample-card:hover {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
	}

	.action-button.ghost {
		background: rgba(255, 255, 255, 0.03);
		color: var(--muted);
	}

	.hidden-input {
		display: none;
	}

	.mode-copy,
	.helper {
		color: var(--muted);
	}

	.preview-stage {
		position: relative;
		padding: 0.52rem;
		border-radius: 1.22rem;
		background:
			radial-gradient(circle at top, rgba(199, 216, 255, 0.18), transparent 24%),
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
		border-radius: 0.95rem;
		box-shadow: 0 24px 50px rgba(0, 0, 0, 0.34);
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
			rgba(255, 255, 255, 0.08),
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
			transform: translateX(400%) skewX(-18deg);
			opacity: 1;
		}

		100% {
			transform: translateX(470%) skewX(-18deg);
			opacity: 0;
		}
	}

	.sample-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.68rem;
	}

	.sample-card {
		display: grid;
		gap: 0.48rem;
		padding: 0.55rem;
		text-align: left;
		border-radius: 0.88rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
	}

	.sample-card img {
		display: block;
		width: 100%;
		height: 6.35rem;
		object-fit: cover;
		border-radius: 0.74rem;
	}

	.sample-card.active {
		border-color: rgba(255, 255, 255, 0.18);
	}

	.side-stack {
		display: grid;
		gap: 0.85rem;
	}

	.upload-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.upload-meta p {
		min-width: 0;
		font-size: 0.72rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lower-grid {
		grid-template-columns: minmax(0, 1.02fr) minmax(280px, 0.92fr);
		align-items: start;
	}

	.compare-stage {
		position: relative;
		min-height: 15.5rem;
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
		background: linear-gradient(180deg, transparent, #f0dec0, transparent);
	}

	.slider {
		width: 100%;
	}

	.mockup-stage {
		display: grid;
		place-items: center;
		min-height: 18rem;
		border-radius: 1rem;
	}

	.mockup-target {
		position: relative;
		width: min(13.5rem, 70vw);
		aspect-ratio: 0.82;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.32);
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

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgba(4, 4, 6, 0.84);
		backdrop-filter: blur(10px);
	}

	.lightbox-dialog {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 240px;
		gap: 0.9rem;
		width: min(92vw, 1120px);
		height: min(80vh, 820px);
		padding: 0.9rem;
		border-radius: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
			rgba(12, 12, 16, 0.96);
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
		border-radius: 0.88rem;
	}

	.lightbox-sidebar {
		display: grid;
		align-content: start;
		gap: 0.72rem;
		padding: 0.9rem;
		border-radius: 0.96rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
			linear-gradient(
				160deg,
				rgba(240, 222, 192, 0.12),
				rgba(199, 216, 255, 0.12),
				rgba(242, 182, 223, 0.08)
			);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.lightbox-nav,
	.lightbox-close {
		position: absolute;
	}

	.lightbox-nav {
		top: 50%;
		transform: translateY(-50%);
		width: 2.7rem;
		height: 2.7rem;
	}

	.lightbox-nav-left {
		left: 1rem;
	}

	.lightbox-nav-right {
		right: 16.5rem;
	}

	.lightbox-close {
		top: 0.9rem;
		right: 0.9rem;
	}

	@media (max-width: 960px) {
		.studio-head,
		.reel-grid,
		.studio-grid,
		.lower-grid,
		.sample-row {
			grid-template-columns: 1fr;
		}

		.studio-copy,
		.order-bar {
			justify-items: center;
			text-align: center;
		}

		.lightbox-dialog {
			grid-template-columns: 1fr;
			height: auto;
			max-height: 88vh;
		}

		.lightbox-nav-right {
			right: 1rem;
		}
	}

	@media (max-width: 640px) {
		h1 {
			font-size: clamp(1.9rem, 9vw, 2.65rem);
		}

		h2 {
			font-size: clamp(1.08rem, 5.2vw, 1.45rem);
		}

		p {
			font-size: 0.92rem;
		}

		.order-bar,
		.reel-card,
		.reel-video-card,
		.preview-card,
		.action-card,
		.compare-card,
		.mockup-card {
			padding: 0.9rem;
			border-radius: 1.05rem;
		}

		.order-actions,
		.mode-switcher,
		.action-row,
		.control-row,
		.mockup-tabs {
			gap: 0.5rem;
		}

		.order-checkout select,
		.mode-switcher button,
		.mockup-tabs button,
		.action-button,
		.mini-button,
		.upload-meta button,
		.lightbox-nav,
		.lightbox-close {
			min-height: 2.8rem;
		}

		.reel-video {
			max-height: 22rem;
		}

		.base-image {
			width: min(13rem, 100%);
		}

		.sample-row {
			gap: 0.55rem;
		}

		.sample-card {
			padding: 0.45rem;
		}

		.sample-card img {
			height: 5.25rem;
		}

		.upload-meta {
			flex-direction: column;
			align-items: stretch;
		}

		.upload-meta p {
			text-align: center;
			white-space: normal;
		}

		.compare-stage {
			min-height: 12.5rem;
		}

		.mockup-stage {
			min-height: 14rem;
		}

		.mockup-target {
			width: min(11rem, 70vw);
		}

		.lightbox {
			padding: 0.65rem;
		}

		.lightbox-dialog {
			width: 100%;
			max-height: 92vh;
			padding: 0.7rem;
			gap: 0.7rem;
			border-radius: 1rem;
		}

		.lightbox-sidebar {
			padding: 0.78rem;
			gap: 0.62rem;
		}

		.lightbox-nav {
			top: auto;
			bottom: 0.75rem;
			transform: none;
			width: 2.4rem;
			height: 2.4rem;
		}

		.lightbox-nav-left {
			left: 0.75rem;
		}

		.lightbox-nav-right {
			right: 0.75rem;
		}

		.lightbox-close {
			top: 0.7rem;
			right: 0.7rem;
		}
	}

	@keyframes borderFlow {
		from {
			background-position: 0% 50%;
		}

		to {
			background-position: 200% 50%;
		}
	}
</style>
