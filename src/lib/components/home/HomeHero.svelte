<script lang="ts">
	import { resolve } from '$app/paths';
	import { featuredCheckoutOffers } from '$lib/pricing';
</script>

<section class="hero section">
	<div class="page-wrap hero-layout">
		<div class="hero-copy">
			<p class="eyebrow">Flash sale live now</p>
			<h1>Custom holographic magnets starting at $14.99.</h1>
			<p class="subhead">
				Free shipping is included, bundle pricing is live, and checkout now happens directly on the
				site.
			</p>

			<div class="sale-card glass-card">
				<div class="sale-head">
					<div>
						<p class="sale-kicker">Current offer</p>
						<h2>$14.99 per order</h2>
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
					<a class="button-primary" href={resolve('/prices')}>Shop the sale</a>
					<a class="button-secondary" href="#preview-builder">Preview your photo</a>
				</div>
			</div>

			<ul class="hero-points" aria-label="Why Holographe">
				<li>Photo upload</li>
				<li>Optional overlay</li>
				<li>Gift-ready finish</li>
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
					<p>Giftable by design</p>
					<span>Made to feel premium and personal</span>
				</div>
				<div class="hero-note note-bottom">
					<p>Sale bundles</p>
					<span>1, 3, and 5 piece offers live now</span>
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
		gap: 1.75rem;
		align-items: center;
		justify-items: center;
	}

	.hero-copy {
		display: grid;
		gap: 1.15rem;
		max-width: 48rem;
		text-align: center;
		justify-items: center;
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
		max-width: 11ch;
		font-size: clamp(3rem, 9vw, 5.4rem);
		line-height: 0.93;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 0.94;
	}

	.subhead {
		max-width: 38rem;
		font-size: 1rem;
		line-height: 1.7;
		color: rgba(246, 246, 241, 0.76);
	}

	.sale-card {
		display: grid;
		gap: 1rem;
		width: min(100%, 44rem);
		padding: 1.25rem;
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
		background: rgba(199, 216, 255, 0.12);
		color: var(--text);
	}

	.sale-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.sale-offer {
		display: grid;
		gap: 0.2rem;
		padding: 0.95rem;
		border-radius: 1.1rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		text-align: left;
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
		padding: 0.75rem 0.95rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(236, 236, 232, 0.68);
	}

	.hero-visual {
		position: relative;
		width: min(100%, 48rem);
	}

	.visual-stage {
		position: relative;
		min-height: 24rem;
		border-radius: 2rem;
		padding: 1.2rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 28%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(17, 17, 19, 0.96), rgba(9, 9, 11, 0.96));
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 28px 70px rgba(0, 0, 0, 0.34);
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

	@media (max-width: 820px) {
		.sale-head {
			align-items: flex-start;
			flex-direction: column;
		}

		.sale-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
