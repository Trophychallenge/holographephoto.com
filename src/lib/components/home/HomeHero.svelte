<script lang="ts">
	let { isTikTokVisitor = false } = $props();
</script>

<section class:tiktok-hero={isTikTokVisitor} class="hero section">
	<div class="hero-media" aria-hidden="true">
		<video
			class="hero-video"
			autoplay
			muted
			loop
			playsinline
			poster="/holographe/jessholo.png"
		>
			<source src="/holographe/hero-reel.mov" type="video/mp4" />
		</video>
		<div class="hero-overlay"></div>
		<div class="hero-glow"></div>
	</div>

	<div class="page-wrap hero-shell">
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
				<span>Premium holographic finish</span>
				<span>Personal overlays welcome</span>
				<span>Gift-ready from the start</span>
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
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: grid;
		align-items: end;
		padding: 6.5rem 0 4rem;
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
		object-fit: cover;
		filter: saturate(0.82) contrast(1.02) brightness(0.54);
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(7, 7, 7, 0.16), rgba(7, 7, 7, 0.54) 54%, rgba(7, 7, 7, 0.84)),
			radial-gradient(circle at 50% 24%, rgba(255, 236, 214, 0.1), transparent 24%),
			linear-gradient(90deg, rgba(0, 0, 0, 0.22), transparent 44%, rgba(0, 0, 0, 0.28));
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

	.hero-copy {
		display: grid;
		gap: 1rem;
		max-width: 35rem;
		padding-bottom: 0.5rem;
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

	@media (max-width: 640px) {
		.hero {
			min-height: 92svh;
			padding: 5.8rem 0 2.5rem;
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
	}
</style>
