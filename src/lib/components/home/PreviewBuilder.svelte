<script lang="ts">
	import { onMount } from 'svelte';
	import { removeLightBackgroundFromFile } from '$lib/browser/overlay-tools';
	import { featuredCheckoutOffers } from '$lib/pricing';

	type TextStyle = 'serif' | 'handwritten' | 'clean' | 'modern' | 'classic';
	type DragLayer = 'overlay' | 'text' | null;
	type TextTone = 'ivory' | 'blush' | 'champagne' | 'sky' | 'charcoal';
	type MockupScene =
		| 'locker'
		| 'dishwasher'
		| 'clean-dirty'
		| 'dorm-fridge'
		| 'filing-cabinet'
		| 'toolbox'
		| 'gym-locker'
		| 'car';

	const demoAfterSrc = '/holographe/jess-holo-hero.webp';

	const textStyles: { id: TextStyle; label: string }[] = [
		{ id: 'serif', label: 'Serif' },
		{ id: 'handwritten', label: 'Handwritten' },
		{ id: 'clean', label: 'Clean' },
		{ id: 'modern', label: 'Modern' },
		{ id: 'classic', label: 'Classic' }
	];

	const textTones: { id: TextTone; label: string; color: string }[] = [
		{ id: 'ivory', label: 'Ivory', color: '#fbf8f3' },
		{ id: 'blush', label: 'Blush', color: '#ffdce8' },
		{ id: 'champagne', label: 'Champagne', color: '#f6e2bf' },
		{ id: 'sky', label: 'Sky', color: '#d7ebff' },
		{ id: 'charcoal', label: 'Charcoal', color: '#2c2a2a' }
	];

	const bundleLabels: Record<string, string> = {
		'1': '1 Holograph',
		'3': 'Set of 3',
		'5': 'Family Set'
	};

	const sizeOptions = [
		{ value: '4x6', label: '4 x 6' },
		{ value: '5x7', label: '5 x 7' },
		{ value: '8x10', label: '8 x 10' },
		{ value: '11x14', label: '11 x 14' }
	] as const;

	const mockupScenes: {
		id: MockupScene;
		label: string;
		title: string;
		note: string;
		accent: string;
	}[] = [
		{ id: 'locker', label: 'School Locker', title: 'High school locker', note: 'A sweet single for a locker door or first-day surprise.', accent: 'Single available' },
		{ id: 'dishwasher', label: 'Dishwasher', title: 'Dishwasher decor', note: 'A fun kitchen magnet with a personal photo.', accent: 'Home favorite' },
		{ id: 'clean-dirty', label: 'Clean / Dirty', title: 'Clean and dirty magnet', note: 'Personalized for the dishwasher with a useful little twist.', accent: 'Custom idea' },
		{ id: 'dorm-fridge', label: 'Dorm Fridge', title: 'College dorm fridge', note: 'Easy to gift, easy to keep, perfect for tiny spaces.', accent: 'Dorm-ready' },
		{ id: 'filing-cabinet', label: 'Office', title: 'Filing cabinet or office door', note: 'Warm up a workspace without clutter.', accent: 'Workday glow' },
		{ id: 'toolbox', label: 'Tool Box', title: 'Tool box or garage station', note: 'A fun Father’s Day idea for the garage or workshop.', accent: 'Father’s Day' },
		{ id: 'gym-locker', label: 'Gym Locker', title: 'Gym locker', note: 'Small, bright, and easy to spot.', accent: 'Everyday use' },
		{ id: 'car', label: 'Car / Van', title: 'Car, minivan, or business door', note: 'Works on metal surfaces from family vans to mobile business ads.', accent: 'Multi-use' }
	];

	let { isTikTokVisitor = false } = $props();

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
	let selectedMockup = $state<MockupScene>('locker');
	let checkoutError = $state('');
	let checkoutLoading = $state(false);

	let baseUploadInput: HTMLInputElement | null = null;
	let baseCameraInput: HTMLInputElement | null = null;
	let overlayUploadInput: HTMLInputElement | null = null;
	let overlayCameraInput: HTMLInputElement | null = null;
	let originalCanvas = $state<HTMLCanvasElement | null>(null);
	let baseImageElement = $state<HTMLImageElement | null>(null);
	let overlayImageElement = $state<HTMLImageElement | null>(null);

	const currentBaseSrc = $derived(uploadedBaseSrc || demoAfterSrc);
	const currentBaseAlt = $derived(uploadedBaseName || 'Holograph sample preview');
	const currentOverlaySrc = $derived(uploadedOverlaySrc);
	const currentMockupSrc = $derived(uploadedBaseSrc ? currentBaseSrc : demoAfterSrc);
	const currentMockupAlt = $derived(
		uploadedBaseSrc ? currentBaseAlt : 'Finished holographic Holograph sample on a surface mockup'
	);
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
	const currentMockup = $derived(mockupScenes.find((item) => item.id === selectedMockup) ?? mockupScenes[0]);
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

	function clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
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
		return textTones.find((item) => item.id === tone)?.color ?? '#fbf8f3';
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

		const backdrop = context.createLinearGradient(0, 0, width, height);
		backdrop.addColorStop(0, '#151515');
		backdrop.addColorStop(1, '#070707');
		context.fillStyle = backdrop;
		context.fillRect(0, 0, width, height);

		const card = { x: 90, y: 74, width: width - 180, height: height - 148, radius: 64 };
		context.save();
		context.shadowColor = 'rgba(0, 0, 0, 0.42)';
		context.shadowBlur = 48;
		context.shadowOffsetY = 26;
		context.fillStyle = '#0d0d0d';
		roundedRectPath(context, card.x, card.y, card.width, card.height, card.radius);
		context.fill();
		context.restore();

		context.save();
		roundedRectPath(context, card.x, card.y, card.width, card.height, card.radius);
		context.clip();

		const imageRect = fillRect(image.width, image.height, card.width, card.height);
		context.filter = `brightness(${brightness / 100}) contrast(1.04) saturate(1.02)`;
		context.drawImage(
			image,
			card.x + imageRect.x,
			card.y + imageRect.y,
			imageRect.width,
			imageRect.height
		);
		context.filter = 'none';

		const veil = context.createLinearGradient(card.x, card.y, card.x, card.y + card.height);
		veil.addColorStop(0, 'rgba(255,255,255,0.03)');
		veil.addColorStop(1, 'rgba(0,0,0,0.06)');
		context.fillStyle = veil;
		context.fillRect(card.x, card.y, card.width, card.height);
		context.restore();

		context.save();
		context.strokeStyle = 'rgba(255,255,255,0.18)';
		context.lineWidth = 2;
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

	function drawHolographicEffect(
		context: CanvasRenderingContext2D,
		card: ReturnType<typeof drawBaseCard>,
		canvas: HTMLCanvasElement
	) {
		const washOpacity = 0.26;
		const shimmerStrength = shimmer / 100;

		context.save();
		roundedRectPath(context, card.x, card.y, card.width, card.height, card.radius);
		context.clip();

		context.globalCompositeOperation = 'screen';
		const diagonalGlow = context.createLinearGradient(
			card.x - card.width * 0.12,
			card.y + card.height * 0.08,
			card.x + card.width * 1.08,
			card.y + card.height * 0.92
		);
		diagonalGlow.addColorStop(0, 'rgba(255,255,255,0)');
		diagonalGlow.addColorStop(0.2, `rgba(255, 204, 236, ${0.08 + shimmerStrength * 0.08})`);
		diagonalGlow.addColorStop(0.42, `rgba(178, 226, 255, ${0.12 + shimmerStrength * 0.1})`);
		diagonalGlow.addColorStop(0.56, `rgba(255, 245, 190, ${0.16 + shimmerStrength * 0.12})`);
		diagonalGlow.addColorStop(0.7, `rgba(255,255,255,${0.08 + shimmerStrength * 0.08})`);
		diagonalGlow.addColorStop(1, 'rgba(255,255,255,0)');
		context.fillStyle = diagonalGlow;
		context.fillRect(card.x, card.y, card.width, card.height);

		const sheen = context.createLinearGradient(card.x, card.y, card.x + card.width, card.y + card.height);
		sheen.addColorStop(0, `rgba(255,255,255,${0.08 + washOpacity * 0.16})`);
		sheen.addColorStop(0.24, `rgba(234,211,182,${0.06 + washOpacity * 0.22})`);
		sheen.addColorStop(0.52, `rgba(220,230,246,${0.06 + washOpacity * 0.18})`);
		sheen.addColorStop(0.8, `rgba(255,255,255,${0.03 + washOpacity * 0.12})`);
		sheen.addColorStop(1, 'rgba(255,255,255,0)');
		context.globalCompositeOperation = 'screen';
		context.fillStyle = sheen;
		context.fillRect(card.x, card.y, card.width, card.height);

		const lightCenterX = card.x + card.width * 0.54;
		const lightCenterY = card.y + card.height * 0.3;
		const glow = context.createRadialGradient(
			lightCenterX,
			lightCenterY,
			card.width * 0.04,
			lightCenterX,
			lightCenterY,
			card.width * 0.48
		);
		glow.addColorStop(0, `rgba(255,255,255,${0.14 + shimmer / 700})`);
		glow.addColorStop(0.28, `rgba(238,226,208,${0.08 + shimmer / 1200})`);
		glow.addColorStop(0.62, `rgba(217,228,248,${0.04 + shimmer / 1600})`);
		glow.addColorStop(1, 'rgba(255,255,255,0)');
		context.fillStyle = glow;
		context.fillRect(card.x, card.y, card.width, card.height);

		const edgeGlow = context.createRadialGradient(
			card.x + card.width * 0.76,
			card.y + card.height * 0.26,
			card.width * 0.02,
			card.x + card.width * 0.76,
			card.y + card.height * 0.26,
			card.width * 0.24
		);
		edgeGlow.addColorStop(0, `rgba(255,255,255,${0.16 + shimmerStrength * 0.1})`);
		edgeGlow.addColorStop(0.24, `rgba(255,244,206,${0.11 + shimmerStrength * 0.08})`);
		edgeGlow.addColorStop(0.54, `rgba(193,226,255,${0.08 + shimmerStrength * 0.05})`);
		edgeGlow.addColorStop(1, 'rgba(255,255,255,0)');
		context.fillStyle = edgeGlow;
		context.fillRect(card.x, card.y, card.width, card.height);

		context.globalCompositeOperation = 'overlay';
		const passWidth = card.width * 0.24;
		const passX = lightCenterX - passWidth / 2;
		const pass = context.createLinearGradient(passX, card.y, passX + passWidth, card.y);
		pass.addColorStop(0, 'rgba(255,255,255,0)');
		pass.addColorStop(0.46, `rgba(255,255,255,${0.1 + shimmer / 600})`);
		pass.addColorStop(0.54, `rgba(245,233,215,${0.14 + shimmer / 500})`);
		pass.addColorStop(1, 'rgba(255,255,255,0)');
		context.fillStyle = pass;
		context.fillRect(card.x, card.y, card.width, card.height);

		context.globalCompositeOperation = 'screen';
		context.strokeStyle = `rgba(255,255,255,${0.12 + shimmer / 700})`;
		context.lineWidth = 3;
		context.beginPath();
		context.ellipse(
			lightCenterX,
			lightCenterY,
			card.width * 0.26,
			card.height * 0.18,
			(-12 * Math.PI) / 180,
			0,
			Math.PI * 2
		);
		context.stroke();

		context.globalCompositeOperation = 'source-over';
		const topGloss = context.createLinearGradient(0, card.y, 0, card.y + card.height * 0.55);
		topGloss.addColorStop(0, 'rgba(255,255,255,0.18)');
		topGloss.addColorStop(1, 'rgba(255,255,255,0)');
		context.fillStyle = topGloss;
		context.fillRect(card.x, card.y, card.width, card.height * 0.55);

		context.globalCompositeOperation = 'soft-light';
		const lowerColor = context.createLinearGradient(card.x, card.y, card.x, card.y + card.height);
		lowerColor.addColorStop(0, 'rgba(255,255,255,0)');
		lowerColor.addColorStop(0.56, `rgba(255, 191, 226, ${0.05 + washOpacity * 0.16})`);
		lowerColor.addColorStop(0.78, `rgba(173, 216, 255, ${0.04 + washOpacity * 0.14})`);
		lowerColor.addColorStop(1, `rgba(255, 241, 201, ${0.06 + washOpacity * 0.15})`);
		context.fillStyle = lowerColor;
		context.fillRect(card.x, card.y, card.width, card.height);

		context.restore();

		context.save();
		context.strokeStyle = 'rgba(255,255,255,0.28)';
		context.lineWidth = 2;
		roundedRectPath(context, card.x, card.y, card.width, card.height, card.radius);
		context.stroke();
		context.restore();

		context.save();
		context.globalAlpha = 0.09;
		context.drawImage(canvas, 0, 0);
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
			const message = error instanceof Error ? error.message : 'Cloud save is unavailable right now.';

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
			overlayEnabled = true;
		}
	}
