<script lang="ts">
	import { removeLightBackgroundFromFile } from '$lib/browser/overlay-tools';
	import { featuredCheckoutOffers } from '$lib/pricing';

	type TextStyle = 'serif' | 'handwritten' | 'clean';

	const textStyles: { id: TextStyle; label: string }[] = [
		{ id: 'serif', label: 'Elegant' },
		{ id: 'handwritten', label: 'Handwritten' },
		{ id: 'clean', label: 'Minimal' }
	];

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
	let overlayScale = $state(58);
	let overlayY = $state(52);
	let brightness = $state(100);
	let shimmer = $state(68);
	let compareSplit = $state(54);
	let textOverlay = $state('');
	let textStyle = $state<TextStyle>('handwritten');
	let textSize = $state(26);
	let textY = $state(82);
	let giftMode = $state(false);
	let giftMessage = $state('');
	let shipDirect = $state(true);
	let selectedBundle = $state(String(featuredCheckoutOffers[1]?.quantity ?? featuredCheckoutOffers[0].quantity));

	let baseUploadInput: HTMLInputElement | null = null;
	let baseCameraInput: HTMLInputElement | null = null;
	let overlayUploadInput: HTMLInputElement | null = null;
	let overlayCameraInput: HTMLInputElement | null = null;

	const currentBaseSrc = $derived(uploadedBaseSrc || '/holographe/leo.png');
	const currentBaseAlt = $derived(uploadedBaseName || 'Preview of your Holographe magnet');
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const hasUnsavedDesign = $derived(
		(Boolean(uploadedBaseName) && !uploadedBaseBlobUrl) ||
			(Boolean(uploadedOverlayName) && !uploadedOverlayBlobUrl)
	);
	const canOrder = $derived(
		!hasUnsavedDesign && baseUploadState !== 'uploading' && overlayUploadState !== 'uploading' && !overlayProcessing
	);

	function getTextFont(style: TextStyle) {
		if (style === 'handwritten') return '"Snell Roundhand", "Brush Script MT", cursive';
		if (style === 'clean') return '"Space Grotesk", "Avenir Next", sans-serif';
		return '"Iowan Old Style", Georgia, serif';
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

	async function applyUploadedFile(file: File, type: 'base' | 'overlay') {
		const objectUrl = URL.createObjectURL(file);

		if (type === 'base') {
			if (uploadedBaseSrc) URL.revokeObjectURL(uploadedBaseSrc);
			uploadedBaseSrc = objectUrl;
			uploadedBaseName = file.name;
			uploadedBaseBlobUrl = '';
			baseUploadState = 'uploading';
			baseUploadMessage = 'Saving your photo...';
		} else {
			if (uploadedOverlaySrc) URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = objectUrl;
			uploadedOverlayName = file.name;
			uploadedOverlayBlobUrl = '';
			overlayUploadState = 'uploading';
			overlayUploadMessage = 'Saving your overlay...';
			overlayEnabled = true;
		}

		try {
			const blobUrl = await persistDesignAsset(file, type);

			if (type === 'base') {
				uploadedBaseBlobUrl = blobUrl;
				baseUploadState = 'saved';
				baseUploadMessage = 'Photo saved.';
			} else {
				uploadedOverlayBlobUrl = blobUrl;
				overlayUploadState = 'saved';
				overlayUploadMessage = 'Overlay saved.';
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Cloud save is unavailable right now.';

			if (type === 'base') {
				baseUploadState = 'local';
				baseUploadMessage = `Preview ready here. ${message}`;
			} else {
				overlayUploadState = 'local';
				overlayUploadMessage = `Overlay ready here. ${message}`;
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
		overlayUploadMessage = 'Cleaning background...';

		try {
			const response = await fetch(uploadedOverlaySrc);
			const blob = await response.blob();
			const sourceFile = new File([blob], uploadedOverlayName || 'overlay.png', {
				type: blob.type || 'image/png'
			});
			const cleanedFile = await removeLightBackgroundFromFile(sourceFile);
			await applyUploadedFile(cleanedFile, 'overlay');
		} catch (error) {
			overlayUploadState = 'error';
			overlayUploadMessage = error instanceof Error ? error.message : 'Cleanup failed.';
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
			uploadedOverlayBlobUrl = '';
			overlayUploadState = 'idle';
			overlayUploadMessage = '';
		}
	}
</script>

<section class="section preview-section" id="preview-builder">
	<div class="page-wrap preview-layout">
		<div class="section-copy">
			<p class="eyebrow">Create yours</p>
			<h2>Upload a photo. See the shimmer. Order fast.</h2>
			<p>Simple controls. Real-time preview.</p>
		</div>

		<div class="builder-card">
			<div class="builder-grid">
				<div class="preview-panel">
					<div class="preview-stage">
						<div class="preview-card original-layer" style={`filter: brightness(${brightness}%);`}>
							<img class="base-image" src={currentBaseSrc} alt={currentBaseAlt} />
						</div>

						<div
							class="preview-card holographic-layer"
							style={`clip-path: inset(0 ${100 - compareSplit}% 0 0); filter: brightness(${brightness}%); --shimmer-strength:${shimmer / 100};`}
						>
							<img class="base-image" src={currentBaseSrc} alt={currentBaseAlt} />
							<div class="holographic-wash"></div>
							<div class="light-pass"></div>

							{#if overlayEnabled && currentOverlaySrc}
								<img
									class="overlay-image"
									src={currentOverlaySrc}
									alt="Overlay preview"
									style={`transform: translate(-50%, -50%) scale(${overlayScale / 100}); top:${overlayY}%;`}
								/>
							{/if}

							{#if textOverlay.trim()}
								<div
									class="text-overlay"
									style={`font-family:${getTextFont(textStyle)}; font-size:${textSize}px; top:${textY}%;`}
								>
									{textOverlay}
								</div>
							{/if}
						</div>

						<div class="compare-line" style={`left:${compareSplit}%`}></div>
					</div>

					<label class="compare-control">
						<span>Before / After</span>
						<input type="range" min="6" max="94" bind:value={compareSplit} />
					</label>

					<div class="checkout-card">
						<form id="homepage-order-form" class="checkout-form" method="POST" action="/checkout">
							<input type="hidden" name="source" value="home-live-preview" />
							<input type="hidden" name="base_name" value={uploadedBaseName} />
							<input type="hidden" name="overlay_name" value={uploadedOverlayName} />
							<input type="hidden" name="base_blob_url" value={uploadedBaseBlobUrl} />
							<input type="hidden" name="overlay_blob_url" value={uploadedOverlayBlobUrl} />
							<input type="hidden" name="view_mode" value="compare" />
							<input type="hidden" name="gift_mode" value={giftMode ? 'gift' : 'standard'} />
							<input type="hidden" name="overlay_text" value={textOverlay} />
							<input type="hidden" name="overlay_text_style" value={textStyle} />
							<input type="hidden" name="gift_message" value={giftMessage} />
							<input type="hidden" name="ship_direct" value={shipDirect ? 'yes' : 'no'} />
							<input type="hidden" name="brightness_level" value={String(brightness)} />
							<input type="hidden" name="shimmer_intensity" value={String(shimmer)} />

							<div class="bundle-row">
								<label class="checkout-pick">
									<span>Bundle</span>
									<select name="quantity" bind:value={selectedBundle}>
										{#each featuredCheckoutOffers as offer (offer.quantity)}
											<option value={offer.quantity}>{offer.quantity} for {offer.priceLabel}</option>
										{/each}
									</select>
								</label>
								<button class="button-primary order-button" type="submit" disabled={!canOrder}>
									{canOrder ? 'Order Now' : 'Finish Saving'}
								</button>
							</div>
						</form>

						{#if hasUnsavedDesign}
							<p class="checkout-note">Your preview is ready. Cloud save must finish before checkout.</p>
						{/if}
					</div>
				</div>

				<div class="controls-panel">
					<div class="control-block">
						<p class="label">Step 1</p>
						<h3>Upload photo</h3>
						<div class="button-row">
							<button type="button" class="soft-button" onclick={() => baseUploadInput?.click()}>
								Upload
							</button>
							<button type="button" class="soft-button" onclick={() => baseCameraInput?.click()}>
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
							<div class="file-meta">
								<span>{uploadedBaseName}</span>
								<button type="button" onclick={() => clearUploadedImage('base')}>Remove</button>
							</div>
						{/if}
						{#if baseUploadMessage}
							<p class:upload-error={baseUploadState === 'error'} class="upload-note">{baseUploadMessage}</p>
						{/if}
					</div>

					<div class="control-block">
						<p class="label">Step 2</p>
						<h3>Add text or handwriting</h3>
						<input
							class="text-input"
							type="text"
							bind:value={textOverlay}
							placeholder="Add a name, note, or date"
						/>
						<div class="style-row">
							{#each textStyles as style (style.id)}
								<button
									type="button"
									class:active={textStyle === style.id}
									class="mini-chip"
									onclick={() => (textStyle = style.id)}
								>
									{style.label}
								</button>
							{/each}
						</div>
						<label class="slider-wrap">
							<span>Text size</span>
							<input type="range" min="18" max="40" bind:value={textSize} />
						</label>
					</div>

					<div class="control-block">
						<p class="label">Step 3</p>
						<h3>Add overlay</h3>
						<div class="button-row">
							<button type="button" class="soft-button" onclick={() => overlayUploadInput?.click()}>
								Upload
							</button>
							<button type="button" class="soft-button" onclick={() => overlayCameraInput?.click()}>
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
						<div class="button-row">
							<button type="button" class="soft-button" onclick={cleanOverlayBackground} disabled={!currentOverlaySrc || overlayProcessing}>
								{overlayProcessing ? 'Cleaning...' : 'Clean background'}
							</button>
							<button type="button" class="soft-button ghost" onclick={() => (overlayEnabled = !overlayEnabled)} disabled={!currentOverlaySrc}>
								{overlayEnabled ? 'Hide overlay' : 'Show overlay'}
							</button>
						</div>
						{#if uploadedOverlayName}
							<div class="file-meta">
								<span>{uploadedOverlayName}</span>
								<button type="button" onclick={() => clearUploadedImage('overlay')}>Remove</button>
							</div>
						{/if}
						{#if overlayUploadMessage}
							<p class:upload-error={overlayUploadState === 'error'} class="upload-note">{overlayUploadMessage}</p>
						{/if}
					</div>

					<div class="control-block compact">
						<p class="label">Step 4</p>
						<h3>Refine preview</h3>
						<label class="slider-wrap">
							<span>Brightness</span>
							<input type="range" min="80" max="120" bind:value={brightness} />
						</label>
						<label class="slider-wrap">
							<span>Shimmer</span>
							<input type="range" min="20" max="100" bind:value={shimmer} />
						</label>
						<label class="slider-wrap">
							<span>Overlay size</span>
							<input type="range" min="30" max="90" bind:value={overlayScale} />
						</label>
					</div>

					<div class="control-block compact gift-block">
						<label class="toggle">
							<input type="checkbox" bind:checked={giftMode} />
							<span>Send as a gift</span>
						</label>
						{#if giftMode}
							<label class="toggle">
								<input type="checkbox" bind:checked={shipDirect} />
								<span>Ship directly</span>
							</label>
							<textarea
								class="gift-message"
								rows="3"
								bind:value={giftMessage}
								placeholder="Gift message"
							></textarea>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mobile-order-bar">
		<div>
			<p>Better together</p>
			<strong>{selectedBundle === '1' ? '$14.99' : selectedBundle === '3' ? '$34.99' : '$59.99'}</strong>
		</div>
		<button class="button-primary" type="submit" form="homepage-order-form" disabled={!canOrder}>
			{canOrder ? 'Order Now' : 'Saving...'}
		</button>
	</div>
</section>

<style>
	.preview-layout {
		display: grid;
		gap: 1.1rem;
	}

	.section-copy {
		display: grid;
		gap: 0.65rem;
		max-width: 28rem;
		text-align: center;
		justify-items: center;
		margin: 0 auto;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	h2,
	h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3.2rem);
		line-height: 0.98;
	}

	h3 {
		font-size: 1.05rem;
	}

	.section-copy p:last-child {
		color: rgba(238, 238, 234, 0.7);
		font-size: 0.95rem;
	}

	.builder-card {
		padding: 0.9rem;
		border-radius: 1.8rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(14, 14, 18, 0.96), rgba(8, 8, 10, 0.96));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 28px 70px rgba(0, 0, 0, 0.28);
	}

	.builder-grid,
	.controls-panel,
	.preview-panel,
	.checkout-card {
		display: grid;
		gap: 0.8rem;
	}

	.control-block {
		display: grid;
		gap: 0.65rem;
		padding: 0.9rem;
		border-radius: 1.2rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.label,
	.slider-wrap span,
	.checkout-pick span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(236, 236, 232, 0.56);
	}

	.button-row,
	.style-row,
	.bundle-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.soft-button,
	.mini-chip,
	.file-meta button {
		padding: 0.72rem 0.9rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(220, 226, 255, 0.08), rgba(255, 255, 255, 0.03)),
			rgba(255, 255, 255, 0.03);
		color: #f6f6f2;
		font-weight: 600;
	}

	.soft-button.ghost {
		background: rgba(255, 255, 255, 0.02);
	}

	.mini-chip.active {
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(222, 229, 255, 0.16), rgba(255, 255, 255, 0.08)),
			rgba(255, 255, 255, 0.03);
	}

	.hidden-input {
		display: none;
	}

	.text-input,
	.gift-message,
	.checkout-pick select {
		width: 100%;
		padding: 0.85rem 0.95rem;
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text);
	}

	.slider-wrap {
		display: grid;
		gap: 0.45rem;
	}

	input[type='range'] {
		width: 100%;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: rgba(244, 244, 240, 0.84);
		font-weight: 600;
	}

	.preview-stage {
		position: relative;
		min-height: 24rem;
		border-radius: 1.6rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 30%),
			linear-gradient(180deg, rgba(245, 245, 242, 0.12), rgba(245, 245, 242, 0.03)),
			linear-gradient(160deg, rgba(240, 240, 236, 0.18), rgba(180, 180, 176, 0.08));
	}

	.preview-card {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 1rem;
	}

	.base-image {
		display: block;
		width: min(18rem, 100%);
		border-radius: 1.1rem;
		box-shadow: 0 20px 42px rgba(0, 0, 0, 0.22);
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
			rgba(255, 255, 255, 0.04),
			rgba(208, 218, 255, calc(0.18 * var(--shimmer-strength))),
			rgba(255, 255, 255, 0.06)
		);
		mix-blend-mode: screen;
	}

	.light-pass {
		inset: -14% auto -14% -26%;
		width: 30%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, calc(0.42 * var(--shimmer-strength))),
			rgba(214, 220, 255, calc(0.34 * var(--shimmer-strength))),
			transparent
		);
		transform: skewX(-18deg);
		animation: lightPass 4.8s ease-in-out infinite;
	}

	.overlay-image,
	.text-overlay {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.overlay-image {
		max-width: 64%;
		max-height: 64%;
		object-fit: contain;
		filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.24));
	}

	.text-overlay {
		max-width: 78%;
		text-align: center;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.92);
		text-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
		white-space: pre-wrap;
	}

	.compare-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.78), transparent);
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.18);
		pointer-events: none;
	}

	.compare-control,
	.checkout-pick {
		display: grid;
		gap: 0.45rem;
		color: rgba(244, 244, 240, 0.82);
	}

	.checkout-form {
		display: grid;
		gap: 0.75rem;
	}

	.bundle-row {
		align-items: end;
		justify-content: space-between;
	}

	.order-button {
		min-width: 10rem;
	}

	.order-button:disabled {
		opacity: 0.7;
		cursor: progress;
	}

	.file-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem;
		font-size: 0.84rem;
		color: rgba(236, 236, 232, 0.68);
	}

	.file-meta span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.upload-note,
	.checkout-note {
		font-size: 0.84rem;
		color: rgba(122, 240, 255, 0.82);
	}

	.upload-error {
		color: #ff9bb1;
	}

	.checkout-note {
		color: #ffd9a0;
	}

	.mobile-order-bar {
		position: fixed;
		left: 0.75rem;
		right: 0.75rem;
		bottom: 0.75rem;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.8rem 0.9rem;
		border-radius: 1.1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(10, 14, 22, 0.92);
		backdrop-filter: blur(18px);
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
	}

	.mobile-order-bar p,
	.mobile-order-bar strong {
		display: block;
	}

	.mobile-order-bar p {
		font-size: 0.72rem;
		color: rgba(236, 236, 232, 0.62);
	}

	.mobile-order-bar strong {
		font-size: 1rem;
		color: #faf8f4;
	}

	@keyframes lightPass {
		0%,
		18% {
			transform: translateX(0) skewX(-18deg);
			opacity: 0;
		}

		30%,
		70% {
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
			grid-template-columns: minmax(0, 1.12fr) minmax(20rem, 0.88fr);
			align-items: start;
		}

		.mobile-order-bar {
			display: none;
		}
	}

	@media (max-width: 979px) {
		.preview-section {
			padding-bottom: 7rem;
		}
	}

	@media (max-width: 640px) {
		.preview-stage {
			min-height: 20rem;
		}

		.base-image {
			width: min(15rem, 100%);
		}

		.bundle-row {
			display: grid;
			grid-template-columns: 1fr;
		}

		.mobile-order-bar {
			padding: 0.7rem 0.8rem;
		}
	}
</style>
