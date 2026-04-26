<section class="hero section">
	<div class="page-wrap hero-shell">
		<div class="hero-copy">
			<p class="eyebrow">Holographe</p>
			<h1>Turn your favorite moment into something you can hold.</h1>
			<p class="subcopy">A photo — reimagined.</p>

			<div class="microcopy" aria-label="Product details">
				<span>Handmade with care</span>
				<span>Made to order</span>
				<span>Ships fast from Texas</span>
			</div>

			<div class="actions">
				<a class="button-primary" href="#preview-builder">Create Yours</a>
				<a class="button-secondary" href="#how-it-works">See How It Works</a>
			</div>
		</div>

		<div class="hero-visual" aria-hidden="true">
			<div class="fridge-stage">
				<div class="fridge-door"></div>
				<div class="fridge-shadow"></div>
				<div class="magnet-card">
					<img src="/holographe/lydholowed.png" alt="Holographe magnet on a fridge" />
					<div class="magnet-wash"></div>
					<div class="magnet-light"></div>
				</div>
				<div class="kitchen-glow"></div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		min-height: min(100vh, 52rem);
		display: grid;
		align-items: center;
		padding-top: 1.2rem;
	}

	.hero-shell {
		display: grid;
		gap: 1.4rem;
		align-items: center;
	}

	.hero-copy {
		display: grid;
		gap: 0.9rem;
		max-width: 28rem;
	}

	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		text-wrap: balance;
		color: #faf9f5;
	}

	.subcopy {
		max-width: 18rem;
		font-size: 1rem;
		line-height: 1.45;
		color: rgba(248, 248, 243, 0.76);
	}

	.microcopy,
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
	}

	.microcopy span {
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		font-size: 0.76rem;
		color: rgba(236, 236, 232, 0.72);
	}

	.hero-visual {
		display: grid;
		justify-items: center;
	}

	.fridge-stage {
		position: relative;
		width: min(100%, 34rem);
		min-height: 30rem;
		border-radius: 2rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top left, rgba(255, 241, 222, 0.3), transparent 18%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02)),
			linear-gradient(180deg, #f1eee8 0%, #d8d7d2 100%);
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 34px 90px rgba(0, 0, 0, 0.22);
	}

	.fridge-door {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(0, 0, 0, 0.03), transparent 22%, rgba(255, 255, 255, 0.22) 52%, transparent 78%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 28%);
	}

	.fridge-shadow {
		position: absolute;
		inset: auto 8% 1.5rem 8%;
		height: 1.5rem;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.14);
		filter: blur(18px);
	}

	.magnet-card {
		position: absolute;
		left: 50%;
		top: 52%;
		width: min(15rem, 56vw);
		aspect-ratio: 4 / 5;
		transform: translate(-50%, -50%) rotate(-4deg);
		border-radius: 1.4rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.38);
		box-shadow: 0 26px 58px rgba(0, 0, 0, 0.22);
		background: #111;
		transition:
			transform 220ms ease,
			box-shadow 220ms ease;
	}

	.magnet-card:hover {
		transform: translate(-50%, -50%) rotate(-2deg) translateY(-4px);
		box-shadow: 0 34px 72px rgba(0, 0, 0, 0.24);
	}

	.magnet-card img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(1.02) contrast(1.02);
	}

	.magnet-wash,
	.magnet-light {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.magnet-wash {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.04),
			rgba(208, 218, 255, 0.18),
			rgba(255, 255, 255, 0.06)
		);
		mix-blend-mode: screen;
	}

	.magnet-light {
		inset: -20% auto -20% -30%;
		width: 34%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.08),
			rgba(255, 255, 255, 0.42),
			rgba(212, 219, 255, 0.34),
			transparent
		);
		transform: skewX(-16deg);
		animation: magnetSweep 4.6s ease-in-out infinite;
	}

	.kitchen-glow {
		position: absolute;
		right: -8%;
		top: -10%;
		width: 40%;
		height: 40%;
		border-radius: 999px;
		background: radial-gradient(circle, rgba(255, 214, 170, 0.38), transparent 68%);
		filter: blur(32px);
	}

	@keyframes magnetSweep {
		0%,
		18% {
			transform: translateX(0) skewX(-16deg);
			opacity: 0;
		}

		30%,
		70% {
			transform: translateX(360%) skewX(-16deg);
			opacity: 1;
		}

		100% {
			transform: translateX(430%) skewX(-16deg);
			opacity: 0;
		}
	}

	@media (min-width: 980px) {
		.hero-shell {
			grid-template-columns: minmax(0, 0.92fr) minmax(22rem, 1.08fr);
		}
	}

	@media (max-width: 640px) {
		.hero {
			min-height: auto;
			padding-top: 0.8rem;
		}

		h1 {
			font-size: clamp(2.2rem, 10vw, 3.2rem);
		}

		.subcopy {
			font-size: 0.94rem;
		}

		.actions {
			display: grid;
			grid-template-columns: 1fr;
		}

		.fridge-stage {
			min-height: 22rem;
			border-radius: 1.5rem;
		}

		.magnet-card {
			width: min(13rem, 62vw);
		}
	}
</style>