</script>

<section class="section preview-section" id="preview-builder">
	<div class="page-wrap preview-layout">
		{#if isTikTokVisitor}
			<div class="tiktok-banner glass-card">
				<p class="eyebrow">Try it with your own photo</p>
				<h2>Made for the photo you already love.</h2>
				<p>Try it here.</p>
			</div>
		{/if}

		<div class="section-copy">
			<p class="eyebrow">{isTikTokVisitor ? 'Upload first' : 'Start here'}</p>
			<h2>Upload your photo. Make it yours.</h2>
			<p>Choose your favorite details and order when it feels right.</p>
		</div>

		<div class:tikTokFirst={isTikTokVisitor} class="builder-card">
			<div class="quick-order-card glass-card">
				<div class="quick-order-copy">
					<p class="label">Quick order</p>
					<h3>Upload and order.</h3>
					<p class="micro">The fastest way to check out.</p>
				</div>

				<form
					id="homepage-order-form"
					class="quick-order-form"
					method="POST"
					action="/checkout"
					onsubmit={submitCheckoutForm}
				>
					<input type="hidden" name="source" value={isTikTokVisitor ? 'home-tiktok-preview' : 'home-live-preview'} />
					<input type="hidden" name="base_name" value={uploadedBaseName} />
					<input type="hidden" name="overlay_name" value={uploadedOverlayName} />
					<input type="hidden" name="base_blob_url" value={uploadedBaseBlobUrl} />
					<input type="hidden" name="overlay_blob_url" value={uploadedOverlayBlobUrl} />
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
					<input type="hidden" name="overlay_position" value={`${overlayX},${overlayY},${overlayScale},${overlayRotation}`} />
					<input type="hidden" name="text_position" value={`${textX},${textY},${textSize}`} />

					<div class="quick-order-grid">
						<div class="quick-upload">
							<div class="button-row">
								<button type="button" class="soft-button" onclick={() => baseUploadInput?.click()}>
									Upload image
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

						<label class="checkout-pick">
							<span>Rounded edges</span>
							<select bind:value={roundedEdges}>
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
						</label>

						<label class="checkout-pick">
							<span>Frame</span>
							<select bind:value={frameOption}>
								<option value="no">No</option>
								<option value="yes">Yes</option>
							</select>
						</label>

						<label class="checkout-pick">
							<span>Size</span>
							<select bind:value={printSize}>
								{#each sizeOptions as option (option.value)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</label>

						<button class="button-primary quick-order-button" type="submit" disabled={!canOrder || checkoutLoading}>
							{checkoutLoading ? 'Starting Checkout...' : canOrder ? 'Add To Cart' : 'Finish Saving'}
						</button>
					</div>
				</form>

				{#if hasUnsavedDesign}
					<p class="upload-warn">Almost there. Let the save finish first.</p>
				{/if}

				<div class="trust-strip" aria-label="Order details">
					<span>Free shipping</span>
					<span>Made from your photo</span>
					<span>Personal help if needed</span>
				</div>
			</div>

			<div class="builder-grid">
				<div class="preview-panel">
					<div
						class="preview-stage"
						aria-label="Holograph sample preview"
					>
						<div class="preview-card original-shell">
							<canvas bind:this={originalCanvas} class="preview-canvas" aria-label={currentBaseAlt}></canvas>
						</div>
					</div>

					<div class="compare-head">
						<strong>{uploadedBaseSrc ? 'Your uploaded photo.' : 'Sample finish.'}</strong>
						<span>{uploadedBaseSrc ? 'Simple preview for review.' : 'A clean sample of the final feel.'}</span>
					</div>

					<div class="glow-status glass-card">
						<strong>{uploadedBaseSrc ? 'Easy to review.' : 'Made from your photo.'}</strong>
						<span>{uploadedBaseSrc ? 'Your notes and options are saved with checkout.' : 'Your notes and options guide the final piece.'}</span>
					</div>

					<div class="mockup-card glass-card">
						<div class="mockup-copy">
							<p class="label">Ways to use it</p>
							<h3>{currentMockup.title}</h3>
							<p class="micro">{currentMockup.note}</p>
						</div>
						<div class="mockup-tabs" role="tablist" aria-label="Mockup uses">
							{#each mockupScenes as scene (scene.id)}
								<button
									type="button"
									class:active={selectedMockup === scene.id}
									class="mini-chip"
									onclick={() => (selectedMockup = scene.id)}
								>
									{scene.label}
								</button>
							{/each}
						</div>
						<div class={`use-mockup use-${selectedMockup}`}>
							<div class="use-surface">
								<div class="use-frame">
									<img class="use-base" src={currentMockupSrc} alt={currentMockupAlt} />
									{#if currentOverlaySrc && overlayEnabled}
										<img
											class="use-overlay"
											src={currentOverlaySrc}
											alt="Overlay artwork preview"
											style={`left:${overlayX}%; top:${overlayY}%; transform: translate(-50%, -50%) scale(${overlayScale / 100}) rotate(${overlayRotation}deg);`}
										/>
									{/if}
									{#if textOverlay.trim()}
										<div
											class="use-text"
											style={`left:${textX}%; top:${textY}%; color:${getTextColor(textTone)}; font-family:${getTextFont(textStyle)}; font-size:${Math.max(0.9, textSize / 28)}rem;`}
										>
											{textOverlay}
										</div>
									{/if}
								</div>
								<div class="use-badge">{currentMockup.accent}</div>
							</div>
						</div>
					</div>
				</div>

				<div class="controls-panel">
					<div class="control-block optional-block">
						<p class="label">Customizations</p>
						<h3>Optional touches.</h3>
						<p class="micro">Everything below is extra if you want to personalize more.</p>
					</div>

					<div class="control-block">
						<p class="label">Add Text</p>
						<h3>Add a little note.</h3>
						<p class="micro">Name, date, or something sweet.</p>
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
						<div class="style-row">
							{#each textTones as tone (tone.id)}
								<button
									type="button"
									class:active={textTone === tone.id}
									class="mini-chip tone-chip"
									onclick={() => (textTone = tone.id)}
								>
									<span class="tone-dot" style={`background:${tone.color}`}></span>
									{tone.label}
								</button>
							{/each}
						</div>
						<div class="slider-grid">
							<label class="slider-wrap">
								<span>Text size</span>
								<input type="range" min="20" max="46" bind:value={textSize} />
							</label>
							<label class="slider-wrap">
								<span>Text height</span>
								<input type="range" min="56" max="90" bind:value={textY} />
							</label>
							<label class="slider-wrap">
								<span>Text width</span>
								<input type="range" min="14" max="86" bind:value={textX} />
							</label>
						</div>
					</div>

					<div class="control-block">
						<p class="label">Upload Overlay</p>
						<h3>Add handwriting or art.</h3>
						<p class="micro">Simple works best.</p>
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
								{overlayProcessing ? 'Cleaning...' : 'Remove background'}
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
						<p class="label">Order details</p>
						<h3>Choose the basics.</h3>
						<div class="slider-grid">
							<label class="slider-wrap">
								<span>Rounded edges</span>
								<select bind:value={roundedEdges} class="simple-select">
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
							</label>
							<label class="slider-wrap">
								<span>Frame</span>
								<select bind:value={frameOption} class="simple-select">
									<option value="no">No</option>
									<option value="yes">Yes</option>
								</select>
							</label>
							<label class="slider-wrap">
								<span>Size</span>
								<select bind:value={printSize} class="simple-select">
									{#each sizeOptions as option (option.value)}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</label>
							<label class="slider-wrap">
								<span>Personal request</span>
								<textarea
									class="gift-message"
									rows="3"
									bind:value={personalRequest}
									placeholder="Name, date, size note, or short request"
								></textarea>
							</label>
						</div>
					</div>

					<div class="control-block compact gift-block">
						<p class="label">Gift</p>
						<h3>Ready to gift.</h3>
						<p class="micro">Sweet and simple.</p>
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
			<p class="eyebrow">Great for family favorites.</p>
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
		<button class="button-primary" type="submit" form="homepage-order-form" disabled={!canOrder || checkoutLoading}>
			{checkoutLoading ? 'Starting...' : canOrder ? 'Bring It To Life' : 'Saving...'}
		</button>
	</div>

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
	.preview-layout,
	.preview-panel,
	.controls-panel,
	.checkout-card,
	.quick-order-card {
		display: grid;
		gap: 1rem;
	}

	.preview-layout {
		gap: 1.25rem;
	}

	.tiktok-banner {
		display: grid;
		gap: 0.55rem;
		padding: 1.15rem;
	}

	.tiktok-banner h2,
	.section-copy h2,
	.control-block h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		letter-spacing: -0.04em;
		color: #f4f0e8;
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

	.section-copy h2,
	.tiktok-banner h2 {
		font-size: clamp(2rem, 5vw, 3.1rem);
		line-height: 0.98;
	}

	.control-block h3 {
		font-size: 1.08rem;
	}

	.section-copy p:last-child,
	.tiktok-banner p,
	.micro {
		color: rgba(236, 228, 216, 0.68);
	}

	.micro {
		font-size: 0.88rem;
		line-height: 1.45;
	}

	.builder-card {
		padding: 1rem;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01)),
			linear-gradient(160deg, rgba(14, 14, 14, 0.97), rgba(8, 8, 8, 0.98));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 28px 70px rgba(0, 0, 0, 0.28);
	}

	.builder-grid {
		display: grid;
		gap: 1rem;
	}

	.quick-order-card {
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.quick-order-copy {
		display: grid;
		gap: 0.35rem;
	}

	.quick-order-form,
	.quick-order-grid,
	.quick-upload {
		display: grid;
		gap: 0.75rem;
	}

	.trust-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.trust-strip span {
		padding: 0.5rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(245, 239, 231, 0.8);
		font-size: 0.76rem;
		font-weight: 600;
		letter-spacing: 0.03em;
	}

	.quick-order-grid {
		grid-template-columns: minmax(0, 1.4fr) repeat(4, minmax(0, 0.8fr)) auto;
		align-items: end;
	}

	.quick-order-button {
		min-width: 12rem;
		min-height: 3.2rem;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.control-block {
		display: grid;
		gap: 0.72rem;
		padding: 1rem;
		border-radius: 1.35rem;
		background: rgba(255, 255, 255, 0.025);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.optional-block {
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018)),
			rgba(255, 255, 255, 0.02);
	}

	.label,
	.slider-wrap span,
	.checkout-pick span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(237, 226, 213, 0.56);
	}

	.button-row,
	.style-row,
	.bundle-row,
	.mockup-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.slider-grid {
		display: grid;
		gap: 0.7rem;
	}

	.soft-button,
	.mini-chip,
	.file-meta button {
		padding: 0.72rem 0.96rem;
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

	.soft-button:hover,
	.mini-chip:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 26px rgba(234, 211, 182, 0.08);
	}

	.soft-button.ghost {
		background: rgba(255, 255, 255, 0.014);
	}

	.mini-chip.active {
		border-color: rgba(255, 231, 204, 0.34);
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(234, 211, 182, 0.16), rgba(217, 228, 248, 0.08)),
			rgba(255, 255, 255, 0.03);
		color: #fff9f2;
	}

	.tone-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.tone-dot {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.28);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.hidden-input {
		display: none;
	}

	.text-input,
	.gift-message,
	.checkout-pick select,
	.simple-select {
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

	.checkout-pick select option,
	.simple-select option {
		background: #111214;
		color: #f8f4ee;
	}

	.text-input::placeholder,
	.gift-message::placeholder {
		color: rgba(236, 228, 216, 0.42);
	}

	.slider-wrap {
		display: grid;
		gap: 0.45rem;
	}

	input[type='range'] {
		width: 100%;
		accent-color: #ead3b6;
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
		min-height: 31rem;
		border-radius: 1.8rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.1), transparent 30%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
			linear-gradient(160deg, rgba(33, 33, 33, 0.75), rgba(10, 10, 10, 0.94));
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
		padding: 1rem;
	}

	.preview-canvas {
		width: min(24rem, 72%);
		aspect-ratio: 4 / 5;
		height: auto;
		border-radius: 1.9rem;
	}

	.compare-head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		color: rgba(247, 243, 238, 0.82);
		font-size: 0.88rem;
	}

	.compare-head strong {
		font-size: 0.98rem;
	}

	.glow-status,
	.mockup-card {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
	}

	.mockup-copy {
		display: grid;
		gap: 0.35rem;
	}

	.checkout-card,
	.glow-status,
	.mockup-card,
	.quick-order-card {
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 18px 40px rgba(0, 0, 0, 0.16);
	}

	.glow-status strong {
		font-size: 0.98rem;
		color: #f7f3ee;
	}

	.glow-status span {
		font-size: 0.82rem;
		color: rgba(237, 226, 213, 0.66);
	}

	.checkout-card {
		padding: 1rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
			rgba(255, 255, 255, 0.018);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.checkout-form {
		display: grid;
		gap: 0.8rem;
	}

	.bundle-row {
		align-items: end;
		gap: 0.8rem;
	}

	.checkout-pick {
		display: grid;
		flex: 1;
		gap: 0.45rem;
	}

	.order-button {
		min-width: 15rem;
		padding: 1rem 1.35rem;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.checkout-note,
	.upload-note {
		font-size: 0.82rem;
		color: rgba(237, 226, 213, 0.66);
	}

	.upload-warn,
	.upload-error {
		color: #f5d3bf;
	}

	.checkout-error-shell {
		position: fixed;
		inset: 0;
		z-index: 70;
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

	.file-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.75rem 0.85rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		color: rgba(247, 243, 238, 0.8);
		font-size: 0.8rem;
	}

	.gift-message {
		resize: vertical;
		min-height: 5rem;
	}

	.camera-roll-strip {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
	}

	.camera-roll-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.camera-roll-list span {
		padding: 0.55rem 0.8rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: rgba(247, 243, 238, 0.72);
		font-size: 0.8rem;
	}

	.use-mockup {
		min-height: 15rem;
		padding: 1.1rem;
		border-radius: 1.35rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
		position: relative;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(16, 16, 18, 0.94), rgba(8, 8, 10, 0.96));
		box-shadow:
			inset 0 1px 0 rgba(255,255,255,0.05),
			0 22px 44px rgba(0, 0, 0, 0.18);
	}

	.use-mockup::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(180deg, rgba(255,255,255,0.08), transparent 24%, transparent 72%, rgba(0,0,0,0.12)),
			radial-gradient(circle at 24% 18%, rgba(255,255,255,0.14), transparent 20%);
	}

	.use-locker {
		background:
			linear-gradient(180deg, rgba(110, 132, 160, 0.2), rgba(41, 52, 68, 0.45)),
			repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 96px),
			linear-gradient(160deg, #77879a, #495564);
	}

	.use-dishwasher,
	.use-clean-dirty {
		background:
			linear-gradient(180deg, rgba(246, 247, 249, 0.2), rgba(151, 161, 171, 0.3)),
			linear-gradient(160deg, #e5ebf1, #929eaa);
	}

	.use-dorm-fridge {
		background:
			linear-gradient(180deg, rgba(255,255,255,0.12), rgba(181, 190, 198, 0.24)),
			linear-gradient(160deg, #eef2f5, #a3adb6);
	}

	.use-filing-cabinet,
	.use-gym-locker {
		background:
			linear-gradient(180deg, rgba(214, 222, 228, 0.16), rgba(92, 103, 114, 0.38)),
			linear-gradient(160deg, #b8c2cc, #687483);
	}

	.use-toolbox {
		background:
			linear-gradient(180deg, rgba(255, 106, 60, 0.16), rgba(90, 24, 14, 0.42)),
			linear-gradient(160deg, #bf4f33, #5f291d);
	}

	.use-car {
		background:
			linear-gradient(180deg, rgba(245, 246, 249, 0.15), rgba(69, 77, 90, 0.34)),
			linear-gradient(160deg, #d7dce2, #576170);
	}

	.use-locker::after,
	.use-gym-locker::after {
		content: '';
		position: absolute;
		right: 1.2rem;
		top: 50%;
		width: 0.45rem;
		height: 2.5rem;
		border-radius: 999px;
		background: rgba(12, 18, 24, 0.34);
		box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
		transform: translateY(-50%);
	}

	.use-clean-dirty::after {
		content: 'Clean / Dirty';
		position: absolute;
		left: 1rem;
		top: 1rem;
		padding: 0.38rem 0.62rem;
		border-radius: 999px;
		background: rgba(8, 10, 12, 0.74);
		border: 1px solid rgba(255,255,255,0.12);
		color: rgba(248, 244, 238, 0.9);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.use-dishwasher::after,
	.use-dorm-fridge::after,
	.use-filing-cabinet::after,
	.use-car::after {
		content: '';
		position: absolute;
		inset: 0.7rem;
		border-radius: 1rem;
		box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16);
		pointer-events: none;
	}

	.use-surface {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 13rem;
	}

	.use-frame {
		position: relative;
		width: min(12rem, 56vw);
		aspect-ratio: 4 / 5;
		padding: 0.55rem;
		border-radius: 1rem;
		background:
			linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06)),
			radial-gradient(circle at top left, rgba(255, 236, 214, 0.16), transparent 40%);
		box-shadow:
			0 18px 34px rgba(0, 0, 0, 0.22),
			0 0 0 1px rgba(255,255,255,0.08);
		transform: rotate(-3deg) translateY(-0.2rem);
		overflow: hidden;
	}

	.use-base,
	.use-overlay {
		position: absolute;
	}

	.use-base {
		inset: 0.55rem;
		width: calc(100% - 1.1rem);
		height: calc(100% - 1.1rem);
		object-fit: cover;
		border-radius: 0.7rem;
	}

	.use-overlay {
		max-width: 72%;
		max-height: 72%;
		object-fit: contain;
		opacity: 0.92;
	}

	.use-text {
		position: absolute;
		transform: translate(-50%, -50%);
		text-shadow: 0 2px 10px rgba(0,0,0,0.28);
		text-align: center;
		max-width: 70%;
		line-height: 1.1;
	}

	.use-badge {
		position: absolute;
		right: 0.85rem;
		bottom: 0.85rem;
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: rgba(10, 10, 12, 0.7);
		border: 1px solid rgba(255,255,255,0.12);
		color: #f8f4ee;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.mobile-order-bar {
		position: sticky;
		bottom: 0;
		z-index: 12;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px));
		background: rgba(8, 8, 8, 0.9);
		backdrop-filter: blur(18px);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.mobile-order-bar p,
	.mobile-order-bar strong {
		margin: 0;
	}

	.mobile-order-bar p {
		font-size: 0.76rem;
		color: rgba(236, 228, 216, 0.62);
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	.mobile-order-bar strong {
		display: block;
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: 1.2rem;
		color: #f7f3ee;
	}

	.mobile-order-bar :global(.button-primary) {
		flex: 0 0 auto;
		min-width: 12.5rem;
		padding: 0.95rem 1.2rem;
	}

	@media (min-width: 980px) {
		.builder-grid {
			grid-template-columns: minmax(0, 1.08fr) minmax(22rem, 0.92fr);
			align-items: start;
		}
	}

	@media (max-width: 1080px) {
		.quick-order-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.quick-upload,
		.quick-order-button {
			grid-column: 1 / -1;
		}
	}

	@media (min-width: 861px) {
		.mobile-order-bar {
			display: none;
		}
	}

	@media (max-width: 860px) {
		.builder-card {
			padding: 0.8rem;
			border-radius: 1.6rem;
		}

		.controls-panel,
		.preview-panel {
			gap: 0.8rem;
		}

		.control-block,
		.checkout-card,
		.glow-status,
		.mockup-card,
		.quick-order-card {
			padding: 0.85rem;
			border-radius: 1.1rem;
		}

		.preview-stage {
			min-height: 22rem;
			border-radius: 1.4rem;
		}

		.preview-canvas {
			width: min(17rem, 82%);
		}

		.compare-head {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.35rem;
		}

		.bundle-row {
			display: grid;
			grid-template-columns: 1fr;
		}

		.quick-order-grid {
			grid-template-columns: 1fr;
		}

		.mockup-tabs {
			gap: 0.45rem;
		}

		.mockup-tabs .mini-chip,
		.style-row .mini-chip {
			padding: 0.62rem 0.82rem;
			font-size: 0.8rem;
		}

		.use-mockup {
			min-height: 12.5rem;
			padding: 0.8rem;
		}

		.use-surface {
			min-height: 10.5rem;
		}

		.use-frame {
			width: min(9.4rem, 58vw);
			border-radius: 0.9rem;
		}

		.use-badge {
			right: 0.6rem;
			bottom: 0.6rem;
			padding: 0.38rem 0.56rem;
			font-size: 0.64rem;
		}

		.order-button {
			width: 100%;
			min-width: 0;
		}

		.mobile-order-bar {
			gap: 0.75rem;
			padding: 0.72rem 0.85rem calc(0.72rem + env(safe-area-inset-bottom, 0px));
		}

		.mobile-order-bar p {
			font-size: 0.7rem;
			letter-spacing: 0.12em;
		}

		.mobile-order-bar strong {
			font-size: 1.05rem;
		}

		.mobile-order-bar :global(.button-primary) {
			min-width: 10.75rem;
			padding: 0.82rem 0.95rem;
			font-size: 0.92rem;
		}
	}

	@media (max-width: 640px) {
		.section-copy {
			gap: 0.5rem;
		}

		.section-copy h2,
		.tiktok-banner h2 {
			font-size: clamp(1.75rem, 8vw, 2.4rem);
		}

		.control-block h3,
		.mockup-copy h3 {
			font-size: 1rem;
		}

		.preview-stage {
			min-height: 20.5rem;
		}

		.preview-canvas {
			width: min(15.5rem, 84%);
		}

		.drag-tag {
			font-size: 0.62rem;
			padding: 0.28rem 0.48rem;
		}

		.use-frame {
			width: min(8.8rem, 60vw);
			transform: rotate(-2deg) translateY(-0.1rem);
		}
	}
</style>
