<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { upload } from '@vercel/blob/client';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
	type Artwork = { pathname: string; filename: string; contentType: string; size: number };
	let artwork = $state<Artwork | null>(null);
	let pendingArtwork = $state<File | null>(null);
	let artworkError = $state('');
	let uploadState = $state<'idle' | 'uploading' | 'saved' | 'failed'>('idle');
	let uploadProgress = $state(0);
	let draftId = $state('');
	let idempotencyKey = $state('');
	let uploadVersion = 0;
	let abortUpload: AbortController | null = null;
	let submitting = $state(false);
	let submitError = $state('');
	let name = $state('');
	let email = $state('');
	let businessName = $state('');
	let quantity = $state('50');
	let websiteOrQr = $state('');
	let neededBy = $state('');
	let designNotes = $state('');
	let businessFilm: HTMLVideoElement;

	const acceptedTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
	const maxArtworkBytes = 4_500_000;

	onMount(() => {
		draftId = form?.values?.draftId || crypto.randomUUID();
		idempotencyKey = form?.values?.idempotencyKey || crypto.randomUUID();
		name = form?.values?.name || '';
		email = form?.values?.email || '';
		businessName = form?.values?.businessName || '';
		quantity = form?.values?.quantity || '50';
		websiteOrQr = form?.values?.websiteOrQr || '';
		neededBy = form?.values?.neededBy || '';
		designNotes = form?.values?.designNotes || '';
	});

	function artworkPath(file: File) {
		const safeName = (file.name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+/, '') || 'artwork');
		return `quotes/artwork/${draftId}/${safeName}`;
	}

	async function uploadArtwork(file: File) {
		const version = ++uploadVersion;
		abortUpload?.abort();
		pendingArtwork = file;
		artworkError = '';
		uploadProgress = 0;
		if (!acceptedTypes.has(file.type) || !/\.(jpe?g|png|pdf)$/i.test(file.name) || file.size === 0 || file.size > maxArtworkBytes) {
			uploadState = 'failed';
			artworkError = 'Choose a JPG, PNG, or PDF no larger than 4.5 MB.';
			return;
		}
		draftId ||= crypto.randomUUID();
		uploadState = 'uploading';
		const controller = new AbortController();
		abortUpload = controller;
		try {
			const blob = await upload(artworkPath(file), file, {
				access: 'private',
				handleUploadUrl: '/api/quote-artwork',
				clientPayload: JSON.stringify({ draftId }),
				contentType: file.type,
				abortSignal: controller.signal,
				onUploadProgress: ({ percentage }) => {
					if (version === uploadVersion) uploadProgress = Math.round(percentage);
				}
			});
			if (version !== uploadVersion) return;
			artwork = { pathname: blob.pathname, filename: file.name, contentType: blob.contentType, size: file.size };
			uploadState = 'saved';
		} catch (error) {
			if (version !== uploadVersion || controller.signal.aborted) return;
			uploadState = 'failed';
			artworkError = error instanceof Error ? error.message : 'Artwork could not be saved.';
		} finally {
			if (version === uploadVersion) abortUpload = null;
		}
	}

	function removeArtwork() {
		uploadVersion += 1;
		abortUpload?.abort();
		abortUpload = null;
		pendingArtwork = null;
		artwork = null;
		uploadState = 'idle';
		uploadProgress = 0;
		artworkError = '';
	}
</script>

<svelte:head>
	<title>Holographic Business Card Magnets | Holographe</title>
	<meta
		name="description"
		content="Custom holographic business card magnets for brands, events, and businesses. See a real Howdy Social order and request a tailored bulk quote."
	/>
</svelte:head>

