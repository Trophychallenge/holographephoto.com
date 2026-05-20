<script lang="ts">
	import { onMount } from 'svelte';
	import { removeLightBackgroundFromFile } from '$lib/browser/overlay-tools';
	import { featuredCheckoutOffers } from '$lib/pricing';
	import { orderStudioOpen } from '$lib/stores/order-studio';

	type TextStyle = 'serif' | 'handwritten' | 'clean' | 'modern' | 'classic';
	type TextTone = 'ivory' | 'blush' | 'champagne' | 'sky' | 'charcoal';

	const demoAfterSrc = '/holographe/jess-holo-hero.webp';

	const bundleLabels: Record<string, string> = {
		'1': '1 Holograph',
		'3': 'Set of 3',
		'5': 'Family Set'
	};

	let { isTikTokVisitor = false, initialOpen = false } = $props();

	let uploadedBaseSrc = $state('');
	let uploadedBaseName = $state('');
	let uploadedOverlaySrc = $state('');
	let uploadedOverlayName = $state('');
	let uploadedBaseBlobUrl = $state('');
	let uploadedOverlayBlobUrl = $state('');
	let uploadedBaseBlobPathname = $state('');
	let uploadedOverlayBlobPathname = $state('');
	let baseUploadState = $state<'idle' | 'uploading' | 'saved' | 'local' | 'error'>('idle');
	let overlayUploadState = $state<'idle' | 'uploading' | 'saved' | 'local' | 'error'>('idle');
	let baseUploadMessage = $state('');
	let overlayUploadMessage = $state('');
	let overlayProcessing = $state(false);

	let baseScale = $state(100);
	let baseX = $state(50);
	let baseY = $state(50);
	let photoToolsOpen = $state(false);
	let overlayEnabled = $state(true);
	let overlayScale = $state(30);
	let overlayRotation = $state(-4);
	let overlayX = $state(50);
	let overlayY = $state(52);
	let brightness = $state(100);
	let shimmer = $state(50);
	let textOverlay = $state('');
	let textStyle = $state<TextStyle>('handwritten');
	let textTone = $state<TextTone>('ivory');
	let textSize = $state(28);
	let textX = $state(50);
	let textY = $state(84);
	let roundedEdges = $state('yes');
	let frameOption = $state('no');
	let printSize = $state('8x10');
	let personalRequest = $state('');
	let giftMode = $state(false);
	let giftMessage = $state('');
	let shipDirect = $state(true);
	let selectedBundle = $state(String(featuredCheckoutOffers[0]?.quantity ?? 1));
	let checkoutError = $state('');
	let checkoutLoading = $state(false);
	let orderPanelOpen = $state(false);
	let overlayToolsOpen = $state(false);

	let baseUploadInput: HTMLInputElement | null = null;
	let baseCameraInput: HTMLInputElement | null = null;
	let overlayUploadInput = $state<HTMLInputElement | null>(null);
	let overlayCameraInput = $state<HTMLInputElement | null>(null);
	let originalCanvas = $state<HTMLCanvasElement | null>(null);
	let baseImageElement = $state<HTMLImageElement | null>(null);
	let overlayImageElement = $state<HTMLImageElement | null>(null);

	const currentBaseSrc = $derived(uploadedBaseSrc || demoAfterSrc);
	const currentBaseAlt = $derived(uploadedBaseName || 'Holograph sample preview');
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const currentBundlePrice = $derived(
		featuredCheckoutOffers.find((offer) => String(offer.quantity) === selectedBundle)?.priceLabel ?? '$19.99'
	);
	const currentBundleLabel = $derived(bundleLabels[selectedBundle] ?? 'Family Set');
	const hasUnsavedDesign = $derived(
		(Boolean(uploadedBaseName) && !uploadedBaseBlobUrl) ||
			(Boolean(uploadedOverlayName) && !uploadedOverlayBlobUrl)
	);
	const canOrder = $derived(
		!hasUnsavedDesign && baseUploadState !== 'uploading' && overlayUploadState !== 'uploading' && !overlayProcessing
	);
	const uploadReady = $derived(Boolean(uploadedBaseName || uploadedBaseSrc));
	const uploadSaved = $derived(Boolean(uploadedBaseBlobUrl) || !uploadedBaseName);
	const canPersonalize = $derived(uploadReady && uploadSaved);
	onMount(() => {
		void syncBaseImage(currentBaseSrc);
		if (currentOverlaySrc) void syncOverlayImage(currentOverlaySrc);
	});

	$effect(() => {
		void syncBaseImage(currentBaseSrc);
	});

	$effect(() => {
		void syncOverlayImage(currentOverlaySrc);
	});

	$effect(() => {
		drawPreviews();
	});

	$effect(() => {
		const unsubscribe = orderStudioOpen.subscribe((open) => {
			orderPanelOpen = open;
		});
		return unsubscribe;
	});

	$effect(() => {
		if (!initialOpen) return;
		orderPanelOpen = true;
		orderStudioOpen.set(true);
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (orderPanelOpen) {
			url.searchParams.set('order', '1');
		} else {
			url.searchParams.delete('order');
		}
		window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = orderPanelOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	async function submitCheckoutForm(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		checkoutError = '';
		checkoutLoading = true;

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: {
					accept: 'application/json',
					'x-holograph-ajax': '1'
				}
			});

			const result = (await response.json().catch(() => ({}))) as { error?: string; url?: string };

			if (!response.ok || !result.url) {
				checkoutError = result.error || 'Checkout could not start right now. Please try again.';
				return;
			}

			window.location.href = result.url;
		} catch {
			checkoutError = 'Checkout could not start right now. Please try again.';
		} finally {
			checkoutLoading = false;
		}
	}

	function closeOrderPanel() {
		orderPanelOpen = false;
		orderStudioOpen.set(false);
	}

	function loadImage(src: string) {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			const image = new Image();
			image.decoding = 'async';
			image.onload = () => resolve(image);
			image.onerror = () => reject(new Error('Image failed to load.'));
			image.src = src;
		});
	}

	async function syncBaseImage(src: string) {
		try {
			baseImageElement = await loadImage(src);
			drawPreviews();
		} catch {
			baseImageElement = null;
		}
	}

	async function syncOverlayImage(src: string) {
		if (!src) {
			overlayImageElement = null;
			drawPreviews();
			return;
		}

		try {
			overlayImageElement = await loadImage(src);
			drawPreviews();
		} catch {
			overlayImageElement = null;
		}
	}

	function getTextFont(style: TextStyle) {
		if (style === 'handwritten') return '"Snell Roundhand", "Brush Script MT", cursive';
		if (style === 'clean') return '"Avenir Next", "Helvetica Neue", sans-serif';
		if (style === 'modern') return '"Futura", "Avenir Next", sans-serif';
		if (style === 'classic') return '"Baskerville", "Times New Roman", serif';
		return '"Iowan Old Style", Georgia, serif';
	}

	function getTextColor(tone: TextTone) {
		if (tone === 'blush') return '#ffdce8';
		if (tone === 'champagne') return '#f6e2bf';
		if (tone === 'sky') return '#d7ebff';
		if (tone === 'charcoal') return '#2c2a2a';
		return '#fbf8f3';
	}

	function fitRect(width: number, height: number, boundsWidth: number, boundsHeight: number) {
		const scale = Math.min(boundsWidth / width, boundsHeight / height);
		const drawWidth = width * scale;
		const drawHeight = height * scale;
		return {
			x: (boundsWidth - drawWidth) / 2,
			y: (boundsHeight - drawHeight) / 2,
			width: drawWidth,
			height: drawHeight
		};
	}

	function fillRect(width: number, height: number, boundsWidth: number, boundsHeight: number) {
		const scale = Math.max(boundsWidth / width, boundsHeight / height);
		const drawWidth = width * scale;
		const drawHeight = height * scale;
		return {
			x: (boundsWidth - drawWidth) / 2,
			y: (boundsHeight - drawHeight) / 2,
			width: drawWidth,
			height: drawHeight
		};
	}

	function roundedRectPath(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number
	) {
		context.beginPath();
		context.moveTo(x + radius, y);
		context.arcTo(x + width, y, x + width, y + height, radius);
		context.arcTo(x + width, y + height, x, y + height, radius);
		context.arcTo(x, y + height, x, y, radius);
		context.arcTo(x, y, x + width, y, radius);
		context.closePath();
	}

	function drawBaseCard(
		context: CanvasRenderingContext2D,
		image: HTMLImageElement,
		canvas: HTMLCanvasElement
	) {
		const width = canvas.width;
		const height = canvas.height;
		context.clearRect(0, 0, width, height);

		context.fillStyle = '#080808';
		context.fillRect(0, 0, width, height);

		const card = { x: 18, y: 18, width: width - 36, height: height - 36, radius: 34 };

		context.save();
		roundedRectPath(context, card.x, card.y, card.width, card.height, card.radius);
		context.clip();

		const imageRect = fillRect(image.width, image.height, card.width, card.height);
		const drawWidth = imageRect.width * (baseScale / 100);
		const drawHeight = imageRect.height * (baseScale / 100);
		const overflowX = Math.max(0, drawWidth - card.width);
		const overflowY = Math.max(0, drawHeight - card.height);
		const offsetX = (baseX / 100) * overflowX;
		const offsetY = (baseY / 100) * overflowY;
		context.fillStyle = '#050505';
		context.fillRect(card.x, card.y, card.width, card.height);
		context.drawImage(
			image,
			card.x - offsetX,
			card.y - offsetY,
			drawWidth,
			drawHeight
		);
		context.restore();

		context.save();
		context.strokeStyle = 'rgba(255,255,255,0.1)';
		context.lineWidth = 1.5;
		roundedRectPath(context, card.x, card.y, card.width, card.height, card.radius);
		context.stroke();
		context.restore();

		return card;
	}

	function drawOverlayImage(context: CanvasRenderingContext2D, card: ReturnType<typeof drawBaseCard>) {
		if (!overlayEnabled || !overlayImageElement) return;

		const targetWidth = card.width * (overlayScale / 100);
		const aspectRatio = overlayImageElement.width / overlayImageElement.height;
		const targetHeight = targetWidth / aspectRatio;
		const centerX = card.x + card.width * (overlayX / 100);
		const centerY = card.y + card.height * (overlayY / 100);

		context.save();
		context.translate(centerX, centerY);
		context.rotate((overlayRotation * Math.PI) / 180);
		context.globalAlpha = 0.92;
		context.drawImage(
			overlayImageElement,
			-targetWidth / 2,
			-targetHeight / 2,
			targetWidth,
			targetHeight
		);
		context.restore();
	}

	function drawTextOverlay(context: CanvasRenderingContext2D, card: ReturnType<typeof drawBaseCard>) {
		const text = textOverlay.trim();
		if (!text) return;

		context.save();
		context.font = `600 ${textSize}px ${getTextFont(textStyle)}`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.shadowColor = textTone === 'charcoal' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.36)';
		context.shadowBlur = 18;
		context.lineWidth = textTone === 'charcoal' ? 5 : 3;
		context.strokeStyle = textTone === 'charcoal' ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.18)';
		context.strokeText(text, card.x + card.width * (textX / 100), card.y + card.height * (textY / 100));
		context.fillStyle = getTextColor(textTone);
		context.fillText(text, card.x + card.width * (textX / 100), card.y + card.height * (textY / 100));
		context.restore();
	}

	function drawPreviews() {
		if (!baseImageElement || !originalCanvas) return;

		const originalContext = originalCanvas.getContext('2d');
		if (!originalContext) return;

		originalCanvas.width = 900;
		originalCanvas.height = 1125;

		const originalCard = drawBaseCard(originalContext, baseImageElement, originalCanvas);
		drawTextOverlay(originalContext, originalCard);
		drawOverlayImage(originalContext, originalCard);

	}

	async function persistDesignAsset(
		file: File,
		slot: 'base' | 'overlay'
	): Promise<{ url: string; pathname: string }> {
		const payload = new FormData();
		payload.set('file', file);
		payload.set('slot', slot);

		const response = await fetch('/api/upload-design', {
			method: 'POST',
			body: payload
		});

		const result = (await response.json()) as { error?: string; url?: string; pathname?: string };
		if (!response.ok || !result.url || !result.pathname) {
			throw new Error(result.error || 'Upload failed.');
		}

		return {
			url: result.url,
			pathname: result.pathname
		};
	}

	async function applyUploadedFile(file: File, type: 'base' | 'overlay') {
		if (type === 'overlay') overlayProcessing = true;
		const fileToUse =
			type === 'overlay' ? await removeLightBackgroundFromFile(file).catch(() => file) : file;
		const objectUrl = URL.createObjectURL(fileToUse);

		if (type === 'base') {
			if (uploadedBaseSrc) URL.revokeObjectURL(uploadedBaseSrc);
			uploadedBaseSrc = objectUrl;
			uploadedBaseName = fileToUse.name;
			uploadedBaseBlobUrl = '';
			baseUploadState = 'uploading';
			baseUploadMessage = 'Saving your photo...';
		} else {
			if (uploadedOverlaySrc) URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = objectUrl;
			uploadedOverlayName = fileToUse.name;
			uploadedOverlayBlobUrl = '';
			overlayUploadState = 'uploading';
			overlayUploadMessage = 'Cleaning background and saving your overlay...';
			overlayEnabled = true;
		}

		try {
			const blob = await persistDesignAsset(fileToUse, type);

			if (type === 'base') {
				uploadedBaseBlobUrl = blob.url;
				uploadedBaseBlobPathname = blob.pathname;
				baseUploadState = 'saved';
				baseUploadMessage = 'Photo saved.';
			} else {
				uploadedOverlayBlobUrl = blob.url;
				uploadedOverlayBlobPathname = blob.pathname;
				overlayUploadState = 'saved';
				overlayUploadMessage = 'Overlay cleaned and saved.';
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Cloud save is unavailable right now.';
			const fallbackMessage =
				message === 'Upload failed.' ? 'Cloud save is unavailable right now.' : message;

			if (type === 'base') {
				baseUploadState = 'local';
				baseUploadMessage = `Preview ready here. ${fallbackMessage}`;
			} else {
				overlayUploadState = 'local';
				overlayUploadMessage = `Overlay ready here. ${fallbackMessage}`;
			}
		} finally {
			if (type === 'overlay') overlayProcessing = false;
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
		overlayUploadMessage = 'Removing light background...';

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
			uploadedBaseBlobPathname = '';
			baseUploadState = 'idle';
			baseUploadMessage = '';
			baseScale = 100;
			baseX = 50;
			baseY = 50;
			photoToolsOpen = false;
		}

		if (type === 'overlay' && uploadedOverlaySrc) {
			URL.revokeObjectURL(uploadedOverlaySrc);
			uploadedOverlaySrc = '';
			uploadedOverlayName = '';
			uploadedOverlayBlobUrl = '';
			uploadedOverlayBlobPathname = '';
			overlayUploadState = 'idle';
			overlayUploadMessage = '';
			overlayEnabled = true;
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && orderPanelOpen) closeOrderPanel();
	}

	function toggleRoundedEdges(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		roundedEdges = input.checked ? 'yes' : 'no';
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<section class="preview-section" id="preview-builder">
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

	{#if orderPanelOpen}
		<div class="order-panel-shell" role="dialog" aria-modal="true" aria-label="Order studio">
			<button class="order-panel-backdrop" type="button" aria-label="Close order panel" onclick={closeOrderPanel}></button>
			<div class="order-panel glass-card studio-panel">
				<div class="order-panel-head">
					<div>
						<p class="label">Order studio</p>
						<h3>Upload, customize, complete.</h3>
					</div>
					<button type="button" class="checkout-error-close" onclick={closeOrderPanel}>Close</button>
				</div>
				<form
					id="homepage-order-form"
					class="order-panel-form studio-form"
					method="POST"
					action="/checkout"
					onsubmit={submitCheckoutForm}
				>
					<input type="hidden" name="source" value={isTikTokVisitor ? 'home-tiktok-preview' : 'home-live-preview'} />
					<input type="hidden" name="base_name" value={uploadedBaseName} />
					<input type="hidden" name="overlay_name" value={uploadedOverlayName} />
					<input type="hidden" name="base_blob_url" value={uploadedBaseBlobUrl} />
					<input type="hidden" name="overlay_blob_url" value={uploadedOverlayBlobUrl} />
					<input type="hidden" name="base_blob_pathname" value={uploadedBaseBlobPathname} />
					<input type="hidden" name="overlay_blob_pathname" value={uploadedOverlayBlobPathname} />
					<input type="hidden" name="view_mode" value="compare" />
					<input type="hidden" name="gift_mode" value={giftMode ? 'gift' : 'standard'} />
					<input type="hidden" name="rounded_edges" value={roundedEdges} />
					<input type="hidden" name="frame_option" value={frameOption} />
					<input type="hidden" name="print_size" value={printSize} />
					<input type="hidden" name="personal_request" value={personalRequest} />
					<input type="hidden" name="overlay_text" value={textOverlay} />
					<input type="hidden" name="overlay_text_style" value={textStyle} />
					<input type="hidden" name="overlay_text_color" value={textTone} />
					<input type="hidden" name="gift_message" value={giftMessage} />
					<input type="hidden" name="ship_direct" value={shipDirect ? 'yes' : 'no'} />
					<input type="hidden" name="brightness_level" value={String(brightness)} />
					<input type="hidden" name="shimmer_intensity" value={String(shimmer)} />
					<input type="hidden" name="effect_mode" value="glow" />
					<input type="hidden" name="base_position" value={`${baseX},${baseY},${baseScale}`} />
					<input type="hidden" name="overlay_position" value={`${overlayX},${overlayY},${overlayScale},${overlayRotation}`} />
					<input type="hidden" name="text_position" value={`${textX},${textY},${textSize}`} />

					<div class="studio-grid">
						<div class="studio-preview">
							<div class="preview-stage" aria-label="Holograph sample preview">
								<div class="preview-card original-shell">
									<canvas bind:this={originalCanvas} class="preview-canvas" aria-label={currentBaseAlt}></canvas>
								</div>
							</div>
							<div class="studio-preview-meta">
								<p class="label">Live preview</p>
								<strong>{uploadedBaseName || 'Add your photo to begin.'}</strong>
								<p>
									Move fast here: upload a photo, choose a bundle, then add an extra image or note.
								</p>
								<div class="button-row">
									<button type="button" class="soft-button" onclick={() => baseUploadInput?.click()}>
										{uploadedBaseName ? 'Change photo' : 'Upload photo'}
									</button>
									<button type="button" class="soft-button" onclick={() => baseCameraInput?.click()}>
										Take photo
									</button>
									{#if uploadedBaseName}
										<button type="button" class="soft-button" onclick={() => clearUploadedImage('base')}>
											Remove
										</button>
									{/if}
								</div>
								<button
									type="button"
									class="soft-button photo-edit-trigger"
									onclick={() => (photoToolsOpen = !photoToolsOpen)}
								>
									{photoToolsOpen ? 'Hide photo fit' : 'Adjust photo fit'}
								</button>
								{#if photoToolsOpen}
									<div class="overlay-tools">
										<div class="slider-grid">
											<label>
												<span>Zoom</span>
												<input type="range" min="100" max="170" bind:value={baseScale} />
											</label>
											<label>
												<span>Left / right</span>
												<input type="range" min="0" max="100" bind:value={baseX} />
											</label>
											<label>
												<span>Up / down</span>
												<input type="range" min="0" max="100" bind:value={baseY} />
											</label>
										</div>
									</div>
								{/if}
								{#if baseUploadMessage}
									<p class:upload-error={baseUploadState === 'error'} class="upload-note">{baseUploadMessage}</p>
								{/if}
							</div>
						</div>

						<div class="order-panel-stack studio-controls">
							<div class="step-card">
								<div class="step-head">
									<span class="step-number">1</span>
									<div>
										<strong>Upload your photo</strong>
										<p>Use the buttons on the preview card.</p>
									</div>
								</div>
								<p class="checkout-helper">
									Best results: one clear face or moment, cropped close, with decent light.
								</p>
								<p class:step-status-live={uploadReady} class="step-status">
									{#if uploadedBaseName}
										Photo added and previewing now.
									{:else}
										Waiting for your photo.
									{/if}
								</p>
							</div>

							<div class="step-card">
								<div class="step-head">
									<span class="step-number">2</span>
									<div>
										<strong>Choose your set</strong>
										<p>Start simple. You can reorder later.</p>
									</div>
								</div>
								<label class="checkout-pick">
									<span>Set</span>
									<select name="quantity" bind:value={selectedBundle}>
										{#each featuredCheckoutOffers as offer (offer.quantity)}
											<option value={offer.quantity}>
												{bundleLabels[String(offer.quantity)] ?? `${offer.quantity} Holographs`} · {offer.priceLabel}
											</option>
										{/each}
									</select>
								</label>
								<p class="checkout-helper">Free US shipping on every bundle.</p>
								<div class="bundle-callout">
									<strong>{currentBundleLabel}</strong>
									<span>{currentBundlePrice}</span>
								</div>
							</div>

							<div class="step-card">
								<div class="step-head">
									<span class="step-number">3</span>
									<div>
										<strong>Optional personalization</strong>
										<p>Add an extra image, text, or a note.</p>
									</div>
								</div>
								<div class="button-row">
									<button type="button" class="soft-button" onclick={() => overlayUploadInput?.click()} disabled={!canPersonalize}>
										Upload extra image
									</button>
									<button type="button" class="soft-button" onclick={() => overlayCameraInput?.click()} disabled={!canPersonalize}>
										Take a photo
									</button>
									{#if uploadedOverlayName}
										<button type="button" class="soft-button" onclick={() => clearUploadedImage('overlay')}>
											Remove extra image
										</button>
									{/if}
								</div>
								{#if overlayUploadMessage}
									<p class:upload-error={overlayUploadState === 'error'} class="upload-note">{overlayUploadMessage}</p>
								{/if}
								<button
									type="button"
									class="soft-button overlay-edit-trigger"
									disabled={!canPersonalize}
									onclick={() => (overlayToolsOpen = !overlayToolsOpen)}
								>
									{overlayToolsOpen ? 'Hide extra image edits' : 'Edit extra image'}
								</button>
								{#if !canPersonalize}
									<p class="checkout-helper">Upload and save a photo first to unlock personalization tools.</p>
								{/if}
								{#if overlayToolsOpen}
									<div class="overlay-tools">
										<label class="toggle">
											<input type="checkbox" bind:checked={overlayEnabled} />
											<span>Show extra image</span>
										</label>
										<div class="button-row">
											<button
												type="button"
												class="soft-button"
												disabled={!uploadedOverlaySrc || overlayProcessing}
												onclick={cleanOverlayBackground}
											>
												{overlayProcessing ? 'Cleaning...' : 'Remove light background'}
											</button>
										</div>
										<div class="slider-grid">
											<label>
												<span>Size</span>
												<input type="range" min="18" max="60" bind:value={overlayScale} />
											</label>
											<label>
												<span>Lift</span>
												<input type="range" min="30" max="72" bind:value={overlayY} />
											</label>
											<label>
												<span>Rotate</span>
												<input type="range" min="-20" max="20" bind:value={overlayRotation} />
											</label>
										</div>
										<label class="toggle">
											<input type="checkbox" checked={roundedEdges === 'yes'} onchange={toggleRoundedEdges} />
											<span>Rounded corners</span>
										</label>
										<textarea
											class="gift-message"
											rows="2"
											bind:value={personalRequest}
											placeholder="Optional note for your order"
										></textarea>
									</div>
								{/if}
							</div>

							<div class="step-card action-card summary-card">
								<div class="step-head">
									<span class="step-number">4</span>
									<div>
										<strong>Checkout</strong>
										<p>Preview looks right. Continue securely.</p>
									</div>
								</div>
								<p class:step-status-live={canOrder} class="step-status">
									{#if checkoutLoading}
										Starting secure checkout...
									{:else if !uploadReady}
										Add a photo to continue.
									{:else if !canOrder}
										Finish saving your upload first.
									{:else}
										Ready to order now.
									{/if}
								</p>
								<button class="button-primary quick-order-button" type="submit" disabled={!uploadReady || !canOrder || checkoutLoading}>
									{checkoutLoading ? 'Starting Checkout...' : uploadReady && canOrder ? `Order • ${currentBundlePrice}` : 'Upload Photo First'}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if checkoutError}
		<div class="checkout-error-shell">
			<div class="checkout-error-card glass-card">
				<button type="button" class="checkout-error-close" onclick={() => (checkoutError = '')}>Close</button>
				<p class="label">Checkout issue</p>
				<h3>We could not start checkout.</h3>
				<p class="micro">{checkoutError}</p>
			</div>
		</div>
	{/if}
</section>

<style>
	.preview-section {
		position: relative;
		z-index: 18;
	}

	h3,
	p {
		margin: 0;
	}

	.micro {
		font-size: 0.88rem;
		line-height: 1.45;
	}

	.step-card {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
		border-radius: 1.1rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.step-head {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.75rem;
		align-items: start;
	}

	.step-head strong,
	.step-head p {
		margin: 0;
	}

	.step-head strong {
		font-size: 0.98rem;
		color: #f5efe7;
	}

	.step-head p,
	.checkout-helper {
		font-size: 0.84rem;
		line-height: 1.5;
		color: rgba(236, 228, 216, 0.72);
	}

	.step-number {
		display: inline-grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(247, 243, 238, 0.96), rgba(235, 214, 186, 0.92));
		color: #111;
		font-size: 0.82rem;
		font-weight: 700;
	}

	.quick-order-button {
		width: 100%;
		min-height: 3.2rem;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.label,
	.checkout-pick span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(237, 226, 213, 0.56);
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.soft-button {
		padding: 0.8rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(234, 211, 182, 0.08), rgba(217, 228, 248, 0.05)),
			rgba(255, 255, 255, 0.025);
		color: #f5efe7;
		font-weight: 600;
		transition:
			transform 160ms ease,
			border-color 160ms ease,
			background 160ms ease,
			box-shadow 160ms ease;
	}

	.soft-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 26px rgba(234, 211, 182, 0.08);
	}

	.soft-button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.hidden-input {
		display: none;
	}

	.gift-message,
	.checkout-pick select {
		width: 100%;
		padding: 0.88rem 0.96rem;
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(180deg, rgba(15, 15, 17, 0.96), rgba(11, 11, 13, 0.94)),
			rgba(255, 255, 255, 0.03);
		color: #f8f4ee;
		color-scheme: dark;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.checkout-pick select option {
		background: #111214;
		color: #f8f4ee;
	}

	.gift-message::placeholder {
		color: rgba(236, 228, 216, 0.42);
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: rgba(247, 241, 232, 0.88);
		font-weight: 600;
	}

	.overlay-tools {
		display: grid;
		gap: 0.75rem;
		padding: 0.85rem 0.9rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.slider-grid {
		display: grid;
		gap: 0.7rem;
	}

	.slider-grid label {
		display: grid;
		gap: 0.35rem;
	}

	.slider-grid span {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(237, 226, 213, 0.56);
	}

	.slider-grid input[type='range'] {
		width: 100%;
		accent-color: #ead3b6;
	}

	.preview-stage {
		position: relative;
		min-height: 20rem;
		border-radius: 1.15rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 28%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
			linear-gradient(160deg, rgba(24, 24, 24, 0.8), rgba(8, 8, 8, 0.96));
	}

	.preview-stage::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 62% 28%, rgba(255, 255, 255, 0.1), transparent 15%),
			linear-gradient(115deg, rgba(255, 255, 255, 0.05), transparent 32%, rgba(234, 211, 182, 0.04), transparent 68%);
	}

	.preview-card {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 0.45rem;
	}

	.preview-canvas {
		width: min(18rem, 88%);
		aspect-ratio: 4 / 5;
		height: auto;
		border-radius: 0.85rem;
	}

	.checkout-pick {
		display: grid;
		flex: 1;
		gap: 0.45rem;
	}

	.upload-note {
		font-size: 0.82rem;
		color: rgba(237, 226, 213, 0.66);
	}

	.step-status {
		padding: 0.72rem 0.84rem;
		border-radius: 0.95rem;
		background: rgba(255, 255, 255, 0.035);
		border: 1px solid rgba(255, 255, 255, 0.06);
		font-size: 0.84rem;
		line-height: 1.45;
		color: rgba(236, 228, 216, 0.72);
	}

	.step-status-live {
		border-color: rgba(234, 211, 182, 0.16);
		background: rgba(234, 211, 182, 0.08);
		color: #f5efe7;
	}

	.bundle-callout {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.78rem 0.9rem;
		border-radius: 1rem;
		background:
			linear-gradient(135deg, rgba(234, 211, 182, 0.12), rgba(217, 228, 248, 0.06)),
			rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.bundle-callout strong,
	.bundle-callout span {
		color: #f8f4ee;
	}

	.bundle-callout strong {
		font-size: 0.94rem;
	}

	.bundle-callout span {
		font-size: 1rem;
		font-weight: 700;
	}

	.upload-error {
		color: #f5d3bf;
	}

	.checkout-error-shell {
		position: fixed;
		inset: 0;
		z-index: 1200;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgba(4, 4, 6, 0.76);
		backdrop-filter: blur(16px);
	}

	.checkout-error-card {
		width: min(32rem, calc(100vw - 2rem));
		display: grid;
		gap: 0.75rem;
		padding: 1.2rem;
	}

	.checkout-error-close {
		justify-self: end;
		padding: 0;
		border: 0;
		background: transparent;
		color: rgba(248, 244, 238, 0.72);
		font-size: 0.76rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.gift-message {
		resize: vertical;
		min-height: 5rem;
	}

	.order-panel-shell {
		position: fixed;
		inset: 0;
		z-index: 1100;
		display: grid;
		place-items: center;
		padding: 0.75rem;
	}

	.order-panel-backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(4, 4, 6, 0.72);
		backdrop-filter: blur(14px);
	}

	.order-panel {
		position: relative;
		z-index: 1;
		width: min(980px, calc(100vw - 1rem));
		max-height: calc(100vh - 1rem);
		padding: 0.95rem;
		border-radius: 1.5rem;
		overflow: auto;
	}

	.order-panel-head,
	.order-panel-form,
	.order-panel-stack,
	.studio-preview,
	.studio-preview-meta {
		display: grid;
		gap: 0.8rem;
	}

	.order-panel-head {
		grid-template-columns: 1fr auto;
		align-items: start;
	}

	.studio-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(20rem, 0.92fr);
		gap: 1rem;
		align-items: start;
	}

	.studio-preview {
		position: sticky;
		top: 0;
	}

	.studio-preview-meta {
		padding: 0.95rem 1rem;
		border-radius: 1.15rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.studio-preview-meta strong {
		font-size: 1rem;
		color: #f8f4ee;
	}

	.studio-preview-meta p {
		color: rgba(236, 228, 216, 0.72);
		font-size: 0.84rem;
		line-height: 1.5;
	}

	.action-card :global(.button-secondary) {
		width: 100%;
	}

	.summary-card :global(.button-primary) {
		width: 100%;
	}

	@media (max-width: 860px) {
		.studio-grid {
			grid-template-columns: 1fr;
		}

		.studio-preview {
			position: static;
		}

		.preview-stage {
			min-height: 17rem;
			border-radius: 1.4rem;
		}

		.preview-canvas {
			width: min(15rem, 88%);
		}

		.order-panel {
			width: min(100%, calc(100vw - 0.5rem));
			padding: 0.85rem;
			border-radius: 1.2rem;
		}
	}

	@media (max-width: 640px) {
		.order-panel-shell {
			padding: 0.25rem;
		}

		.order-panel {
			max-height: calc(100vh - 0.5rem);
			padding: 0.8rem;
			border-radius: 1rem;
		}

		.order-panel-head {
			gap: 0.5rem;
		}

		.order-panel-head h3 {
			font-size: 1.2rem;
		}

		.step-card,
		.studio-preview-meta {
			padding: 0.9rem;
			border-radius: 1rem;
		}

		.button-row {
			display: grid;
			grid-template-columns: 1fr;
		}

		.soft-button {
			width: 100%;
			justify-content: center;
		}

		.preview-stage {
			min-height: 15rem;
		}

		.preview-canvas {
			width: min(13rem, 90%);
		}
	}
</style>
