<script lang="ts">
	import { orderStudioOpen } from '$lib/stores/order-studio';

	let { isTikTokVisitor = false } = $props();

	const heroVideos = [
		{
			src: '/holographe/hero-premium.mp4',
			poster: '/holographe/hero-premium-poster.jpg',
			label: 'Glow'
		},
		{
			src: '/holographe/3picsdishwasher.mp4',
			poster: '/holographe/jess-holo-hero.webp',
			label: 'Rainbow'
		},
		{
			src: '/holographe/dishwasherview.mp4',
			poster: '/holographe/jess-holo-hero.webp',
			label: 'Shine'
		}
	] as const;

	let activeVideo = $state(0);
</script>

<section class:tiktok-hero={isTikTokVisitor} class="hero section">
	<div class="hero-media-shell" aria-hidden="true">
		<div class="hero-media">
			<video
				class="hero-video"
				src={heroVideos[activeVideo].src}
				poster={heroVideos[activeVideo].poster}
				autoplay
				muted
				loop
				playsinline
				preload="auto"
			></video>
			<div class="hero-overlay"></div>
			<div class="hero-glow"></div>
			<div class="hero-shine"></div>
		</div>
	</div>

	<div class="page-wrap hero-shell">
		<div class="hero-copy glass-card">
			<div class="hero-copy-top">
				{#if !isTikTokVisitor}
					<img class="hero-logo" src="/holographe/brand-logo.png" alt="Holograph logo" />
				{/if}
				<p class="hero-kicker">Photo to holograph</p>
			</div>

			<div class="hero-copy-main">
				<h1>Your photo. In light.</h1>
			</div>

			<div class="actions">
				<button class="button-primary" type="button" onclick={() => orderStudioOpen.set(true)}>
					{isTikTokVisitor ? 'Start With Your Photo' : 'Start Order'}
				</button>
				<a class="button-secondary" href="/prices">View Bundles</a>
			</div>
		</div>

		<div class="hero-video-tabs" aria-label="Hero video views">
			{#each heroVideos as video, index}
				<button
					type="button"
					class:active-tab={activeVideo === index}
					class="video-tab"
					onclick={() => (activeVideo = index)}
				>
					<span></span>
					{video.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="hero-bottom-fade" aria-hidden="true"></div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 46vh;
		display: grid;
		align-items: center;
		padding: 3.35rem 0 0.55rem;
		overflow: clip;
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

	.hero-media-shell {
		inset: 0;
		display: grid;
		place-items: center;
		padding: 0.4rem 0.55rem 0.7rem;
	}

	.hero-media {
		inset: auto;
		width: min(100%, 640px);
		height: min(100%, 27rem);
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
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: end;
		gap: 0.6rem;
		min-height: 100%;
	}

	.hero-copy {
		display: grid;
		gap: 0.7rem;
		width: min(100%, 22rem);
		padding: 0.9rem;
		margin: 0.35rem 0 0 0.25rem;
		border-radius: 1.2rem;
		background:
			linear-gradient(180deg, rgba(10, 10, 10, 0.34), rgba(10, 10, 10, 0.12)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.09), transparent 34%);
		border: 1px solid rgba(255, 255, 255, 0.09);
		backdrop-filter: blur(18px);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
	}

	.hero-copy-top,
	.hero-copy-main,
	.hero-video-tabs {
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

	.hero-logo {
		display: block;
		width: clamp(7.8rem, 18vw, 10.5rem);
		height: auto;
		margin-bottom: 0.1rem;
		filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.28));
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.hero-video-tabs {
		grid-template-columns: repeat(3, minmax(0, auto));
		gap: 0.45rem;
		justify-content: start;
	}

	.video-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.42rem 0.62rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(247, 243, 238, 0.74);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.video-tab span {
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.28);
	}

	.active-tab {
		border-color: rgba(234, 211, 182, 0.32);
		background: rgba(255, 255, 255, 0.08);
		color: #f7f3ee;
	}

	.active-tab span {
		background: #ead3b6;
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

	@media (max-width: 640px) {
		.hero {
			min-height: auto;
			padding: 3rem 0 0.45rem;
		}

		.hero-media-shell {
			padding-inline: 0.35rem;
		}

		.hero-media {
			border-radius: 1.35rem;
			height: min(100%, 22rem);
		}

		h1 {
			font-size: clamp(1.7rem, 9vw, 2.3rem);
		}

		.hero-copy {
			padding: 0.78rem;
			margin: 0.4rem 0 0 0;
			border-radius: 0.95rem;
		}

		.hero-video-tabs {
			grid-template-columns: repeat(3, minmax(0, auto));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-video {
			display: none;
		}

		.hero-media {
			background:
				linear-gradient(180deg, rgba(7, 7, 7, 0.22), rgba(7, 7, 7, 0.66)),
				url('/holographe/jess-holo-hero.webp') center 38% / cover no-repeat;
		}
	}
</style>