<div class="business-page">
	<section class="brand-hero">
		<div class="hero-copy">
			<p class="eyebrow">Holographe for business</p>
			<h1>Make the first<br />impression <em>last.</em></h1>
			<p class="lead">Your logo. Your story. A little magnetic attraction.</p>
			<p>Turn your business card into a holographic magnet that deserves to stay on display.</p>
			<a class="button-primary" href="#request-quote"
				>Request your custom quote <span aria-hidden="true">↗</span></a
			>
			<div class="hero-details">
				<span>Custom design</span><span>Bulk orders</span><span>Your brand, in the light</span>
			</div>
		</div>
		<figure class="hero-media">
			<div class="video-frame">
				<video
					bind:this={businessFilm}
					src="/media/business/howdy-social.mp4"
					poster="/media/business/howdy-social.jpg"
					controls
					muted
					playsinline
					preload="metadata"
					aria-label="Real holographic business card magnets made for Howdy Social"
				></video>
				<button class="film-play" type="button" onclick={() => businessFilm?.play()} aria-label="Play the Howdy Social product film">Play film <span aria-hidden="true">▶</span></button>
			</div>
			<figcaption><span>THE FINISHED PRODUCT</span> Made for Howdy Social</figcaption>
		</figure>
	</section>

	<section class="why-section" aria-labelledby="why-title">
		<div>
			<p class="eyebrow">Beyond the handoff</p>
			<h2 id="why-title">Give them something<br />worth holding onto.</h2>
		</div>
		<div class="benefits">
			<article>
				<span>01 / THE LOOK</span>
				<h3>Light-catching by design.</h3>
				<p>
					Holographic shimmer adds dimension to your branding. Dark contrasts and bright accents
					make the finish shine.
				</p>
			</article>
			<article>
				<span>02 / THE DETAILS</span>
				<h3>Built around your business.</h3>
				<p>
					Start with an existing card or a logo. Include your contact details, website, or a QR code
					to help people find you.
				</p>
			</article>
			<article>
				<span>03 / THE OCCASION</span>
				<h3>Ready for your next hello.</h3>
				<p>For local businesses, photographers, creators, client gifts, and event handouts.</p>
			</article>
		</div>
	</section>

	<section class="quote-section" id="request-quote" aria-labelledby="quote-title">
		<div class="quote-copy">
			<p class="eyebrow">Let's make yours</p>
			<h2 id="quote-title">Tell me about<br />your brand.</h2>
			<p>
				Every run is quoted for its quantity, design, and finish. Share what you have in mind and
				I'll help shape the details.
			</p>
			<ol>
				<li>Share your logo or current card.</li>
				<li>Review your quote and design details.</li>
				<li>Confirm your order before production.</li>
			</ol>
			<p class="small">
				Prefer to talk? <a href="tel:+15122563720">512-256-3720</a><br /><a
					href="mailto:admin@holographephoto.com">admin@holographephoto.com</a
				>
			</p>
		</div>
		<form class="quote-form" method="POST" use:enhance={() => {
			submitting = true;
			submitError = '';
			return async ({ update }) => {
				try {
					await update();
				} catch {
					submitError = 'We could not reach the server. Your details are still here; reconnect and try again.';
				} finally {
					submitting = false;
				}
			};
		}}>
			<label>Your name<input name="name" autocomplete="name" required maxlength="100" bind:value={name} /></label>
			<label>Email<input name="email" type="email" autocomplete="email" required maxlength="254" bind:value={email} /></label>
			<label>Business name<input name="businessName" autocomplete="organization" required maxlength="100" bind:value={businessName} /></label>
			<label>How many magnets?<select name="quantity" required
					bind:value={quantity}><option>50</option><option>100</option><option>250</option><option>500</option><option>700</option
					><option>1,000+</option><option>Help me decide</option></select
				></label
			>
			<label>Website or QR destination (optional)<input name="websiteOrQr" type="url" maxlength="500" placeholder="https://example.com" bind:value={websiteOrQr} /></label>
			<label>Needed by (optional)<input name="neededBy" type="date" bind:value={neededBy} /></label>
			<label>Design notes<textarea name="designNotes"
					rows="4"
					maxlength="1500"
					placeholder="Share design ideas, your QR destination, and any details that matter."
				bind:value={designNotes}></textarea></label
			>
			<input type="hidden" name="artworkPathname" value={artwork?.pathname ?? ''} />
			<input type="hidden" name="draftId" value={draftId} />
			<input type="hidden" name="idempotencyKey" value={idempotencyKey} />
			<div class="artwork-upload">
				<label>Artwork (optional)<input type="file" accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf" onchange={(event) => { const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (file) uploadArtwork(file); }} /></label>
				<p class="small">JPG, PNG, or PDF · up to 4.5 MB · stored privately for this request.</p>
				{#if uploadState === 'uploading'}<p role="status">Uploading artwork… {uploadProgress}% <button type="button" onclick={removeArtwork}>Cancel</button></p>{/if}
				{#if artwork}<p role="status"><strong>{artwork.filename}</strong> attached. <button type="button" onclick={removeArtwork}>Remove</button></p>{/if}
				{#if uploadState === 'failed'}<p class="upload-error" role="alert">{artworkError} {#if pendingArtwork}<button type="button" onclick={() => uploadArtwork(pendingArtwork!)}>Retry upload</button>{/if}</p>{/if}
			</div>
			<button type="submit" class="button-primary" disabled={uploadState === 'uploading' || submitting}>{submitting ? 'Sending request…' : 'Send quote request'}</button>
			<p class="small">
				We’ll save your request before confirming it. For immediate help, call <a href="tel:+15122563720">512-256-3720</a> or email <a href="mailto:admin@holographephoto.com">admin@holographephoto.com</a>.
			</p>
			{#if form?.error}<p class="upload-error" role="alert">{form.error}</p>{/if}
			{#if submitError}<p class="upload-error" role="alert">{submitError}</p>{/if}
			{#if form?.success}<div class="quote-ready" role="status"><p><strong>Request received.</strong> Your reference is <strong>{form.requestId}</strong>.</p><p class="small">We’ll use the details you shared to prepare your quote.</p></div>{/if}
		</form>
	</section>
</div>

<style>
	.business-page {
		width: min(1160px, calc(100% - 2rem));
		margin: 0 auto;
		padding: 2rem 0 4rem;
	}
	.brand-hero {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: clamp(2rem, 7vw, 6rem);
		align-items: center;
		padding: clamp(1.5rem, 4vw, 3.5rem);
		border: 1px solid rgba(220, 197, 255, 0.23);
		border-radius: 2rem;
		background:
			radial-gradient(circle at 87% 14%, rgba(130, 235, 255, 0.18), transparent 27%),
			radial-gradient(circle at 13% 83%, rgba(255, 172, 214, 0.2), transparent 30%),
			linear-gradient(135deg, #311342, #101a3a 72%);
		box-shadow: 0 30px 80px rgba(5, 1, 20, 0.32);
	}

	.brand-hero h1,
	.brand-hero .lead {
		color: #fff7fb;
	}

	.brand-hero .hero-copy > p,
	.brand-hero .hero-details {
		color: #e5d1e8;
	}
	h1,
	h2,
	h3 {
		font-family: Georgia, serif;
		font-weight: 500;
	}
	h1 {
		font-size: clamp(3rem, 6.3vw, 5.5rem);
		line-height: 1.02;
		letter-spacing: -0.045em;
		margin: 1.5rem 0;
	}
	h1 em {
		color: #dcc5f2;
		font-weight: 400;
	}
	h2 {
		font-size: clamp(2.2rem, 4vw, 3.6rem);
		letter-spacing: -0.04em;
		line-height: 1.1;
		margin: 1rem 0;
	}
	h3 {
		font-size: 1.6rem;
		line-height: 1.2;
		margin: 0.7rem 0;
	}
	p {
		color: var(--muted);
		line-height: 1.75;
	}
	.lead {
		font-size: 1.15rem;
		color: var(--text);
	}
	.hero-copy > p {
		max-width: 30rem;
	}
	.hero-copy > a {
		margin-top: 1rem;
		gap: 1.5rem;
	}
	.hero-details {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin-top: 2rem;
		color: var(--muted);
		font-size: 0.78rem;
	}
	.hero-media {
		margin: 0;
		background: linear-gradient(135deg, #fff0d5, #e5c5f5 45%, #b8eaff);
		border: 1px solid rgba(255, 255, 255, 0.46);
		border-radius: 1.3rem;
		padding: 0.7rem;
	}
	video {
		display: block;
		width: 100%;
		aspect-ratio: 9/16;
		max-height: 36rem;
		object-fit: contain;
		border-radius: 0.7rem;
		background: #080808;
	}
	.video-frame { position: relative; }
	.film-play { position:absolute; left:1rem; bottom:1rem; border:1px solid rgba(255,255,255,.6); border-radius:999px; padding:.65rem .85rem; background:rgba(18,8,30,.82); color:white; font:inherit; font-weight:700; box-shadow:0 8px 24px rgba(0,0,0,.35); }
	.film-play:hover, .film-play:focus-visible { background:#fff3e2; color:#2b1433; }
	figcaption {
		display: grid;
		gap: 0.3rem;
		padding: 1rem 0.5rem;
		font-size: 0.85rem;
	}
	figcaption span,
	article > span {
		font-size: 0.65rem;
		letter-spacing: 0.16em;
		color: #c8b4dd;
	}
	.why-section {
		margin-top: 1.25rem;
		padding: clamp(2rem, 5vw, 4rem);
		border: 1px solid rgba(218, 199, 255, 0.16);
		border-radius: 1.75rem;
		background: linear-gradient(140deg, rgba(45, 18, 64, 0.86), rgba(15, 29, 56, 0.88));
	}
	.benefits {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-top: 2rem;
	}
	.quote-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2rem, 6vw, 5rem);
		margin-top: 1.25rem;
		padding: clamp(1.5rem, 5vw, 4rem);
		border-radius: 1.75rem;
		background:
			radial-gradient(circle at 88% 16%, rgba(255, 174, 215, 0.34), transparent 28%),
			linear-gradient(135deg, #fff5e7, #f6e5f5 52%, #d9f6ff);
		color: #2a1835;
		scroll-margin-top: 2rem;
	}
	.quote-section h2,
	.quote-section p,
	.quote-section li,
	.quote-section label {
		color: #392442;
	}
	.quote-section .eyebrow {
		color: #59225d;
		border-color: rgba(103, 43, 106, 0.22);
		background: rgba(255, 255, 255, 0.46);
	}
	.quote-copy p {
		max-width: 29rem;
	}
	ol {
		padding-left: 1.2rem;
		color: var(--muted);
		line-height: 2;
	}
	.quote-form {
		display: grid;
		gap: 1.2rem;
		padding: clamp(1.2rem, 3vw, 2rem);
		background: #121115;
		border: 1px solid var(--line);
		border-radius: 1rem;
	}
	label {
		display: grid;
		gap: 0.5rem;
		font-size: 0.88rem;
	}
	input,
	select,
	textarea {
		width: 100%;
		background: #09090b;
		border: 1px solid #49424f;
		border-radius: 0.6rem;
		padding: 0.8rem;
		color: var(--text);
	}
	textarea {
		resize: vertical;
	}
	.small {
		font-size: 0.8rem;
		margin: 0;
		overflow-wrap: anywhere;
	}
	.small a {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.quote-ready {
		display: grid;
		gap: 0.7rem;
		border-top: 1px solid var(--line);
		padding-top: 1rem;
	}
	.quote-ready p {
		margin: 0;
	}
	@media (max-width: 760px) {
		.brand-hero,
		.quote-section {
			grid-template-columns: 1fr;
		}
		.business-page {
			padding-top: 1rem;
		}
		.benefits {
			grid-template-columns: 1fr;
			gap: 1.4rem;
		}
		video {
			max-height: 28rem;
		}
		.hero-media {
			width: min(100%, 28rem);
			justify-self: center;
		}
	}
</style>
