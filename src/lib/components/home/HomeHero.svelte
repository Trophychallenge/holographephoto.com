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
			preload="metadata"
			poster="/holographe/jessholo.png"
		>
			<source src="/holographe/dishwasherview.mp4" type="video/mp4" />
		</video>
		<div class="hero-video-focus-frame">
			<video
				class="hero-video hero-video-focus"
				autoplay
				muted
				loop
				playsinline
				preload="metadata"
				poster="/holographe/jessholo.png"
			>
				<source src="/holographe/dishwasherview.mp4" type="video/mp4" />
			</video>
		</div>
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
							? 'The photo is cute. The light makes it unforgettable.'
							: 'Your favorite photo, reimagined in light.'}
					</h1>
					<p class="subcopy">
						{isTikTokVisitor
							? 'Try it with your own photo. Add a note, a drawing, or handwriting they would know instantly.'
							: 'A custom holographic keepsake made to be seen every day.'}
					</p>

					<div class="microcopy" aria-label="Product details">
						<span>Subtle holographic finish</span>
						<span>Gift-ready from the start</span>
						<span>Made for meaningful details</span>
					</div>

					<div class="actions">
						<a class="button-primary" href="#preview-builder">
							{isTikTokVisitor ? 'Try Your Photo' : 'Create Yours'}
						</a>
						<a class="button-secondary" href="#how-it-works">
							{isTikTokVisitor ? 'See the flow' : 'See How It Works'}
						</a>
					</div>
				</div>

				<div class="hero-note">
					<span class="hero-note-line"></span>
					<p>A photo you already love, made to catch the light every time you pass it.</p>
				</div>
			</div>

			{#if !isTikTokVisitor}
				<aside class="hero-specimen glass-card" aria-label="Featured keepsake preview">
					<div class="specimen-image-wrap">
						<img class="specimen-image" src="/holographe/jessholo.png" alt="Holographe keepsake detail" />
					</div>
					<div class="specimen-copy">
						<p class="specimen-label">In the light</p>
						<strong>Quiet shimmer. Real detail.</strong>
						<span>Upload the photo. Add the part only they would understand.</span>
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
		transform: scale(1.08);
		filter: saturate(0.9) contrast(1.04) brightness(0.72) blur(14px);
		opacity: 0.9;
	}

	.hero-video-focus-frame {
		position: absolute;
		inset: 4.5rem auto 4rem 50%;
		width: min(28rem, 36vw);
		transform: translateX(-50%);
		border-radius: 2rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.04);
		box-shadow:
			0 32px 80px rgba(0, 0, 0, 0.34),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.hero-video-focus-frame::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.12)),
			linear-gradient(110deg, rgba(255, 255, 255, 0.08), transparent 28%, transparent 76%, rgba(234, 211, 182, 0.08));
	}

	.hero-video-focus {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(1) contrast(1.04) brightness(0.92);
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(7, 7, 7, 0.08), rgba(7, 7, 7, 0.14) 24%, rgba(7, 7, 7, 0.34) 58%, rgba(7, 7, 7, 0.62)),
			linear-gradient(90deg, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.06) 28%, rgba(0, 0, 0, 0.08) 70%, rgba(0, 0, 0, 0.34)),
			radial-gradient(circle at 54% 24%, rgba(255, 236, 214, 0.14), transparent 26%);
	}

	.hero-glow {
		background:
			radial-gradient(circle at 22% 18%, rgba(234, 211, 182, 0.12), transparent 20%),
			radial-gradient(circle at 78% 22%, rgba(217, 228, 248, 0.1), transparent 18%);
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
		width: min(20rem, 100%);
		padding: 0.9rem;
		background:
			linear-gradient(160deg, rgba(15, 15, 15, 0.8), rgba(8, 8, 8, 0.74)),
			radial-gradient(circle at top, rgba(234, 211, 182, 0.08), transparent 42%);
	}

	.specimen-image-wrap {
		padding: 0.7rem;
		border-radius: 1.35rem;
		background:
			linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			radial-gradient(circle at 28% 20%, rgba(234, 211, 182, 0.12), transparent 32%);
	}

	.specimen-image {
		display: block;
		width: 100%;
		border-radius: 1rem;
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24);
	}

	.specimen-copy {
		display: grid;
		gap: 0.35rem;
		padding: 0.85rem 0.35rem 0.2rem;
	}

	.specimen-label {
		font-size: 0.68rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(241, 220, 194, 0.76);
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

		.hero-copy-wrap {
			padding-right: min(24rem, 28vw);
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

		.hero-video-focus-frame {
			inset: 5.6rem 1rem auto 1rem;
			width: auto;
			transform: none;
			height: 42svh;
		}

		.scroll-cue {
			bottom: 1rem;
		}
	}

	@media (max-width: 919px) {
		.hero-specimen {
			justify-self: start;
			max-width: 16rem;
		}

		.hero-video-fill {
			transform: scale(1.04);
			filter: saturate(0.88) contrast(1.04) brightness(0.64) blur(10px);
		}
	}

	@media (min-width: 641px) and (max-width: 919px) {
		.hero-video-focus-frame {
			inset: 6.4rem auto auto 50%;
			width: min(22rem, 48vw);
			height: 58svh;
			transform: translateX(-50%);
		}
	}
</style>
