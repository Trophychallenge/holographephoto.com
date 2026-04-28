<script lang="ts">
	import { onMount } from 'svelte';

	let { isTikTokVisitor = false } = $props();

	let heroVideo: HTMLVideoElement | null = null;
	let compareVideo: HTMLVideoElement | null = null;
	let compareSplit = $state(44);

	onMount(() => {
		if (heroVideo) heroVideo.playbackRate = 0.72;
		if (compareVideo) compareVideo.playbackRate = 0.82;
	});
</script>

<section class:tiktok-hero={isTikTokVisitor} class="hero section">
	<div class="hero-media" aria-hidden="true">
		<video
			bind:this={heroVideo}
			class="hero-video hero-video-fill"
			autoplay
			muted
			loop
			playsinline
			preload="auto"
			poster="/holographe/jess-holo-hero.png"
		>
			<source src="/holographe/3picsdishwasher.mp4" type="video/mp4" />
		</video>
		<div class="hero-overlay"></div>
		<div class="hero-glow"></div>
	</div>

	<div class="page-wrap hero-shell">
		<div class="hero-stage">
			<div class="hero-copy-wrap">
				<div class="hero-copy">
					{#if !isTikTokVisitor}
						<img class="hero-logo" src="/holographe/brand-logo.png" alt="Holograph logo" />
					{/if}
					<h1>Turn a moment into something you can feel.</h1>
					<p class="subcopy">{isTikTokVisitor ? 'Slide. Upload. Order.' : 'Slide to see the finish.'}</p>

					<div class="actions">
						<a class="button-primary" href="#preview-builder">
							{isTikTokVisitor ? 'Try Your Photo' : 'Make The Magic'}
						</a>
						<a class="button-secondary" href="/prices">See Prices</a>
					</div>
				</div>

				<div class="hero-note">
					<span class="hero-note-line"></span>
					<p>Original left. Holograph right.</p>
				</div>
			</div>

			<div class="hero-compare glass-card">
				<div class="compare-topline">
					<span>Original</span>
					<span>Holograph</span>
				</div>

				<div class="compare-stage" aria-label="Before and after Holograph comparison">
					<picture class="compare-image-shell compare-before-shell">
						<source srcset="/holographe/jess-before-hero.webp" type="image/webp" />
						<img
							class="compare-image compare-before"
							src="/holographe/jess-before-hero.jpg"
							alt="Original"
							fetchpriority="high"
						/>
					</picture>
					<div class="compare-after" style={`clip-path: inset(0 0 0 ${compareSplit}%);`}>
						<video
							bind:this={compareVideo}
							class="compare-image compare-finished compare-video"
							autoplay
							muted
							loop
							playsinline
							preload="auto"
							poster="/holographe/jess-holo-hero.png"
						>
							<source src="/holographe/jessholo.mov" type="video/quicktime" />
						</video>
						<div class="compare-shimmer"></div>
					</div>
					<div class="compare-line" style={`left:${compareSplit}%`}>
						<span class="compare-thumb"></span>
					</div>
				</div>

				<label class="compare-slider">
					<span class="sr-only">Reveal finished Holograph image</span>
					<input type="range" min="8" max="92" bind:value={compareSplit} />
				</label>
			</div>
		</div>
	</div>

	<div class="hero-bottom-fade" aria-hidden="true"></div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: grid;
		align-items: center;
		padding: 6.6rem 0 3.6rem;
		overflow: clip;
	}

	.hero.tiktok-hero {
		min-height: 90svh;
		padding-top: 1rem;
	}

	.hero-media,
	.hero-overlay,
	.hero-glow {
		position: absolute;
		inset: 0;
	}

	.hero-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hero-video-fill {
		object-fit: cover;
		object-position: center 46%;
		transform: scale(0.97);
		filter: saturate(0.88) contrast(1.02) brightness(0.74) blur(0.4px);
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(7, 7, 7, 0.2), rgba(7, 7, 7, 0.24) 24%, rgba(7, 7, 7, 0.36) 56%, rgba(7, 7, 7, 0.62)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.16) 24%, rgba(0, 0, 0, 0.08) 72%, rgba(0, 0, 0, 0.34)),
			radial-gradient(circle at 60% 22%, rgba(255, 236, 214, 0.12), transparent 28%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 24% 18%, rgba(234, 211, 182, 0.08), transparent 22%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.08), transparent 20%),
			linear-gradient(120deg, rgba(255, 255, 255, 0.03), transparent 28%, rgba(255, 239, 212, 0.04) 44%, transparent 62%);
	}

	.hero-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at center, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.22) 72%, rgba(0, 0, 0, 0.38));
		pointer-events: none;
	}

	.hero-shell {
		position: relative;
		z-index: 1;
	}

	.hero-stage {
		display: grid;
		gap: 1.1rem;
		align-items: center;
	}

	.hero-copy-wrap,
	.hero-copy,
	.hero-compare {
		display: grid;
		gap: 0.95rem;
	}

	.hero-copy {
		max-width: 33rem;
		padding: 1.1rem;
		border-radius: 1.8rem;
		background:
			linear-gradient(180deg, rgba(8, 8, 8, 0.32), rgba(8, 8, 8, 0.1)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.08), transparent 34%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		box-shadow: 0 28px 70px rgba(0, 0, 0, 0.18);
	}

	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2.5rem, 5.8vw, 4.7rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
		text-wrap: balance;
		color: #f7f3ee;
	}

	.subcopy {
		max-width: 24rem;
		font-size: 0.94rem;
		line-height: 1.45;
		color: rgba(247, 243, 238, 0.8);
	}

	.hero-logo {
		display: block;
		width: clamp(12rem, 28vw, 18rem);
		height: auto;
		margin-bottom: 0.1rem;
		filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.28));
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.hero-note {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		max-width: 25rem;
		color: rgba(247, 243, 238, 0.72);
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.hero-note-line {
		width: 2.5rem;
		height: 1px;
		margin-top: 0.7rem;
		background: linear-gradient(90deg, rgba(234, 211, 182, 0.9), rgba(234, 211, 182, 0));
		flex: 0 0 auto;
	}

	.hero-compare {
		padding: 0.9rem;
		width: min(100%, 25rem);
		border-radius: 1.6rem;
		background:
			linear-gradient(180deg, rgba(12, 12, 14, 0.82), rgba(7, 7, 9, 0.88)),
			radial-gradient(circle at top, rgba(255, 255, 255, 0.06), transparent 40%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(16px);
		box-shadow:
			0 28px 80px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.compare-topline {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0.15rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(244, 240, 234, 0.7);
	}

	.compare-stage {
		position: relative;
		aspect-ratio: 4 / 5;
		border-radius: 1.35rem;
		overflow: hidden;
		background:
			linear-gradient(180deg, rgba(10, 10, 12, 0.92), rgba(7, 7, 9, 0.96));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 24px 56px rgba(0, 0, 0, 0.3);
	}

	.compare-image-shell,
	.compare-image,
	.compare-after {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.compare-image-shell {
		display: block;
	}

	.compare-image {
		display: block;
		object-fit: cover;
		object-position: center;
	}

	.compare-video {
		object-position: center 48%;
		filter: contrast(1.08) brightness(1.05) saturate(1.06);
	}

	.compare-before {
		filter: contrast(1.04) brightness(1.02);
	}

	.compare-finished {
		filter: contrast(1.08) brightness(1.05) saturate(1.06);
	}

	.compare-after {
		pointer-events: none;
	}

	.compare-after::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.08), transparent 26%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 34%, rgba(0, 0, 0, 0.1));
		pointer-events: none;
	}

	.compare-shimmer {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(112deg, transparent 28%, rgba(255, 255, 255, 0.08) 42%, rgba(255, 233, 204, 0.14) 50%, rgba(201, 228, 255, 0.12) 56%, transparent 70%);
		mix-blend-mode: screen;
		opacity: 0.72;
		transform: translateX(-38%);
		animation: heroShimmer 4.8s ease-in-out infinite;
		pointer-events: none;
	}

	.compare-stage:hover .compare-shimmer {
		animation-duration: 3.6s;
	}

	.compare-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.12);
		transform: translateX(-50%);
	}

	.compare-thumb {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 999px;
		background:
			linear-gradient(135deg, rgba(247, 243, 238, 0.98), rgba(235, 214, 186, 0.98), rgba(220, 230, 246, 0.94));
		box-shadow:
			0 14px 28px rgba(0, 0, 0, 0.28),
			0 0 0 1px rgba(255, 255, 255, 0.08);
		transform: translate(-50%, -50%);
	}

	.compare-thumb::before,
	.compare-thumb::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 0.5rem;
		height: 0.5rem;
		border-top: 1px solid #111;
		border-right: 1px solid #111;
	}

	.compare-thumb::before {
		left: 0.78rem;
		transform: translateY(-50%) rotate(-135deg);
	}

	.compare-thumb::after {
		right: 0.78rem;
		transform: translateY(-50%) rotate(45deg);
	}

	.compare-slider {
		display: grid;
	}

	.compare-slider input {
		width: 100%;
		margin: 0;
		accent-color: #ead3b6;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.hero-bottom-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 9rem;
		background: linear-gradient(180deg, rgba(6, 6, 6, 0), rgba(6, 6, 6, 0.82));
		pointer-events: none;
	}

	@keyframes heroShimmer {
		0%, 100% {
			transform: translateX(-42%);
			opacity: 0.42;
		}

		45% {
			transform: translateX(2%);
			opacity: 0.78;
		}

		70% {
			transform: translateX(10%);
			opacity: 0.58;
		}
	}

	@media (min-width: 980px) {
		.hero-stage {
			grid-template-columns: minmax(320px, 25rem) minmax(0, 1fr);
			gap: 1.3rem;
		}

		.hero-compare {
			order: 1;
			justify-self: start;
		}

		.hero-copy-wrap {
			order: 2;
		}
	}

	@media (max-width: 640px) {
		.hero {
			min-height: auto;
			padding: 5.6rem 0 2.6rem;
		}

		h1 {
			font-size: clamp(2.2rem, 10vw, 3.4rem);
		}

		.subcopy {
			font-size: 0.9rem;
		}

		.hero-copy {
			padding: 0.95rem;
			border-radius: 1.35rem;
		}

		.hero-compare {
			padding: 0.75rem;
			border-radius: 1.25rem;
		}

		.compare-stage {
			border-radius: 1rem;
		}

		.compare-thumb {
			width: 2.35rem;
			height: 2.35rem;
		}
	}
</style>
