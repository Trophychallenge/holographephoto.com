<script lang="ts">
	let { isTikTokVisitor = false } = $props();
</script>

<section class:tiktok-hero={isTikTokVisitor} class="hero section">
	<div class="hero-media" aria-hidden="true">
		<video
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
					<p class="eyebrow">{isTikTokVisitor ? 'Made for your camera roll' : 'Holographe'}</p>
					<h1>
						{isTikTokVisitor
							? 'Your photo, glowing back at you.'
							: 'Your photo, glowing back at you.'}
					</h1>
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
			</div>

			{#if !isTikTokVisitor}
				<aside class="hero-specimen glass-card" aria-label="Before and after holographic logo preview">
					<div class="specimen-compare">
						<div class="compare-panel">
							<p class="compare-label">Before</p>
							<div class="compare-image-wrap">
								<img class="specimen-image specimen-before" src="/holographe/holographe-logo-hero.png" alt="Original Holographe logo" />
							</div>
						</div>
						<div class="compare-panel">
							<p class="compare-label">After</p>
							<div class="compare-image-wrap after-wrap">
								<img class="specimen-image specimen-after" src="/holographe/holographe-logo-hero.png" alt="Holographe logo with realistic light shimmer" />
								<div class="after-rainbow"></div>
								<div class="after-sheen"></div>
								<div class="after-stars">
									<span class="star star-a"></span>
									<span class="star star-b"></span>
									<span class="star star-c"></span>
								</div>
							</div>
						</div>
					</div>
					<div class="specimen-copy">
						<p class="specimen-label">Light test</p>
						<strong>Real shine. Soft color.</strong>
						<span>The same glow carries into the live preview below.</span>
					</div>
				</aside>
			{/if}
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
		transform: scale(1.015);
		filter: saturate(1.04) contrast(1.08) brightness(0.98);
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(7, 7, 7, 0.04), rgba(7, 7, 7, 0.08) 24%, rgba(7, 7, 7, 0.2) 56%, rgba(7, 7, 7, 0.46)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.26), rgba(0, 0, 0, 0.04) 24%, rgba(0, 0, 0, 0.04) 72%, rgba(0, 0, 0, 0.22)),
			radial-gradient(circle at 58% 20%, rgba(255, 236, 214, 0.2), transparent 28%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 22% 18%, rgba(234, 211, 182, 0.14), transparent 22%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.12), transparent 20%),
			linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 28%, rgba(255, 239, 212, 0.08) 44%, transparent 62%);
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
		gap: 1rem;
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

	.hero-note-line {
		width: 2.5rem;
		height: 1px;
		margin-top: 0.75rem;
		background: linear-gradient(90deg, rgba(234, 211, 182, 0.9), rgba(234, 211, 182, 0));
		flex: 0 0 auto;
	}

	.hero-specimen {
		align-self: end;
		justify-self: end;
		width: min(24rem, 100%);
		padding: 0.9rem;
		background:
			linear-gradient(160deg, rgba(15, 15, 15, 0.8), rgba(8, 8, 8, 0.74)),
			radial-gradient(circle at top, rgba(234, 211, 182, 0.08), transparent 42%);
	}

	.specimen-compare {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
	}

	.compare-panel {
		display: grid;
		gap: 0.45rem;
	}

	.compare-label,
	.specimen-label {
		font-size: 0.68rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(241, 220, 194, 0.76);
	}

	.compare-image-wrap {
		position: relative;
		overflow: hidden;
		padding: 0.7rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			radial-gradient(circle at 28% 20%, rgba(234, 211, 182, 0.12), transparent 32%);
	}

	.specimen-image {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: 1rem;
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24);
	}

	.specimen-before {
		filter: grayscale(1) contrast(0.9) brightness(0.62);
	}

	.after-wrap {
		isolation: isolate;
		background:
			linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			radial-gradient(circle at 18% 16%, rgba(255, 214, 170, 0.12), transparent 32%),
			radial-gradient(circle at 80% 78%, rgba(167, 212, 255, 0.12), transparent 28%);
	}

	.specimen-after {
		filter: saturate(1.16) contrast(1.06) brightness(1.02);
	}

	.after-rainbow,
	.after-sheen,
	.after-stars {
		position: absolute;
		inset: 0.7rem;
		border-radius: 1rem;
		pointer-events: none;
	}

	.after-rainbow {
		mix-blend-mode: screen;
		background:
			radial-gradient(circle at 20% 22%, rgba(255, 226, 171, 0.3), transparent 28%),
			radial-gradient(circle at 76% 26%, rgba(189, 221, 255, 0.24), transparent 26%),
			radial-gradient(circle at 72% 76%, rgba(255, 177, 221, 0.22), transparent 24%),
			linear-gradient(115deg, rgba(255, 156, 208, 0.18), rgba(170, 220, 255, 0.22) 44%, rgba(255, 241, 187, 0.2) 74%, rgba(255, 255, 255, 0));
	}

	.after-sheen {
		mix-blend-mode: screen;
		background: linear-gradient(118deg, rgba(255, 255, 255, 0) 22%, rgba(255, 255, 255, 0.22) 44%, rgba(255, 243, 218, 0.42) 49%, rgba(178, 226, 255, 0.16) 55%, rgba(255, 255, 255, 0) 72%);
		transform: translateX(-18%) rotate(-7deg);
		animation: shimmer-pass 6.8s ease-in-out infinite;
	}

	.after-stars span {
		position: absolute;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 999px;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.12) 58%, rgba(255, 255, 255, 0) 72%);
		box-shadow:
			0 0 0.95rem rgba(255, 238, 214, 0.5),
			0 0 1.5rem rgba(190, 222, 255, 0.38);
	}

	.after-stars span::before,
	.after-stars span::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		background: rgba(255, 255, 255, 0.96);
		transform: translate(-50%, -50%);
	}

	.after-stars span::before {
		width: 2.1rem;
		height: 1px;
	}

	.after-stars span::after {
		width: 1px;
		height: 2.1rem;
	}

	.star-a {
		top: 18%;
		left: 16%;
	}

	.star-b {
		top: 62%;
		left: 74%;
	}

	.star-c {
		top: 32%;
		left: 86%;
		width: 0.72rem;
		height: 0.72rem;
	}

	.specimen-copy {
		display: grid;
		gap: 0.35rem;
		padding: 0.85rem 0.35rem 0.2rem;
	}

	.specimen-copy strong {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: 1.25rem;
		line-height: 1;
		letter-spacing: -0.04em;
		color: #f7f3ee;
	}

	.specimen-copy span {
		color: rgba(247, 243, 238, 0.7);
		font-size: 0.84rem;
		line-height: 1.45;
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

	@media (min-width: 920px) {
		.hero-stage {
			grid-template-columns: minmax(0, 1fr) minmax(14rem, 20rem);
		}
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
		.hero-specimen {
			justify-self: start;
			max-width: 20rem;
		}

		.hero-video-fill {
			transform: scale(1.02);
			filter: saturate(0.96) contrast(1.03) brightness(0.78);
		}
	}

	@keyframes shimmer-pass {
		0%,
		100% {
			transform: translateX(-24%) rotate(-7deg);
			opacity: 0.45;
		}

		50% {
			transform: translateX(18%) rotate(-7deg);
			opacity: 0.95;
		}
	}
</style>
