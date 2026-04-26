<script lang="ts">
	import { onMount } from 'svelte';
	import { removeLightBackgroundFromFile } from '$lib/browser/overlay-tools';
	import { featuredCheckoutOffers } from '$lib/pricing';

	type TextStyle = 'serif' | 'handwritten' | 'clean';
	type GlowMode = 'soft' | 'signature' | 'extra';

	const textStyles: { id: TextStyle; label: string }[] = [
		{ id: 'serif', label: 'Serif' },
		{ id: 'handwritten', label: 'Handwritten' },
		{ id: 'clean', label: 'Clean' }
	];

	const glowModes: { id: GlowMode; label: string; shimmer: number }[] = [
		{ id: 'soft', label: 'Soft', shimmer: 34 },
		{ id: 'signature', label: 'Signature', shimmer: 56 },
		{ id: 'extra', label: 'Extra Glow', shimmer: 74 }
	];

	const bundleLabels: Record<string, string> = {
		'1': '1 Holographe',
		'3': 'Set of 3',
		'5': 'Family Set'
	};

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
	let isTikTokVisitor = $state(false);

	let overlayEnabled = $state(true);
	let overlayScale = $state(52);
	let overlayY = $state(48);
	let overlayRotation = $state(-3);
	let brightness = $state(100);
	let shimmer = $state(56);
	let compareSplit = $state(56);
	let textOverlay = $state('');
	let textStyle = $state<TextStyle>('handwritten');
	let textSize = $state(24);
	let textY = $state(83);
	let giftMode = $state(false);
	let giftMessage = $state('');
	let shipDirect = $state(true);
	let selectedBundle = $state(String(featuredCheckoutOffers[1]?.quantity ?? featuredCheckoutOffers[0].quantity));
	let glowMode = $state<GlowMode>('signature');
	let previewTiltX = $state(0);
	let previewTiltY = $state(0);
	let lightX = $state(50);
	let lightY = $state(38);

	let baseUploadInput: HTMLInputElement | null = null;
	let baseCameraInput: HTMLInputElement | null = null;
	let overlayUploadInput: HTMLInputElement | null = null;
	let overlayCameraInput: HTMLInputElement | null = null;
	let previewStage: HTMLDivElement | null = null;

	const currentBaseSrc = $derived(uploadedBaseSrc || '/holographe/leo.png');
	const currentBaseAlt = $derived(uploadedBaseName || 'Preview of your Holographe keepsake');
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const hasUnsavedDesign = $derived(
		(Boolean(uploadedBaseName) && !uploadedBaseBlobUrl) ||
			(Boolean(uploadedOverlayName) && !uploadedOverlayBlobUrl)
	);
	const canOrder = $derived(
		!hasUnsavedDesign && baseUploadState !== 'uploading' && overlayUploadState !== 'uploading' && !overlayProcessing
	);
	const currentBundlePrice = $derived(
		featuredCheckoutOffers.find((offer) => String(offer.quantity) === selectedBundle)?.priceLabel ?? '$14.99'
	);
	const currentBundleLabel = $derived(bundleLabels[selectedBundle] ?? 'Family Set');
	const stageStyle = $derived(
		`--tilt-x:${previewTiltX}deg; --tilt-y:${previewTiltY}deg; --light-x:${lightX}%; --light-y:${lightY}%; --shimmer-strength:${shimmer / 100};`
	);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const source = `${params.get('utm_source') ?? ''} ${params.get('ref') ?? ''} ${document.referrer}`.toLowerCase();
		isTikTokVisitor = source.includes('tiktok');
	});

	function setGlowMode(mode: GlowMode) {
		glowMode = mode;
		shimmer = glowModes.find((item) => item.id === mode)?.shimmer ?? 56;
	}

	function getTextFont(style: TextStyle) {
		if (style === 'handwritten') return '"Snell Roundhand", "Brush Script MT", cursive';
		if (style === 'clean') return '"Avenir Next", "Helvetica Neue", sans-serif';
		return '"Iowan Old Style", Georgia, serif';
	}

	function handlePointerMove(event: PointerEvent) {
		if (!previewStage) return;
		const bounds = previewStage.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width;
		const y = (event.clientY - bounds.top) / bounds.height;
		lightX = Math.max(12, Math.min(88, x * 100));
		lightY = Math.max(10, Math.min(82, y * 100));
		previewTiltY = (x - 0.5) * 6;
		previewTiltX = (0.5 - y) * 5;
	}

	function resetPreviewTilt() {
		previewTiltX = 0;
		previewTiltY = 0;
		lightX = 50;
		lightY = 38;
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
			<p class="eyebrow">{isTikTokVisitor ? 'Try it with your own photo' : 'Start with a memory'}</p>
			<h2>{isTikTokVisitor ? 'Your camera roll probably has one.' : 'Upload a photo. Watch it become something more.'}</h2>
			<p>{isTikTokVisitor ? 'The photo is cute. The light makes it unforgettable.' : 'See the moment shift in the light.'}</p>
		</div>

		<div class:tikTok-first={isTikTokVisitor} class="builder-card">
			<div class="builder-grid">
				<div class="preview-panel">
					<div
						bind:this={previewStage}
						class="preview-stage"
						role="img"
						aria-label="Interactive Holographe preview comparing the original photo and the holographic effect"
						style={stageStyle}
						onpointermove={handlePointerMove}
						onpointerleave={resetPreviewTilt}
						onpointerup={resetPreviewTilt}
					>
						<div class="preview-card original-layer" style={`filter: brightness(${brightness}%);`}>
							<img class="base-image" src={currentBaseSrc} alt={currentBaseAlt} />
						</div>

						<div
							class="preview-card holographic-layer"
							style={`clip-path: inset(0 ${100 - compareSplit}% 0 0); filter: brightness(${brightness}%);`}
						>
							<img class="base-image" src={currentBaseSrc} alt={currentBaseAlt} />
							<div class="holographic-wash"></div>
							<div class="light-pass"></div>
							<div class="specular-ring"></div>

							{#if overlayEnabled && currentOverlaySrc}
								<img
									class="overlay-image"
									src={currentOverlaySrc}
									alt="Overlay preview"
									style={`transform: translate(-50%, -50%) rotate(${overlayRotation}deg) scale(${overlayScale / 100}); top:${overlayY}%;`}
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

					<div class="compare-head">
						<strong>See the moment shift in the light.</strong>
						<span>Original / Holographe Preview</span>
					</div>

					<label class="compare-control">
						<span>Before / After</span>
						<input type="range" min="6" max="94" bind:value={compareSplit} />
					</label>

					<div class="glow-pills" role="tablist" aria-label="Holographic intensity">
						{#each glowModes as mode (mode.id)}
							<button
								type="button"
								class:active={glowMode === mode.id}
								class="glow-pill"
								onclick={() => setGlowMode(mode.id)}
							>
								{mode.label}
							</button>
						{/each}
					</div>

					<div class="checkout-card">
						<form id="homepage-order-form" class="checkout-form" method="POST" action="/checkout">
							<input type="hidden" name="source" value={isTikTokVisitor ? 'home-tiktok-preview' : 'home-live-preview'} />
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
									<span>Choose quantity</span>
									<select name="quantity" bind:value={selectedBundle}>
										{#each featuredCheckoutOffers as offer (offer.quantity)}
											<option value={offer.quantity}>
												{bundleLabels[String(offer.quantity)] ?? `${offer.quantity} Holographes`} · {offer.priceLabel}
											</option>
										{/each}
									</select>
								</label>
								<button class="button-primary order-button" type="submit" disabled={!canOrder}>
									{canOrder ? 'Create Yours' : 'Finish Saving'}
								</button>
							</div>
						</form>

						<p class="checkout-note">Almost yours. Review your keepsake before we make it.</p>
						{#if hasUnsavedDesign}
							<p class="upload-warn">Your preview is ready. Cloud save must finish before checkout.</p>
						{/if}
					</div>
				</div>

				<div class="controls-panel">
					<div class="control-block">
						<p class="label">Step 1</p>
						<h3>Upload your photo</h3>
						<p class="micro">Upload or take one now.</p>
						<div class="button-row">
							<button type="button" class="soft-button" onclick={() => baseUploadInput?.click()}>
								Upload photo
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
						<h3>Add the part only they would understand.</h3>
						<p class="micro">A note. A date. Handwriting. Tiny details that matter.</p>
						<input
							class="text-input"
							type="text"
							bind:value={textOverlay}
							placeholder="Add a short message, name, or date"
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
							<input type="range" min="18" max="38" bind:value={textSize} />
						</label>
					</div>

					<div class="control-block">
						<p class="label">Step 3</p>
						<h3>Upload overlay</h3>
						<p class="micro">Handwritten note, drawing, footprint, paw print, ultrasound, letter.</p>
						<div class="button-row">
							<button type="button" class="soft-button" onclick={() => overlayUploadInput?.click()}>
								Upload overlay
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
							<button
								type="button"
								class="soft-button"
								onclick={cleanOverlayBackground}
								disabled={!currentOverlaySrc || overlayProcessing}
							>
								{overlayProcessing ? 'Cleaning...' : 'Remove paper background'}
							</button>
							<button
								type="button"
								class="soft-button ghost"
								onclick={() => (overlayEnabled = !overlayEnabled)}
								disabled={!currentOverlaySrc}
							>
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
							<input type="range" min="88" max="118" bind:value={brightness} />
						</label>
						<label class="slider-wrap">
							<span>Overlay size</span>
							<input type="range" min="26" max="86" bind:value={overlayScale} />
						</label>
						<label class="slider-wrap">
							<span>Overlay rotate</span>
							<input type="range" min="-18" max="18" bind:value={overlayRotation} />
						</label>
					</div>

					<div class="control-block compact gift-block">
						<p class="label">Gift option</p>
						<h3>Already gift-ready.</h3>
						<p class="micro">Finished with a black envelope and white ribbon.</p>
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
								placeholder="Include a short message"
							></textarea>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="camera-roll-strip glass-card">
			<p class="eyebrow">Made for the photos sitting in your camera roll.</p>
			<div class="camera-roll-list">
				<span>Baby photo</span>
				<span>Pet photo</span>
				<span>Wedding photo</span>
				<span>Handwritten note</span>
				<span>Memorial photo</span>
				<span>Ultrasound</span>
				<span>Graduation</span>
				<span>Grandparents</span>
				<span>Mother’s Day</span>
				<span>Father’s Day</span>
			</div>
		</div>
	</div>

	<div class="mobile-order-bar">
		<div>
			<p>{isTikTokVisitor ? 'Try it with your own photo' : currentBundleLabel}</p>
			<strong>{currentBundlePrice}</strong>
		</div>
		<button class="button-primary" type="submit" form="homepage-order-form" disabled={!canOrder}>
			{canOrder ? (isTikTokVisitor ? 'Try Your Photo' : 'Create Yours') : 'Saving...'}
		</button>
	</div>
</section>

<style>
	.preview-layout,
	.preview-panel,
	.controls-panel,
	.checkout-card {
		display: grid;
		gap: 1rem;
	}

	.section-copy {
		display: grid;
		gap: 0.65rem;
		max-width: 34rem;
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
		color: #f4f0e8;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3.15rem);
		line-height: 0.98;
	}

	h3 {
		font-size: 1.08rem;
	}

	.section-copy p:last-child {
		color: rgba(236, 228, 216, 0.74);
		font-size: 0.95rem;
	}

	.builder-card {
		padding: 1rem;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01)),
			linear-gradient(160deg, rgba(12, 12, 14, 0.96), rgba(7, 7, 9, 0.98));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 28px 70px rgba(0, 0, 0, 0.28);
	}

	.builder-grid {
		display: grid;
		gap: 1rem;
	}

	.control-block {
		display: grid;
		gap: 0.68rem;
		padding: 1rem;
		border-radius: 1.35rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.label,
	.slider-wrap span,
	.checkout-pick span,
	.compare-control span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(237, 226, 213, 0.56);
	}

	.micro {
		font-size: 0.88rem;
		line-height: 1.45;
		color: rgba(236, 228, 216, 0.66);
	}

	.button-row,
	.style-row,
	.bundle-row,
	.glow-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.soft-button,
	.mini-chip,
	.glow-pill,
	.file-meta button {
		padding: 0.72rem 0.96rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(232, 217, 191, 0.08), rgba(255, 255, 255, 0.025)),
			rgba(255, 255, 255, 0.025);
		color: #f5efe7;
		font-weight: 600;
		transition:
			transform 160ms ease,
			border-color 160ms ease,
			background 160ms ease;
	}

	.soft-button:hover,
	.mini-chip:hover,
	.glow-pill:hover {
		transform: translateY(-1px);
	}

	.soft-button.ghost {
		background: rgba(255, 255, 255, 0.014);
	}

	.mini-chip.active,
	.glow-pill.active {
		border-color: rgba(255, 231, 204, 0.34);
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(232, 217, 191, 0.14), rgba(197, 215, 255, 0.08)),
			rgba(255, 255, 255, 0.03);
		color: #fff9f2;
	}

	.hidden-input {
		display: none;
	}

	.text-input,
	.gift-message,
	.checkout-pick select {
		width: 100%;
		padding: 0.88rem 0.96rem;
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text);
	}

	.slider-wrap {
		display: grid;
		gap: 0.45rem;
	}

	input[type='range'] {
		width: 100%;
		accent-color: #f2d2a8;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: rgba(247, 241, 232, 0.88);
		font-weight: 600;
	}

	.preview-stage {
		position: relative;
		min-height: 27rem;
		border-radius: 1.8rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 30%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
			linear-gradient(160deg, rgba(34, 34, 38, 0.72), rgba(11, 11, 14, 0.92));
		touch-action: none;
	}

	.preview-card {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 1rem;
		transform:
			perspective(1100px)
			rotateX(var(--tilt-x))
			rotateY(var(--tilt-y));
		transition: transform 140ms ease;
	}

	.base-image {
		display: block;
		width: min(18.5rem, 100%);
		border-radius: 1.2rem;
		box-shadow: 0 24px 54px rgba(0, 0, 0, 0.24);
	}

	.holographic-wash,
	.light-pass,
	.specular-ring {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.holographic-wash {
		background:
			radial-gradient(circle at var(--light-x) var(--light-y), rgba(255, 255, 255, 0.14), transparent 14%),
			linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.03),
				rgba(199, 214, 255, calc(0.14 * var(--shimmer-strength))),
				rgba(243, 214, 188, calc(0.12 * var(--shimmer-strength))),
				rgba(255, 255, 255, 0.05)
			);
		mix-blend-mode: screen;
	}

	.light-pass {
		inset: -16% auto -16% -24%;
		width: 28%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.07),
			rgba(255, 255, 255, calc(0.26 * var(--shimmer-strength))),
			rgba(240, 223, 193, calc(0.25 * var(--shimmer-strength))),
			rgba(201, 214, 255, calc(0.18 * var(--shimmer-strength))),
			transparent
		);
		transform: translateX(calc((var(--light-x) - 50%) * 0.35)) skewX(-18deg);
		animation: lightPass 5.2s ease-in-out infinite;
	}

	.specular-ring {
		background: radial-gradient(circle at var(--light-x) var(--light-y), rgba(255, 255, 255, 0.1), transparent 18%);
		opacity: 0.8;
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
		filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.2));
	}

	.text-overlay {
		max-width: 78%;
		text-align: center;
		line-height: 1.1;
		color: rgba(255, 251, 245, 0.96);
		text-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
		white-space: pre-wrap;
	}

	.compare-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		background: linear-gradient(180deg, transparent, rgba(255, 248, 240, 0.86), transparent);
		box-shadow: 0 0 24px rgba(255, 237, 213, 0.22);
		pointer-events: none;
	}

	.compare-head,
	.compare-control,
	.checkout-pick {
		display: grid;
		gap: 0.45rem;
		color: rgba(246, 241, 234, 0.82);
	}

	.compare-head strong {
		font-size: 0.96rem;
		font-weight: 600;
		color: #faf5ee;
	}

	.compare-head span {
		font-size: 0.84rem;
		color: rgba(236, 228, 216, 0.62);
	}

	.checkout-form {
		display: grid;
		gap: 0.8rem;
	}

	.bundle-row {
		align-items: end;
		justify-content: space-between;
	}

	.order-button {
		min-width: 11rem;
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
		color: rgba(236, 228, 216, 0.68);
	}

	.file-meta span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.upload-note,
	.checkout-note,
	.upload-warn {
		font-size: 0.84rem;
	}

	.upload-note {
		color: rgba(214, 224, 255, 0.84);
	}

	.upload-error {
		color: #ff9eb1;
	}

	.checkout-note {
		color: rgba(247, 240, 230, 0.72);
	}

	.upload-warn {
		color: #f2d2a8;
	}

	.camera-roll-strip {
		display: grid;
		gap: 0.9rem;
		padding: 1rem 1.1rem;
	}

	.camera-roll-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.camera-roll-list span {
		padding: 0.48rem 0.74rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(245, 239, 231, 0.78);
		font-size: 0.82rem;
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
		padding: 0.78rem 0.9rem;
		border-radius: 1.15rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(9, 9, 11, 0.9);
		backdrop-filter: blur(18px);
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
	}

	.mobile-order-bar p,
	.mobile-order-bar strong {
		display: block;
	}

	.mobile-order-bar p {
		font-size: 0.72rem;
		color: rgba(236, 228, 216, 0.62);
	}

	.mobile-order-bar strong {
		font-size: 1rem;
		color: #faf5ee;
	}

	@keyframes lightPass {
		0%,
		18% {
			transform: translateX(-4%) skewX(-18deg);
			opacity: 0;
		}

		34%,
		72% {
			transform: translateX(420%) skewX(-18deg);
			opacity: 1;
		}

		100% {
			transform: translateX(470%) skewX(-18deg);
			opacity: 0;
		}
	}

	@media (min-width: 980px) {
		.builder-grid {
			grid-template-columns: minmax(0, 1.08fr) minmax(20rem, 0.92fr);
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

		.tikTok-first .builder-grid {
			display: flex;
			flex-direction: column-reverse;
		}
	}

	@media (max-width: 640px) {
		.preview-stage {
			min-height: 21rem;
		}

		.base-image {
			width: min(15.25rem, 100%);
		}

		.bundle-row {
			display: grid;
			grid-template-columns: 1fr;
		}

		.mobile-order-bar {
			padding: 0.72rem 0.8rem;
		}
	}
</style>
