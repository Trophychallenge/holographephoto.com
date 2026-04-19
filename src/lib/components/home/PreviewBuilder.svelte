<script lang="ts">
	import { removeLightBackgroundFromFile } from '$lib/browser/overlay-tools';
	import { featuredCheckoutOffers } from '$lib/pricing';

	type ViewMode = 'original' | 'holographic' | 'overlay';

	const viewModes: { id: ViewMode; label: string }[] = [
		{ id: 'original', label: 'Original' },
		{ id: 'holographic', label: 'Holographic Preview' },
		{ id: 'overlay', label: 'Preview with Overlay' }
	];

	let selectedView = $state<ViewMode>('holographic');
	let uploadedBaseSrc = $state('');
	let uploadedBaseName = $state('');
	let uploadedOverlaySrc = $state('');
	let uploadedOverlayName = $state('');
	let uploadedBaseBlobUrl = $state('');
	let uploadedOverlayBlobUrl = $state('');
	let baseUploadState = $state<'idle' | 'uploading' | 'saved' | 'local' | 'error'>('idle');
	let overlayUploadState = $state<'idle' | 'uploading' | 'saved' | 'local' | 'error'>('idle');
	let baseUploadMessage = $state('');
	let overlayUploadMessage = $state('');
	let overlayProcessing = $state(false);
	let overlayEnabled = $state(true);
	let overlayX = $state(50);
	let overlayY = $state(52);
	let overlayScale = $state(64);
	let draggingOverlay = $state(false);
	let selectedBundle = $state(String(featuredCheckoutOffers[0].quantity));

	let baseUploadInput: HTMLInputElement | null = null;
	let baseCameraInput: HTMLInputElement | null = null;
	let overlayUploadInput: HTMLInputElement | null = null;
	let overlayCameraInput: HTMLInputElement | null = null;
	let previewSurface: HTMLDivElement | null = null;

	const currentBaseSrc = $derived(uploadedBaseSrc || '/holographe/leo.png');
	const currentBaseAlt = $derived(
		uploadedBaseName || 'Preview of a Holographe keepsake using the selected photo'
	);
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const showHolographic = $derived(selectedView !== 'original');
	const showOverlay = $derived(
		selectedView === 'overlay' && overlayEnabled && Boolean(currentOverlaySrc)
	);
	const hasUnsavedDesign = $derived(
		(Boolean(uploadedBaseName) && !uploadedBaseBlobUrl) ||
			(Boolean(uploadedOverlayName) && !uploadedOverlayBlobUrl)
	);

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

	async function applyUploadedFile(file: File, type: 'base' | 'overlay') {
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
			selectedView = 'overlay';
			overlayEnabled = true;
			overlayX = 50;
			overlayY = 52;
			overlayScale = 64;
		}

		try {
			const blobUrl = await persistDesignAsset(file, type);
			if (type === 'base') {
				uploadedBaseBlobUrl = blobUrl;
				baseUploadState = 'saved';
				baseUploadMessage = 'Photo saved with your design.';
			} else {
				uploadedOverlayBlobUrl = blobUrl;
				overlayUploadState = 'saved';
				overlayUploadMessage = 'Overlay saved with your design.';
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Cloud save is unavailable right now.';
			if (type === 'base') {
				baseUploadState = 'local';
				baseUploadMessage = `Preview ready on this device. ${message} Order stays disabled until cloud save works.`;
			} else {
				overlayUploadState = 'local';
				overlayUploadMessage = `Overlay preview ready on this device. ${message} Order stays disabled until cloud save works.`;
			}
		}
	}

	async function updateUploadedImage(event: Event, type: 'base' | 'overlay') {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		input.value = '';
		await applyUploadedFile(file, type);
	}

	async function cleanOverlayBackground() {
		if (!uploadedOverlaySrc) return;

		overlayProcessing = true;
		overlayUploadState = 'uploading';
		overlayUploadMessage = 'Cleaning the background for a smoother overlay...';

		try {
			const response = await fetch(uploadedOverlaySrc);
			const blob = await response.blob();
			const sourceFile = new File([blob], uploadedOverlayName || 'overlay.png', {
				type: blob.type || 'image/png'
			});
			const cleanedFile = await removeLightBackgroundFromFile(sourceFile);
			await applyUploadedFile(cleanedFile, 'overlay');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Cleanup failed.';
			overlayUploadState = 'error';
			overlayUploadMessage = message;
		} finally {
			overlayProcessing = false;
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
			overlayEnabled = false;
			uploadedOverlayBlobUrl = '';
			overlayUploadState = 'idle';
			overlayUploadMessage = '';
			if (selectedView === 'overlay') selectedView = 'holographic';
		}
	}

	function updateOverlayPosition(event: PointerEvent) {
		if (!previewSurface) return;
		const bounds = previewSurface.getBoundingClientRect();
		overlayX = Math.max(12, Math.min(88, ((event.clientX - bounds.left) / bounds.width) * 100));
		overlayY = Math.max(12, Math.min(88, ((event.clientY - bounds.top) / bounds.height) * 100));
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
</script>

<section class="section preview-section" id="preview-builder">
	<div class="page-wrap preview-layout">
		<div class="section-copy">
			<p class="eyebrow">Live preview</p>
			<h2>Upload a photo and see the finish instantly.</h2>
			<p>
				Keep it simple: add your photo, optionally layer handwriting or artwork, and move it into
				place.
			</p>
		</div>

		<div class="builder-card">
			<div class="builder-grid">
				<div class="controls-panel">
					<div class="control-block">
						<p class="label">Main photo</p>
						<div class="button-row">
							<button type="button" class="soft-button" onclick={() => baseUploadInput?.click()}>
								Upload Photo
							</button>
							<button type="button" class="soft-button" onclick={() => baseCameraInput?.click()}>
								Take Photo
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
							<div class="file-meta">
								<span>{uploadedBaseName}</span>
								<button type="button" onclick={() => clearUploadedImage('base')}>Remove</button>
							</div>
							{#if baseUploadMessage}
								<p class:upload-error={baseUploadState === 'error'} class="upload-note">
									{baseUploadMessage}
								</p>
							{/if}
						{:else}
							<p class="helper">Start with the photo you want to keep.</p>
						{/if}
					</div>

					<div class="control-block">
						<p class="label">Optional overlay</p>
						<div class="button-row">
							<button type="button" class="soft-button" onclick={() => overlayUploadInput?.click()}>
								Upload Overlay
							</button>
							<button type="button" class="soft-button" onclick={() => overlayCameraInput?.click()}>
								Take Photo
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
							<div class="file-meta">
								<span>{uploadedOverlayName}</span>
								<div class="file-actions">
									<button type="button" onclick={cleanOverlayBackground} disabled={overlayProcessing}>
										{overlayProcessing ? 'Cleaning...' : 'Clean background'}
									</button>
									<button type="button" onclick={() => clearUploadedImage('overlay')}>Remove</button>
								</div>
							</div>
							{#if overlayUploadMessage}
								<p class:upload-error={overlayUploadState === 'error'} class="upload-note">
									{overlayUploadMessage}
								</p>
							{/if}
						{:else}
							<p class="helper">Perfect for handwriting, footprints, paw prints, or child art.</p>
						{/if}
					</div>

					<div class="control-block compact">
						<label class="toggle">
							<input type="checkbox" bind:checked={overlayEnabled} disabled={!currentOverlaySrc} />
							<span>Show overlay</span>
						</label>

						<label class="slider-wrap">
							<span>Overlay size</span>
							<input type="range" min="24" max="95" bind:value={overlayScale} />
						</label>
					</div>
				</div>

				<div class="preview-panel">
					<div class="view-switcher" aria-label="Preview mode">
						{#each viewModes as mode (mode.id)}
							<button
								type="button"
								class:active={selectedView === mode.id}
								onclick={() => (selectedView = mode.id)}
							>
								{mode.label}
							</button>
						{/each}
					</div>

					<div
						bind:this={previewSurface}
						class="preview-surface"
						style={`--overlay-x:${overlayX}%; --overlay-y:${overlayY}%; --overlay-scale:${overlayScale / 100};`}
					>
						<img class="base-image" src={currentBaseSrc} alt={currentBaseAlt} />
						{#if showHolographic}
							<div class="holographic-wash"></div>
							<div class="light-pass"></div>
						{/if}
						{#if showOverlay}
							<img
								class="overlay-image"
								src={currentOverlaySrc}
								alt="Overlay preview layered on the keepsake"
								onpointerdown={startOverlayDrag}
								onpointermove={continueOverlayDrag}
								onpointerup={endOverlayDrag}
								onpointercancel={endOverlayDrag}
							/>
						{/if}
					</div>

					<div class="preview-footer">
						<p>
							Preview modes help you get close before ordering. Final shimmer can vary slightly in
							real light.
						</p>
						<form class="checkout-inline" method="POST" action="/checkout">
							<input type="hidden" name="source" value="home-preview-builder" />
							<input type="hidden" name="base_name" value={uploadedBaseName} />
							<input type="hidden" name="overlay_name" value={uploadedOverlayName} />
							<input type="hidden" name="base_blob_url" value={uploadedBaseBlobUrl} />
							<input type="hidden" name="overlay_blob_url" value={uploadedOverlayBlobUrl} />
							<input type="hidden" name="view_mode" value={selectedView} />
							<label class="checkout-pick">
								<span>Bundle</span>
								<select name="quantity" bind:value={selectedBundle}>
									{#each featuredCheckoutOffers as offer (offer.quantity)}
										<option value={offer.quantity}>{offer.quantity} for {offer.priceLabel}</option>
									{/each}
								</select>
							</label>
							<button
								class="button-primary order-button"
								type="submit"
								disabled={
									baseUploadState === 'uploading' ||
									overlayUploadState === 'uploading' ||
									overlayProcessing ||
									hasUnsavedDesign
								}
							>
								{baseUploadState === 'uploading' || overlayUploadState === 'uploading' || overlayProcessing
									? 'Saving design...'
									: 'Buy this design'}
							</button>
						</form>
						{#if hasUnsavedDesign}
							<p class="checkout-note">
								Finish cloud save before ordering so your uploaded design is attached to the payment.
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.preview-layout {
		display: grid;
		gap: 1.4rem;
	}

	.section-copy {
		display: grid;
		gap: 0.9rem;
		max-width: 40rem;
		margin: 0 auto;
		text-align: center;
		justify-items: center;
	}

	h2,
	p {
		margin: 0;
	}

	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2rem, 6vw, 3.2rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	.section-copy p:last-child {
		color: rgba(238, 238, 234, 0.72);
		line-height: 1.75;
	}

	.builder-card {
		padding: 1rem;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(17, 17, 19, 0.96), rgba(8, 8, 10, 0.96));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 26px 62px rgba(0, 0, 0, 0.3);
	}

	.builder-grid {
		display: grid;
		gap: 1rem;
	}

	.controls-panel,
	.preview-panel {
		display: grid;
		gap: 0.9rem;
	}

	.control-block {
		display: grid;
		gap: 0.7rem;
		padding: 1rem;
		border-radius: 1.35rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.control-block.compact {
		align-content: start;
	}

	.label,
	.slider-wrap span {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(236, 236, 232, 0.56);
	}

	.button-row,
	.view-switcher {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.soft-button,
	.view-switcher button,
	.file-meta button {
		padding: 0.8rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.08),
				rgba(226, 231, 255, 0.08),
				rgba(255, 255, 255, 0.04)
			),
			rgba(255, 255, 255, 0.03);
		color: #f5f5f2;
		font-weight: 600;
	}

	.view-switcher button.active {
		background:
			linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.16),
				rgba(219, 226, 255, 0.18),
				rgba(255, 255, 255, 0.08)
			),
			rgba(255, 255, 255, 0.03);
	}

	.hidden-input {
		display: none;
	}

	.file-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		color: rgba(236, 236, 232, 0.68);
		font-size: 0.88rem;
	}

	.file-meta span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.upload-note {
		font-size: 0.88rem;
		color: rgba(122, 240, 255, 0.82);
	}

	.upload-error {
		color: #ff9bb1;
	}

	.helper,
	.preview-footer p,
	.checkout-note {
		color: rgba(226, 226, 222, 0.62);
		line-height: 1.6;
		font-size: 0.94rem;
	}

	.checkout-note {
		color: #ffd9a0;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		color: rgba(244, 244, 240, 0.82);
		font-weight: 600;
	}

	.slider-wrap {
		display: grid;
		gap: 0.6rem;
	}

	input[type='range'] {
		width: 100%;
	}

	.preview-surface {
		position: relative;
		min-height: 22rem;
		padding: 0.8rem;
		border-radius: 1.6rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.14), transparent 32%),
			linear-gradient(180deg, rgba(248, 248, 245, 0.12), rgba(248, 248, 245, 0.03)),
			linear-gradient(160deg, rgba(235, 235, 232, 0.22), rgba(188, 188, 184, 0.1));
	}

	.base-image {
		display: block;
		width: min(18rem, 100%);
		margin: 0 auto;
		border-radius: 1.15rem;
		box-shadow: 0 22px 44px rgba(0, 0, 0, 0.22);
	}

	.holographic-wash,
	.light-pass {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.holographic-wash {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.06),
			rgba(207, 218, 255, 0.22),
			rgba(255, 255, 255, 0.08)
		);
		mix-blend-mode: screen;
	}

	.light-pass {
		inset: -12% auto -12% -24%;
		width: 28%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0.46),
			rgba(219, 225, 255, 0.42),
			transparent
		);
		transform: skewX(-18deg);
		animation: lightPass 5.2s ease-in-out infinite;
	}

	.overlay-image {
		position: absolute;
		left: var(--overlay-x);
		top: var(--overlay-y);
		max-width: 64%;
		max-height: 64%;
		object-fit: contain;
		transform: translate(-50%, -50%) scale(var(--overlay-scale));
		transform-origin: center;
		cursor: grab;
		filter: drop-shadow(0 16px 28px rgba(0, 0, 0, 0.28));
	}

	.preview-footer {
		display: grid;
		gap: 0.9rem;
		text-align: center;
	}

	.checkout-inline {
		display: grid;
		gap: 0.7rem;
	}

	.checkout-pick {
		display: grid;
		gap: 0.45rem;
		color: rgba(244, 244, 240, 0.82);
		text-align: left;
	}

	.checkout-pick span {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.checkout-pick select {
		padding: 0.85rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text);
	}

	.order-button {
		width: 100%;
	}

	.order-button:disabled {
		opacity: 0.7;
		cursor: progress;
	}

	@keyframes lightPass {
		0%,
		18% {
			transform: translateX(0) skewX(-18deg);
			opacity: 0;
		}

		32%,
		68% {
			transform: translateX(380%) skewX(-18deg);
			opacity: 1;
		}

		100% {
			transform: translateX(460%) skewX(-18deg);
			opacity: 0;
		}
	}

	@media (min-width: 980px) {
		.builder-grid {
			grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
			align-items: start;
		}

		.preview-footer {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: center;
		}

		.checkout-inline {
			grid-template-columns: auto auto;
			align-items: end;
		}

		.order-button {
			width: auto;
		}
	}
</style>
