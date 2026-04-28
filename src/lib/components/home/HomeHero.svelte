<script lang="ts">
	import { onMount } from 'svelte';

	let { isTikTokVisitor = false } = $props();

	let heroVideo: HTMLVideoElement | null = null;

	onMount(() => {
		if (!heroVideo) return;
		heroVideo.playbackRate = 0.72;
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
			poster="/holographe/jessholo.png"
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
					{#if isTikTokVisitor}
						<p class="eyebrow">Made for your camera roll</p>
					{:else}
						<img class="hero-logo" src="/holographe/brand-logo.png" alt="Holographe logo" />
					{/if}
					<h1>Your photo, glowing back at you.</h1>
					<p class="subcopy">
						{isTikTokVisitor
							? 'Upload it. Add a little love. We handle the rest.'
							: 'A sweet little keepsake for the people you love most.'}
					</p>

					<div class="microcopy" aria-label="Product details">
						<span>Real shimmer</span>
						<span>Gift-ready</span>
						<span>Made from your photo</span>
					</div>

					<div class="actions">
						<a class="button-primary" href="#preview-builder">
							{isTikTokVisitor ? 'Try Your Photo' : 'Make The Magic'}
						</a>
						<a class="button-secondary" href="#how-it-works">
							{isTikTokVisitor ? 'See the flow' : 'See How It Works'}
						</a>
					</div>
				</div>

				<div class="hero-note">
					<span class="hero-note-line"></span>
					<p>Simple, personal, and easy to give.</p>
				</div>

				<div class="hero-contact glass-contact">
					<p>Feel free to reach out for any feedback.</p>
					<a href="#contact-modal">Contact Christina at 347-996-0205</a>
				</div>
			</div>
		</div>
	</div>

	<div class="hero-bottom-fade" aria-hidden="true"></div>

	<a class="scroll-cue" href="#preview-builder">
		<span>Preview your photo</span>
	</a>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: grid;
		align-items: end;
		padding: 7rem 0 4.5rem;
		overflow: clip;
	}

	.hero.tiktok-hero {
		min-height: 78svh;
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
		transform: scale(0.96);
		filter: saturate(0.92) contrast(1.02) brightness(0.86) blur(0.35px);
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(7, 7, 7, 0.14), rgba(7, 7, 7, 0.2) 24%, rgba(7, 7, 7, 0.3) 56%, rgba(7, 7, 7, 0.58)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.12) 24%, rgba(0, 0, 0, 0.1) 72%, rgba(0, 0, 0, 0.3)),
			radial-gradient(circle at 58% 20%, rgba(255, 236, 214, 0.12), transparent 28%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 22% 18%, rgba(234, 211, 182, 0.1), transparent 22%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.08), transparent 20%),
			linear-gradient(120deg, rgba(255, 255, 255, 0.04), transparent 28%, rgba(255, 239, 212, 0.05) 44%, transparent 62%);
	}

	.hero-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at center, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.18) 72%, rgba(0, 0, 0, 0.34));
		pointer-events: none;
	}

	.hero-shell {
		position: relative;
		z-index: 1;
	}

	.hero-stage {
		display: grid;
		align-items: end;
		gap: 1rem;
	}

	.hero-copy-wrap {
		display: grid;
		gap: 0.95rem;
		max-width: 36rem;
	}

	.hero-copy {
		display: grid;
		gap: 1rem;
		max-width: 35rem;
		padding: 1.2rem;
		border-radius: 1.8rem;
		background:
			linear-gradient(180deg, rgba(8, 8, 8, 0.34), rgba(8, 8, 8, 0.12)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.1), transparent 34%);
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
		font-size: clamp(2.7rem, 6vw, 5rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
		text-wrap: balance;
		color: #f7f3ee;
	}

	.subcopy {
		max-width: 27rem;
		font-size: 0.98rem;
		line-height: 1.5;
		color: rgba(247, 243, 238, 0.8);
	}

	.hero-logo {
		display: block;
		width: clamp(12rem, 28vw, 18rem);
		height: auto;
		margin-bottom: 0.1rem;
		filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.28));
	}

	.microcopy,
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.microcopy span {
		padding: 0.5rem 0.78rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(16px);
		font-size: 0.76rem;
		color: rgba(244, 240, 234, 0.8);
	}

	.hero-note {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		max-width: 26rem;
		color: rgba(247, 243, 238, 0.72);
		font-size: 0.82rem;
		line-height: 1.55;
	}

	.hero-note p {
		max-width: 22rem;
	}

	.hero-contact {
		display: grid;
		gap: 0.35rem;
		max-width: 28rem;
		padding: 0.9rem 1rem;
		border-radius: 1.1rem;
		background:
			linear-gradient(180deg, rgba(8, 8, 8, 0.28), rgba(8, 8, 8, 0.12)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.08), transparent 42%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
	}

	.hero-contact p,
	.hero-contact a {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.5;
	}

	.hero-contact p {
		color: rgba(247, 243, 238, 0.72);
	}

	.hero-contact a {
		color: #f7efe2;
		text-decoration: none;
		font-weight: 600;
	}

	.hero-contact a:hover {
		color: #fff7eb;
	}

	.hero-note-line {
		width: 2.5rem;
		height: 1px;
		margin-top: 0.75rem;
		background: linear-gradient(90deg, rgba(234, 211, 182, 0.9), rgba(234, 211, 182, 0));
		flex: 0 0 auto;
	}

	.hero-bottom-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 10rem;
		background: linear-gradient(180deg, rgba(6, 6, 6, 0), rgba(6, 6, 6, 0.82));
		pointer-events: none;
	}

	.scroll-cue {
		position: absolute;
		left: 50%;
		bottom: 1.4rem;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		transform: translateX(-50%);
		padding: 0.5rem 0.75rem;
		border-radius: 999px;
		background: rgba(12, 12, 12, 0.42);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.78);
	}

	.scroll-cue::after {
		content: '';
		width: 0.42rem;
		height: 0.42rem;
		border-right: 1px solid currentColor;
		border-bottom: 1px solid currentColor;
		transform: rotate(45deg) translateY(-1px);
	}

	@media (max-width: 640px) {
		.hero {
			min-height: 92svh;
			padding: 5.8rem 0 3rem;
		}

		.hero.tiktok-hero {
			min-height: auto;
			padding-top: 0;
		}

		h1 {
			font-size: clamp(2.35rem, 11vw, 3.5rem);
		}

		.subcopy {
			max-width: 18rem;
			font-size: 0.93rem;
		}

		.actions {
			display: grid;
			grid-template-columns: 1fr;
		}

		.hero-copy {
			padding: 1rem;
		}

		.hero-note {
			font-size: 0.78rem;
		}

		.scroll-cue {
			bottom: 1rem;
		}
	}

	@media (max-width: 919px) {
		.hero-video-fill {
			transform: scale(1.02);
			filter: saturate(0.96) contrast(1.03) brightness(0.78);
		}
	}
</style>
