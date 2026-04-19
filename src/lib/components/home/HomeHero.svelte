<script lang="ts">
	import { resolve } from '$app/paths';
	import { featuredCheckoutOffers } from '$lib/pricing';

	const creatorSignals = ['Gift-core', 'Unbox-worthy', 'Instant favorite'];
</script>

<section class="hero section">
	<div class="page-wrap hero-layout">
		<div class="hero-copy">
			<div class="hero-badge">
				<span class="pulse-dot"></span>
				<span>Creator-loved gift aesthetic</span>
			</div>
			<p class="eyebrow">Made to stop the scroll</p>
			<h1>The sentimental gift that looks like it belongs on everyone’s For You Page.</h1>
			<p class="subhead">
				Glossy holographic shine, deeply personal photos, and a premium finish that feels custom,
				giftable, and instantly shareable.
			</p>

			<div class="creator-row" aria-label="Creator style highlights">
				{#each creatorSignals as signal (signal)}
					<span>{signal}</span>
				{/each}
			</div>

			<div class="sale-card glass-card">
				<div class="sale-head">
					<div>
						<p class="sale-kicker">Current offer</p>
						<h2>Starting at $14.99</h2>
					</div>
					<p class="sale-shipping">Free shipping</p>
				</div>

				<div class="sale-grid" aria-label="Current sale offers">
					{#each featuredCheckoutOffers as offer (offer.quantity)}
						<div class="sale-offer">
							<span>{offer.quantity} for</span>
							<strong>{offer.priceLabel}</strong>
							<small>{offer.subtitle}</small>
						</div>
					{/each}
				</div>

				<div class="actions">
					<a class="button-primary" href="#preview-builder">Make it now</a>
					<a class="button-secondary" href={resolve('/gallery')}>See why it hits</a>
				</div>
			</div>

			<ul class="hero-points" aria-label="Why Holographe">
				<li>Reaction-worthy shine</li>
				<li>Personalized detail</li>
				<li>Gift + keepsake energy</li>
			</ul>
		</div>

		<div class="hero-visual">
			<div class="visual-stage">
				<div class="ambient ambient-one"></div>
				<div class="ambient ambient-two"></div>
				<div class="image-frame image-back">
					<img src="/holographe/leo.png" alt="Layered Holographe keepsake preview" />
				</div>
				<div class="image-frame image-front">
					<img src="/holographe/lydholowed.png" alt="Holographic wedding keepsake" />
					<div class="shimmer"></div>
				</div>
				<div class="hero-note note-top">
					<p>Camera-roll to keepsake</p>
					<span>Made to feel custom, glossy, and worth showing off</span>
				</div>
				<div class="hero-note note-bottom">
					<p>Creator vibe</p>
					<span>Color, shine, sentiment, and a premium unbox feel</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding-top: 1.6rem;
	}

	.hero-layout {
		display: grid;
		gap: 1.5rem;
		align-items: center;
		justify-items: center;
	}

	.hero-copy {
		display: grid;
		gap: 0.85rem;
		max-width: 38rem;
		text-align: center;
		justify-items: center;
		animation: liftIn 640ms ease both;
	}

	h1,
	h2,
	p,
	ul {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		color: #f8f8f6;
		letter-spacing: -0.05em;
	}

	h1 {
		max-width: 12ch;
		font-size: clamp(2.1rem, 5.6vw, 3.5rem);
		line-height: 0.98;
		text-wrap: balance;
		text-shadow: 0 8px 30px rgba(122, 240, 255, 0.14);
	}

	h2 {
		font-size: clamp(1.5rem, 3.4vw, 2.2rem);
		line-height: 0.98;
	}

	.subhead {
		max-width: 30rem;
		font-size: 0.92rem;
		line-height: 1.58;
		color: rgba(246, 246, 241, 0.76);
	}

	.creator-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.65rem;
	}

	.creator-row span {
		padding: 0.58rem 0.82rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(122, 240, 255, 0.1), rgba(255, 111, 145, 0.08));
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(249, 248, 243, 0.9);
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(249, 248, 243, 0.88);
		font-size: 0.82rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.pulse-dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #7af0ff, #ff86a3);
		box-shadow: 0 0 0 rgba(122, 240, 255, 0.35);
		animation: badgePulse 2.4s ease-in-out infinite;
	}

	.sale-card {
		display: grid;
		gap: 1rem;
		width: min(100%, 38rem);
		padding: 1.05rem;
		position: relative;
		overflow: hidden;
		transition:
			transform 220ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;
	}

	.sale-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 34px 72px rgba(8, 18, 34, 0.36);
	}

	.sale-card::before {
		content: '';
		position: absolute;
		inset: -35% 55% 35% -10%;
		background: radial-gradient(circle, rgba(122, 240, 255, 0.16), transparent 70%);
		pointer-events: none;
	}

	.sale-card::after {
		content: '';
		position: absolute;
		inset: 48% -8% -22% 48%;
		background: radial-gradient(circle, rgba(255, 111, 145, 0.14), transparent 70%);
		pointer-events: none;
	}

	.sale-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		text-align: left;
	}

	.sale-kicker,
	.sale-shipping {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.sale-kicker {
		color: var(--accent);
	}

	.sale-shipping {
		padding: 0.75rem 0.95rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(122, 240, 255, 0.16), rgba(255, 182, 92, 0.12));
		color: var(--text);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
	}

	.sale-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.sale-offer {
		display: grid;
		gap: 0.2rem;
		padding: 0.8rem;
		border-radius: 1.1rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		text-align: left;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease,
			box-shadow 180ms ease;
	}

	.sale-offer:hover {
		transform: translateY(-3px);
		border-color: rgba(122, 240, 255, 0.22);
		background: rgba(255, 255, 255, 0.07);
		box-shadow: 0 16px 34px rgba(5, 11, 24, 0.2);
	}

	.sale-offer span,
	.sale-offer small {
		color: rgba(236, 236, 232, 0.64);
	}

	.sale-offer strong {
		font-size: 1.35rem;
		color: #f7f1e4;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.8rem;
	}

	.hero-points {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.65rem;
		padding: 0;
		list-style: none;
	}

	.hero-points li {
		padding: 0.62rem 0.82rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(236, 236, 232, 0.68);
		backdrop-filter: blur(12px);
	}

	.hero-visual {
		position: relative;
		width: min(100%, 40rem);
		animation: liftIn 720ms ease 80ms both;
	}

	.visual-stage {
		position: relative;
		min-height: 20rem;
		border-radius: 2rem;
		padding: 1rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 28%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(17, 17, 19, 0.96), rgba(9, 9, 11, 0.96));
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 28px 70px rgba(0, 0, 0, 0.34);
		animation: stageFloat 7s ease-in-out infinite;
		isolation: isolate;
	}

	.ambient {
		position: absolute;
		border-radius: 999px;
		filter: blur(36px);
		opacity: 0.6;
	}

	.ambient-one {
		top: 0.6rem;
		right: 8%;
		width: 8rem;
		height: 8rem;
		background: radial-gradient(circle, rgba(206, 214, 255, 0.78), transparent 68%);
	}

	.ambient-two {
		left: 6%;
		bottom: 8%;
		width: 7rem;
		height: 7rem;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.56), transparent 70%);
	}

	.image-frame {
		position: absolute;
		overflow: hidden;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.03);
		box-shadow: 0 22px 46px rgba(0, 0, 0, 0.28);
		transition:
			transform 220ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;
	}

	.image-frame:hover {
		box-shadow: 0 36px 84px rgba(7, 11, 20, 0.42);
		border-color: rgba(255, 255, 255, 0.14);
	}

	.image-frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-back {
		inset: 16% auto auto 3%;
		width: 42%;
		aspect-ratio: 4 / 5;
		transform: rotate(-7deg);
	}

	.image-front {
		inset: 7% 7% auto auto;
		width: 56%;
		aspect-ratio: 4 / 5;
	}

	.shimmer {
		position: absolute;
		inset: -18% auto -18% -22%;
		width: 34%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.12),
			rgba(255, 255, 255, 0.48),
			rgba(208, 219, 255, 0.42),
			transparent
		);
		mix-blend-mode: screen;
		transform: skewX(-16deg);
		animation: shimmerPass 5.2s ease-in-out infinite;
	}

	.hero-note {
		position: absolute;
		display: grid;
		gap: 0.15rem;
		padding: 0.8rem 0.9rem;
		border-radius: 1.1rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
			rgba(14, 14, 16, 0.84);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(16px);
		box-shadow: 0 18px 34px rgba(0, 0, 0, 0.22);
	}

	.hero-note p {
		color: #f6f6f2;
		font-weight: 700;
	}

	.hero-note span {
		color: rgba(230, 230, 226, 0.64);
		font-size: 0.84rem;
	}

	@keyframes liftIn {
		from {
			opacity: 0;
			transform: translateY(18px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.note-top {
		right: 6%;
		top: 1rem;
		max-width: 13rem;
	}

	.note-bottom {
		left: 5%;
		bottom: 1rem;
		max-width: 11rem;
	}

	@keyframes badgePulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(122, 240, 255, 0.25);
		}

		50% {
			box-shadow: 0 0 0 10px rgba(122, 240, 255, 0);
		}
	}

	@keyframes shimmerPass {
		0%,
		20% {
			transform: translateX(0) skewX(-16deg);
			opacity: 0;
		}

		35%,
		70% {
			transform: translateX(340%) skewX(-16deg);
			opacity: 1;
		}

		100% {
			transform: translateX(430%) skewX(-16deg);
			opacity: 0;
		}
	}

	@keyframes stageFloat {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-6px);
		}
	}

	@media (max-width: 820px) {
		.sale-head {
			align-items: flex-start;
			flex-direction: column;
		}

		.sale-grid {
			grid-template-columns: 1fr;
		}

		h1 {
			max-width: 13ch;
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding-top: 0.9rem;
		}

		.hero-layout {
			gap: 1.15rem;
		}

		.hero-copy {
			gap: 0.72rem;
		}

		h1 {
			max-width: 11ch;
			font-size: clamp(1.85rem, 9vw, 2.55rem);
		}

		h2 {
			font-size: clamp(1.3rem, 6vw, 1.8rem);
		}

		.subhead {
			max-width: 23rem;
			font-size: 0.88rem;
			line-height: 1.5;
		}

		.creator-row,
		.hero-points,
		.actions {
			gap: 0.55rem;
		}

		.creator-row span,
		.hero-points li {
			padding: 0.5rem 0.7rem;
			font-size: 0.72rem;
		}

		.sale-card {
			gap: 0.8rem;
			padding: 0.88rem;
			border-radius: 1.3rem;
		}

		.sale-offer {
			padding: 0.7rem;
			text-align: center;
		}

		.sale-offer strong {
			font-size: 1.2rem;
		}

		.sale-head {
			text-align: center;
			align-items: center;
		}

		.sale-shipping {
			align-self: center;
			padding: 0.62rem 0.82rem;
		}

		.hero-visual {
			width: 100%;
		}

		.visual-stage {
			min-height: 15.5rem;
			padding: 0.75rem;
			border-radius: 1.35rem;
		}

		.ambient-one {
			width: 5.5rem;
			height: 5.5rem;
		}

		.ambient-two {
			width: 4.5rem;
			height: 4.5rem;
		}

		.image-frame {
			border-radius: 1rem;
		}

		.image-back {
			inset: 20% auto auto 4%;
			width: 44%;
		}

		.image-front {
			inset: 10% 4% auto auto;
			width: 58%;
		}

		.hero-note {
			position: static;
			margin-top: 0.55rem;
			padding: 0.62rem 0.72rem;
			border-radius: 0.9rem;
			text-align: center;
		}

		.hero-note span {
			font-size: 0.74rem;
		}

		.note-top,
		.note-bottom {
			max-width: none;
		}
	}
</style>
