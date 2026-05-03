<script lang="ts">
	import { onMount } from 'svelte';

	let { isTikTokVisitor = false } = $props();

	let heroVideo: HTMLVideoElement | null = null;

	onMount(() => {
		if (heroVideo) heroVideo.playbackRate = 0.72;
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
		<div class="hero-copy">
			{#if !isTikTokVisitor}
				<img class="hero-logo" src="/holographe/brand-logo.png" alt="Holograph logo" />
			{/if}
			<h1>Turn a moment into something you can feel.</h1>
			<p class="subcopy">{isTikTokVisitor ? 'Upload. Order. Keep it close.' : 'Simple to order. Made with care.'}</p>

			<div class="actions">
				<a class="button-primary" href="#preview-builder">
					{isTikTokVisitor ? 'Upload Your Photo' : 'Start Your Order'}
				</a>
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
			linear-gradient(180deg, rgba(7, 7, 7, 0.18), rgba(7, 7, 7, 0.24) 24%, rgba(7, 7, 7, 0.38) 56%, rgba(7, 7, 7, 0.66)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.14) 30%, rgba(0, 0, 0, 0.1) 70%, rgba(0, 0, 0, 0.34)),
			radial-gradient(circle at 60% 22%, rgba(255, 236, 214, 0.11), transparent 28%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 24% 18%, rgba(234, 211, 182, 0.08), transparent 22%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.07), transparent 20%),
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

	.hero-copy {
		display: grid;
		gap: 0.95rem;
		max-width: 33rem;
		padding: 1.15rem;
		border-radius: 1.8rem;
		background:
			linear-gradient(180deg, rgba(8, 8, 8, 0.3), rgba(8, 8, 8, 0.08)),
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
		max-width: 23rem;
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

	.hero-bottom-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 9rem;
		background: linear-gradient(180deg, rgba(6, 6, 6, 0), rgba(6, 6, 6, 0.82));
		pointer-events: none;
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
	}
</style>
