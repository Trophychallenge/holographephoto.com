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
							<img class="hero-logo" src="/holographe/brand-wordmark.png" alt="Holograph logo" />
						</div>
					{/if}
				</div>

				<div class="hero-copy-main">
					<p class="hero-overline">A favorite memory, recast in light.</p>
					<h1>
						<span class="headline-top">A photo you love.</span>
						<span class="headline-bottom">Held a little differently.</span>
					</h1>
					<p class="hero-subcopy">
						Upload one photo. We transform it into a shimmering piece that feels personal the second
						you hold it.
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
					For anniversaries, babies, pets, memorials, milestones, and the people you never want to
					forget.
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
					<div class="hero-orb hero-orb-warm"></div>
					<div class="hero-orb hero-orb-cool"></div>
					<div class="hero-media-badge hero-media-badge-top">shifts in the light</div>
					<div class="hero-media-badge hero-media-badge-bottom">made from your photo</div>
				</div>
			</div>

			<div class="hero-copy hero-cta-card glass-card">
				<p class="hero-kicker">See it in seconds</p>
				<h2>Upload your photo and preview the feeling.</h2>
				<p class="hero-subcopy hero-subcopy-tight">
					Add a face, a paw print, or a handwritten note. We make it gift-ready.
				</p>

				<div class="actions">
					<a
						class="button-primary"
						href="/?order=1#preview-builder"
						onclick={() => orderStudioOpen.set(true)}
					>
						Upload Your Photo
					</a>
					<a class="button-secondary" href="#preview-builder">See the preview</a>
				</div>

				<p class="hero-microcopy">
					Handcrafted, emotional, and made to catch the light when the moment matters most.
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
	.hero-shine,
	.hero-orb {
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
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 28%),
			linear-gradient(145deg, #060606, #111218 58%, #060606);
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
			linear-gradient(
				180deg,
				rgba(6, 6, 6, 0.2),
				rgba(6, 6, 6, 0.06) 18%,
				rgba(6, 6, 6, 0.18) 52%,
				rgba(6, 6, 6, 0.62)
			),
			linear-gradient(90deg, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.01) 45%, rgba(0, 0, 0, 0.08)),
			radial-gradient(circle at 74% 22%, rgba(255, 236, 214, 0.08), transparent 24%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 24% 18%, rgba(234, 211, 182, 0.08), transparent 22%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.06), transparent 20%),
			linear-gradient(
				120deg,
				rgba(255, 255, 255, 0.025),
				transparent 28%,
				rgba(255, 239, 212, 0.035) 44%,
				transparent 62%
			);
	}

	.hero-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0),
			rgba(0, 0, 0, 0.16) 72%,
			rgba(0, 0, 0, 0.3)
		);
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

	.hero-orb {
		border-radius: 999px;
		filter: blur(18px);
		opacity: 0.8;
		pointer-events: none;
	}

	.hero-orb-warm {
		right: 10%;
		bottom: 8%;
		width: 6.5rem;
		height: 6.5rem;
		background: radial-gradient(circle, rgba(255, 214, 168, 0.42), rgba(255, 214, 168, 0));
		animation: orbFloat 9s ease-in-out infinite alternate;
	}

	.hero-orb-cool {
		left: 8%;
		top: 12%;
		width: 5.25rem;
		height: 5.25rem;
		background: radial-gradient(circle, rgba(168, 214, 255, 0.26), rgba(168, 214, 255, 0));
		animation: orbFloat 11s ease-in-out infinite alternate-reverse;
	}

	.hero-media-badge {
		position: absolute;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.5rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04)),
			rgba(8, 8, 10, 0.34);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			0 18px 36px rgba(0, 0, 0, 0.24);
		backdrop-filter: blur(18px);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(249, 245, 239, 0.84);
	}

	.hero-media-badge-top {
		top: 1rem;
		right: 1rem;
	}

	.hero-media-badge-bottom {
		left: 1rem;
		bottom: 1rem;
	}

	.hero-shell {
		position: relative;
		z-index: 1;
		width: min(1160px, calc(100vw - 1.1rem));
		margin: 0 auto;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 16.25rem) minmax(0, 1.05fr) minmax(0, 16.25rem);
		align-items: stretch;
		gap: 1rem;
	}

	.hero-copy {
		position: relative;
		display: grid;
		gap: 1.35rem;
		width: 100%;
		padding: 1.55rem 1.5rem;
		margin: 0;
		border-radius: 1.2rem;
		background:
			linear-gradient(180deg, rgba(10, 10, 10, 0.34), rgba(10, 10, 10, 0.12)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.12), transparent 34%),
			radial-gradient(circle at bottom right, rgba(193, 220, 255, 0.08), transparent 32%);
		border: 1px solid rgba(255, 255, 255, 0.09);
		backdrop-filter: blur(18px);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
		transition:
			transform 220ms ease,
			border-color 220ms ease,
			box-shadow 220ms ease,
			background 220ms ease;
	}

	.hero-copy::before {
		content: '';
		position: absolute;
		inset: -0.85rem;
		border-radius: 1.8rem;
		opacity: 0.9;
		filter: blur(24px);
		z-index: -1;
		pointer-events: none;
	}

	.hero-story {
		min-height: 100%;
		justify-content: center;
		background:
			linear-gradient(180deg, rgba(38, 22, 10, 0.46), rgba(10, 10, 10, 0.2)),
			radial-gradient(circle at top left, rgba(255, 209, 156, 0.16), transparent 36%),
			radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.05), transparent 30%);
	}

	.hero-story::before {
		background:
			radial-gradient(circle at 18% 22%, rgba(255, 196, 132, 0.26), transparent 34%),
			radial-gradient(circle at 78% 82%, rgba(255, 236, 214, 0.12), transparent 36%);
	}

	.hero-cta-card {
		position: relative;
		min-height: 100%;
		align-content: center;
		overflow: hidden;
		background:
			linear-gradient(180deg, rgba(16, 24, 40, 0.5), rgba(10, 10, 10, 0.2)),
			radial-gradient(circle at top right, rgba(159, 204, 255, 0.18), transparent 34%),
			radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.05), transparent 32%);
	}

	.hero-cta-card::before {
		background:
			radial-gradient(circle at 76% 18%, rgba(154, 208, 255, 0.26), transparent 34%),
			radial-gradient(circle at 20% 78%, rgba(219, 232, 255, 0.12), transparent 38%);
	}

	.hero-story::after,
	.hero-cta-card::after {
		content: '';
		position: absolute;
		pointer-events: none;
	}

	.hero-story::after {
		inset: auto 1.1rem 1rem 1.1rem;
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.02),
			rgba(255, 236, 214, 0.28),
			rgba(255, 255, 255, 0.02)
		);
	}

	.hero-cta-card::after {
		inset: auto auto -10% -6%;
		width: 10rem;
		height: 10rem;
		border-radius: 999px;
		background: radial-gradient(circle, rgba(242, 225, 198, 0.14), rgba(242, 225, 198, 0));
		filter: blur(8px);
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
		gap: 0.9rem;
	}

	.hero-overline {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		width: fit-content;
		padding: 0.45rem 0.72rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(234, 211, 182, 0.08));
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(246, 239, 228, 0.74);
	}

	.hero-overline::before {
		content: '';
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #ffe2b9, #cbe1ff);
		box-shadow: 0 0 18px rgba(255, 226, 185, 0.45);
	}

	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		display: grid;
		gap: 0.15rem;
		font-size: clamp(1.92rem, 3.15vw, 2.62rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		text-wrap: balance;
		color: transparent;
		background: linear-gradient(180deg, #fffaf4 0%, #f6e9d3 54%, #dde8fb 100%);
		-webkit-background-clip: text;
		background-clip: text;
		text-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
	}

	h1::first-line {
		color: transparent;
		text-shadow:
			0 0 18px rgba(234, 211, 182, 0.18),
			0 14px 34px rgba(0, 0, 0, 0.38);
	}

	.headline-top,
	.headline-bottom {
		display: block;
	}

	.headline-top {
		font-size: 0.92em;
		letter-spacing: -0.02em;
	}

	.headline-bottom {
		font-size: 1.08em;
		font-style: italic;
		color: transparent;
		background: linear-gradient(90deg, #ffe7bf 0%, #fff8ee 42%, #cfe1ff 100%);
		-webkit-background-clip: text;
		background-clip: text;
		text-shadow: 0 0 22px rgba(214, 230, 255, 0.18);
	}

	.hero-kicker {
		display: inline-flex;
		width: fit-content;
		padding-bottom: 0.2rem;
		border-bottom: 1px solid rgba(246, 226, 200, 0.2);
		max-width: 26rem;
		font-size: 0.69rem;
		line-height: 1.45;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.62);
	}

	.hero-subcopy {
		max-width: 20rem;
		font-size: 0.96rem;
		line-height: 1.92;
		letter-spacing: 0.012em;
		color: rgba(247, 243, 238, 0.84);
	}

	.hero-occasion-copy {
		max-width: 20rem;
		font-size: 0.84rem;
		line-height: 1.98;
		letter-spacing: 0.012em;
		color: rgba(247, 243, 238, 0.68);
	}

	h2 {
		margin: 0;
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.62rem, 2.08vw, 1.98rem);
		line-height: 1.18;
		letter-spacing: -0.028em;
		color: #f7f3ee;
		text-wrap: balance;
	}

	.hero-subcopy-tight {
		max-width: 18rem;
	}

	.hero-microcopy {
		max-width: 18rem;
		font-size: 0.8rem;
		line-height: 1.88;
		letter-spacing: 0.01em;
		color: rgba(247, 243, 238, 0.7);
	}

	.hero-logo-shell {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		padding: 0.42rem 0.72rem 0.34rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.hero-logo {
		display: block;
		width: clamp(8.4rem, 19vw, 11.4rem);
		height: auto;
		margin: 0;
		filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.28));
	}

	.hero-media-shell {
		position: relative;
		min-height: 30.5rem;
		padding: 0.4rem 0;
	}

	.hero-media-shell::before {
		content: '';
		position: absolute;
		inset: 1rem 0.55rem 0.45rem;
		border-radius: 1.55rem;
		background: linear-gradient(135deg, rgba(255, 226, 185, 0.2), rgba(198, 221, 255, 0.16));
		filter: blur(20px);
		opacity: 0.82;
	}

	.hero-proof {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.55rem;
	}

	.hero-proof-compact {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.proof-pill {
		display: grid;
		gap: 0.18rem;
		padding: 0.72rem 0.76rem;
		border-radius: 0.95rem;
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
			rgba(255, 255, 255, 0.045);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.proof-pill strong,
	.proof-pill span {
		display: block;
	}

	.proof-pill strong {
		font-size: 0.84rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: #f7f3ee;
	}

	.proof-pill span {
		font-size: 0.64rem;
		line-height: 1.5;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.56);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
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

	@keyframes orbFloat {
		from {
			transform: translate3d(0, 0, 0) scale(1);
		}

		to {
			transform: translate3d(0, -10px, 0) scale(1.06);
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
			min-height: 20rem;
			padding-inline: 0.15rem;
		}

		.hero-media-badge {
			font-size: 0.58rem;
			letter-spacing: 0.12em;
		}

		.hero-media-badge-top {
			top: 0.8rem;
			right: 0.8rem;
		}

		.hero-media-badge-bottom {
			left: 0.8rem;
			bottom: 0.8rem;
		}

		.hero-media {
			border-radius: 1.35rem;
		}

		h1 {
			font-size: clamp(1.7rem, 9vw, 2.3rem);
		}

		.hero-copy {
			gap: 1.05rem;
			padding: 1.15rem 1rem;
			border-radius: 0.95rem;
			justify-items: center;
			text-align: center;
		}

		.hero-copy-top,
		.hero-copy-main {
			justify-items: center;
		}

		.hero-overline,
		.hero-kicker {
			justify-self: center;
		}

		.hero-subcopy,
		.hero-occasion-copy,
		.hero-microcopy,
		.hero-subcopy-tight {
			max-width: 100%;
		}

		.actions {
			width: 100%;
			justify-content: center;
		}

		.hero-proof {
			grid-template-columns: 1fr;
			width: 100%;
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
