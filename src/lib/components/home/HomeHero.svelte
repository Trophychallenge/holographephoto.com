<section class="hero section">
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
			<p class="eyebrow">Holographe</p>
			<h1>Your favorite photo, reimagined in light.</h1>
			<p class="subcopy">A custom holographic keepsake made to be seen every day.</p>

			<div class="microcopy" aria-label="Product details">
				<span>Handmade with care</span>
				<span>Made to order</span>
				<span>Ships fast from Texas</span>
			</div>

			<div class="actions">
				<a class="button-primary" href="#preview-builder">Preview My Photo</a>
				<a class="button-secondary" href="#how-it-works">See How It Works</a>
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
		filter: saturate(0.88) contrast(1.02) brightness(0.54);
	}

	.hero-overlay {
		background:
			linear-gradient(180deg, rgba(8, 8, 10, 0.16), rgba(8, 8, 10, 0.58) 56%, rgba(8, 8, 10, 0.84)),
			radial-gradient(circle at 50% 25%, rgba(255, 231, 204, 0.14), transparent 24%),
			linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 42%, rgba(0, 0, 0, 0.28));
	}

	.hero-glow {
		background:
			radial-gradient(circle at 22% 18%, rgba(255, 219, 180, 0.14), transparent 20%),
			radial-gradient(circle at 78% 22%, rgba(205, 225, 255, 0.12), transparent 18%);
	}

	.hero-shell {
		position: relative;
		z-index: 1;
	}

	.hero-copy {
		display: grid;
		gap: 0.95rem;
		max-width: 34rem;
		padding-bottom: 0.5rem;
	}

	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2.6rem, 6vw, 4.85rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
		text-wrap: balance;
		color: #f6f3ec;
	}

	.subcopy {
		max-width: 24rem;
		font-size: 0.98rem;
		line-height: 1.48;
		color: rgba(247, 243, 236, 0.8);
	}

	.microcopy,
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.microcopy span {
		padding: 0.48rem 0.74rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.055);
		backdrop-filter: blur(16px);
		font-size: 0.76rem;
		color: rgba(244, 240, 234, 0.78);
	}

	@media (max-width: 640px) {
		.hero {
			min-height: 94svh;
			padding: 5.8rem 0 2.5rem;
		}

		h1 {
			font-size: clamp(2.3rem, 11vw, 3.4rem);
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
