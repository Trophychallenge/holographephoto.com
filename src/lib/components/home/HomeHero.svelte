<script lang="ts">
	import { onMount } from 'svelte';
	import { orderStudioOpen } from '$lib/stores/order-studio';

	let { isTikTokVisitor = false } = $props();
	let heroVideo: HTMLVideoElement | null = null;

	onMount(() => {
		if (heroVideo) heroVideo.playbackRate = 0.4;
	});
</script>

<section class:tiktok-hero={isTikTokVisitor} class="hero section">
	<div class="page-wrap hero-shell">
		<div class="hero-grid">
			<div class="hero-copy hero-story glass-card">
				<div class="hero-copy-top">
					{#if !isTikTokVisitor}
						<div class="hero-logo-shell">
							<img class="hero-logo" src="/holographe/brand-logo.png" alt="Holograph logo" />
						</div>
					{/if}
				</div>

				<div class="hero-copy-main">
					<h1>Remember that feeling you get when pulling a holographic card from the pack?</h1>
					<p class="hero-subcopy">
						That shimmer. That “this one’s different” feeling. We put it into your most important memory.
						Custom. One of a kind.
					</p>
				</div>

				<div class="hero-proof hero-proof-compact" aria-label="Keepsake highlights">
					<div class="proof-pill">
						<strong>Personal</strong>
						<span>made from your photo</span>
					</div>
					<div class="proof-pill">
						<strong>Giftable</strong>
						<span>made to be remembered</span>
					</div>
				</div>

				<p class="hero-occasion-copy">
					Birthdays, anniversaries, baby showers, graduations, pet memorials, sympathy gifts, and party favors.
					Whatever the moment, we make it unforgettable.
				</p>
			</div>

			<div class="hero-media-shell" aria-hidden="true">
				<div class="hero-media">
					<video
						bind:this={heroVideo}
						class="hero-video"
						src="/holographe/hero-premium.mp4"
						poster="/holographe/hero-premium-poster.jpg"
						autoplay
						muted
						loop
						playsinline
						preload="metadata"
						onloadedmetadata={() => {
							if (heroVideo) heroVideo.playbackRate = 0.4;
						}}
					></video>
					<div class="hero-overlay"></div>
					<div class="hero-glow"></div>
					<div class="hero-shine"></div>
				</div>
			</div>

			<div class="hero-copy hero-cta-card glass-card">
				<p class="hero-kicker">Who would love this?</p>
				<h2>Try it with your favorite photo.</h2>
				<p class="hero-subcopy hero-subcopy-tight">
					Drop it below. I'd love to make it for you.
				</p>

				<div class="actions">
					<a class="button-primary" href="/?order=1#preview-builder" onclick={() => orderStudioOpen.set(true)}>
						Upload Your Photo
					</a>
					<a class="button-secondary" href="#preview-builder">See the preview</a>
				</div>

				<p class="hero-microcopy">
					Upload an extra image, handwritten note, paw print, or anything that makes it extra personal.
					Every order is handcrafted with care.
				</p>

				<div class="hero-proof hero-proof-compact" aria-label="Process summary">
					<div class="proof-pill">
						<strong>1 favorite photo</strong>
						<span>is all you need</span>
					</div>
					<div class="proof-pill">
						<strong>Live preview</strong>
						<span>before you order</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="hero-bottom-fade" aria-hidden="true"></div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 58vh;
		display: grid;
		align-items: center;
		padding: 3.5rem 0 0.8rem;
		overflow: hidden;
	}

	.hero.tiktok-hero {
		min-height: 90svh;
		padding-top: 1rem;
	}

	.hero-media-shell,
	.hero-media,
	.hero-overlay,
	.hero-glow,
	.hero-shine {
		position: absolute;
	}

	.hero-media {
		inset: 0;
		border-radius: 1.4rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 34px 80px rgba(0, 0, 0, 0.32);
		background: #060606;
	}

	.hero-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hero-video {
		object-fit: cover;
		object-position: center center;
		transform: scale(1.01);
		filter: saturate(0.92) contrast(1.01) brightness(0.9);
		opacity: 1;
		animation: heroFloat 20s ease-in-out infinite alternate;
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(6, 6, 6, 0.2), rgba(6, 6, 6, 0.06) 18%, rgba(6, 6, 6, 0.18) 52%, rgba(6, 6, 6, 0.62)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.01) 45%, rgba(0, 0, 0, 0.08)),
			radial-gradient(circle at 74% 22%, rgba(255, 236, 214, 0.08), transparent 24%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 24% 18%, rgba(234, 211, 182, 0.08), transparent 22%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.06), transparent 20%),
			linear-gradient(120deg, rgba(255, 255, 255, 0.025), transparent 28%, rgba(255, 239, 212, 0.035) 44%, transparent 62%);
	}

	.hero-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at center, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.16) 72%, rgba(0, 0, 0, 0.3));
		pointer-events: none;
	}

	.hero-shine {
		inset: -20% auto auto -12%;
		width: 52%;
		height: 140%;
		background: linear-gradient(115deg, rgba(255, 255, 255, 0.05), transparent 38%);
		transform: rotate(8deg);
		mix-blend-mode: screen;
	}

	.hero-shell {
		position: relative;
		z-index: 1;
		width: min(1100px, calc(100vw - 1.1rem));
		margin: 0 auto;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 15rem) minmax(0, 1fr) minmax(0, 15rem);
		align-items: stretch;
		gap: 1rem;
	}

	.hero-copy {
		display: grid;
		gap: 0.8rem;
		width: 100%;
		padding: 1rem;
		margin: 0;
		border-radius: 1.2rem;
		background:
			linear-gradient(180deg, rgba(10, 10, 10, 0.34), rgba(10, 10, 10, 0.12)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.09), transparent 34%);
		border: 1px solid rgba(255, 255, 255, 0.09);
		backdrop-filter: blur(18px);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
		transition:
			transform 220ms ease,
			border-color 220ms ease,
			box-shadow 220ms ease,
			background 220ms ease;
	}

	.hero-story {
		min-height: 100%;
		justify-content: center;
	}

	.hero-cta-card {
		position: relative;
		min-height: 100%;
		align-content: center;
		overflow: hidden;
	}

	.hero-copy:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.14);
		box-shadow: 0 26px 50px rgba(0, 0, 0, 0.24);
	}

	.hero-cta-card::before {
		content: '';
		position: absolute;
		inset: -20% auto auto -24%;
		width: 70%;
		height: 140%;
		background: linear-gradient(115deg, rgba(255, 255, 255, 0.08), transparent 42%);
		opacity: 0.55;
		transform: rotate(8deg);
		pointer-events: none;
		transition:
			transform 280ms ease,
			opacity 280ms ease;
	}

	.hero-cta-card:hover::before {
		transform: translate3d(6%, 0, 0) rotate(8deg);
		opacity: 0.8;
	}

	.hero-copy-top,
	.hero-copy-main,
	.hero-proof {
		display: grid;
		gap: 0.45rem;
	}

	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2rem, 4vw, 2.8rem);
		line-height: 0.9;
		letter-spacing: -0.055em;
		text-wrap: balance;
		color: #f7f3ee;
		text-shadow: 0 14px 34px rgba(0, 0, 0, 0.38);
	}

	.hero-kicker {
		max-width: 26rem;
		font-size: 0.66rem;
		line-height: 1.4;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.66);
	}

	.hero-subcopy {
		max-width: 19rem;
		font-size: 0.92rem;
		line-height: 1.42;
		color: rgba(247, 243, 238, 0.84);
	}

	.hero-occasion-copy {
		max-width: 20rem;
		font-size: 0.8rem;
		line-height: 1.5;
		color: rgba(247, 243, 238, 0.68);
	}

	h2 {
		margin: 0;
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.5rem, 2.3vw, 2rem);
		line-height: 0.96;
		letter-spacing: -0.045em;
		color: #f7f3ee;
	}

	.hero-subcopy-tight {
		max-width: 17rem;
	}

	.hero-microcopy {
		max-width: 17rem;
		font-size: 0.74rem;
		line-height: 1.5;
		color: rgba(247, 243, 238, 0.7);
	}

	.hero-logo-shell {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		padding: 0.45rem 0.7rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.hero-logo {
		display: block;
		width: clamp(7.8rem, 18vw, 10.5rem);
		height: clamp(2.3rem, 4.2vw, 3rem);
		object-fit: contain;
		object-position: center;
		margin: 0;
		filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.28));
	}

	.hero-media-shell {
		position: relative;
		min-height: 31rem;
		padding: 0.2rem 0;
	}

	.hero-proof {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.45rem;
	}

	.hero-proof-compact {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.proof-pill {
		display: grid;
		gap: 0.08rem;
		padding: 0.55rem 0.6rem;
		border-radius: 0.95rem;
		background: rgba(255, 255, 255, 0.045);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.proof-pill strong,
	.proof-pill span {
		display: block;
	}

	.proof-pill strong {
		font-size: 0.78rem;
		font-weight: 700;
		color: #f7f3ee;
	}

	.proof-pill span {
		font-size: 0.62rem;
		line-height: 1.3;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.56);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	:global(.hero .button-primary),
	:global(.hero .button-secondary) {
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	:global(.hero .button-primary) {
		position: relative;
		box-shadow:
			0 14px 30px rgba(234, 211, 182, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.18);
	}

	:global(.hero .button-primary:hover) {
		transform: translateY(-1px) scale(1.01);
		box-shadow:
			0 18px 34px rgba(234, 211, 182, 0.18),
			inset 0 1px 0 rgba(255, 255, 255, 0.22);
	}

	:global(.hero .button-secondary:hover) {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.16);
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

	@keyframes heroFloat {
		from {
			transform: scale(1.02) translate3d(0, 0, 0);
		}

		to {
			transform: scale(1.05) translate3d(-0.8%, -0.4%, 0);
		}
	}

	@keyframes ctaPulse {
		0%,
		100% {
			box-shadow:
				0 14px 30px rgba(234, 211, 182, 0.12),
				inset 0 1px 0 rgba(255, 255, 255, 0.18);
		}

		50% {
			box-shadow:
				0 18px 34px rgba(234, 211, 182, 0.18),
				inset 0 1px 0 rgba(255, 255, 255, 0.22);
		}
	}

	:global(.hero .button-primary) {
		animation: ctaPulse 3.6s ease-in-out infinite;
	}

	.proof-pill {
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	.proof-pill:hover {
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.13);
		background: rgba(255, 255, 255, 0.06);
	}

	@media (max-width: 640px) {
		.hero {
			min-height: auto;
			padding: 3rem 0 0.45rem;
		}

		.hero-grid {
			grid-template-columns: 1fr;
			align-items: stretch;
		}

		.hero-media-shell {
			order: -1;
			min-height: 22rem;
			padding-inline: 0.15rem;
		}

		.hero-media {
			border-radius: 1.35rem;
		}

		h1 {
			font-size: clamp(1.7rem, 9vw, 2.3rem);
		}

		.hero-copy {
			padding: 0.78rem;
			border-radius: 0.95rem;
		}

		.hero-proof {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-video {
			display: none;
		}

		.hero-copy,
		.proof-pill,
		:global(.hero .button-primary),
		:global(.hero .button-secondary) {
			animation: none;
			transition: none;
		}

		.hero-media {
			background:
				linear-gradient(180deg, rgba(7, 7, 7, 0.22), rgba(7, 7, 7, 0.66)),
				url('/holographe/hero-premium-poster.jpg') center center / cover no-repeat;
		}
	}
</style>
