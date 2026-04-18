<script lang="ts">
	const cards = [
		{ title: 'Fast to personalize', copy: 'Upload a photo, add a detail, and keep moving.' },
		{
			title: 'Fun to gift',
			copy: 'Bright, glossy, and much more memorable than a standard print.'
		},
		{ title: 'Easy to keep', copy: 'Designed for fridges, lockers, desks, and everyday display.' }
	];
</script>

<section class="section gift-section">
	<div class="page-wrap gift-layout">
		<div class="heading">
			<p class="eyebrow">Why it feels better</p>
			<h2>Cleaner, brighter, more giftable.</h2>
		</div>

		<div class="card-grid">
			{#each cards as card (card.title)}
				<article class="gift-card">
					<div class="glow-dot"></div>
					<h3>{card.title}</h3>
					<p>{card.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.gift-layout,
	.heading,
	.card-grid {
		display: grid;
		gap: 1rem;
	}

	.heading {
		text-align: center;
		justify-items: center;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	h2,
	h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		color: #f8f8f4;
		letter-spacing: -0.04em;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 0.98;
	}

	h3 {
		font-size: 1.35rem;
	}

	.card-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		align-items: stretch;
	}

	.gift-card {
		display: grid;
		gap: 0.75rem;
		padding: 1.2rem;
		border-radius: 1.55rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(15, 15, 17, 0.95), rgba(8, 8, 10, 0.95));
		box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24);
		text-align: center;
		position: relative;
		overflow: hidden;
		transition:
			transform 220ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;
	}

	.gift-card::after {
		content: '';
		position: absolute;
		inset: auto 12% -28% 12%;
		height: 44%;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(122, 240, 255, 0.08),
			rgba(255, 182, 92, 0.1),
			rgba(255, 111, 145, 0.08)
		);
		filter: blur(26px);
		opacity: 0;
		transition: opacity 220ms ease;
		pointer-events: none;
	}

	.gift-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 28px 58px rgba(0, 0, 0, 0.3);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.gift-card:hover::after {
		opacity: 1;
	}

	.glow-dot {
		width: 2.7rem;
		height: 2.7rem;
		margin: 0 auto;
		border-radius: 999px;
		background: linear-gradient(135deg, #7af0ff, #ffd36d, #ff86a3);
		box-shadow: 0 12px 32px rgba(122, 240, 255, 0.24);
	}

	.gift-card p {
		color: rgba(234, 234, 230, 0.72);
		line-height: 1.7;
	}

	@media (max-width: 860px) {
		.card-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
