<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { track } from '@vercel/analytics/sveltekit';
	import { rivalQuestProduct } from '$lib/products/rival-quest';

	const howItWorks = [
		'Print only the pages you want.',
		'Randomly divide guests into the Dragon Clan and Werewolf Pack.',
		'Let children complete quests and search for treasure.',
		'Adult Quest Masters award coins for kindness, bravery, creativity, inclusion, and good sportsmanship.',
		'Count the team treasure and celebrate every child with an honor card.'
	];

	const faq = [
		{
			question: 'Is anything mailed to me?',
			answer:
				'No. This is an instant digital download. No physical product is included and no shipping is required.'
		},
		{
			question: 'What paper should I use?',
			answer:
				'Standard US Letter paper works. Cardstock is recommended for signs, cards, awards, and tokens.'
		},
		{
			question: 'Can I use only part of the kit?',
			answer:
				'Yes. Rival Quest is designed so you can print only the pages that fit your group, time, and party space.'
		},
		{
			question: 'Can I share the file with another family?',
			answer:
				'No. Purchase permits printing for personal use at one private event. Files may not be shared, resold, redistributed, or used commercially.'
		},
		{
			question: 'What if my download fails?',
			answer:
				'Use the support link on the confirmation page or email admin@holographephoto.com with your Stripe receipt email.'
		}
	];

	const cancelled = $derived(page.url.searchParams.get('checkout') === 'cancelled');

	onMount(() => {
		track('Rival Quest Page Visit', {
			product: rivalQuestProduct.metadataProduct,
			source: page.url.searchParams.get('utm_source') ?? 'direct'
		});
	});
</script>

<svelte:head>
	<title>{rivalQuestProduct.name} | Holograph</title>
	<meta
		name="description"
		content="Buy Rival Quest, an instant digital download printable Dragon Clan vs. Werewolf Pack party game kit."
	/>
</svelte:head>

<section class="rival-page">
	<section class="rival-hero">
		<div class="hero-copy">
			<p class="eyebrow">Instant Digital Download</p>
			<h1>{rivalQuestProduct.name}</h1>
			<p class="hero-lede">
				Turn an ordinary birthday party into a legendary team adventure with printable quests,
				treasure, scoreboards, invitations, and honor cards.
			</p>
			<div class="hero-actions">
				<form method="POST" action="/checkout">
					<input type="hidden" name="product" value={rivalQuestProduct.id} />
					<button class="button-primary buy-button" type="submit">
						Buy Digital Game - {rivalQuestProduct.priceLabel}
					</button>
				</form>
				<a class="button-secondary" href="#included">See what is included</a>
			</div>
			{#if cancelled}
				<p class="checkout-note">Checkout was canceled. You can restart whenever you are ready.</p>
			{/if}
			<div class="hero-facts" aria-label="Product facts">
				<span>35-page kit</span>
				<span>US Letter PDF</span>
				<span>No shipping</span>
			</div>
		</div>

		<div class="hero-preview" aria-label="Rival Quest product previews">
			<img
				class="preview-main"
				src={rivalQuestProduct.images[0].src}
				alt={rivalQuestProduct.images[0].alt}
				width="2000"
				height="2000"
			/>
			<div class="preview-stack" aria-hidden="true">
				<img src={rivalQuestProduct.images[2].src} alt="" width="2000" height="2000" />
				<img src={rivalQuestProduct.images[3].src} alt="" width="2000" height="2000" />
			</div>
		</div>
	</section>

	<section class="preview-strip" aria-label="Product preview images">
		{#each rivalQuestProduct.images.slice(1) as image (image.src)}
			<img src={image.src} alt={image.alt} width="2000" height="2000" loading="lazy" />
		{/each}
	</section>

	<section id="included" class="content-band">
		<div class="section-head">
			<p class="eyebrow">What You Receive</p>
			<h2>A complete print-at-home quest kit.</h2>
			<p>Everything is digital, printable, and designed for flexible party setups.</p>
		</div>
		<div class="included-grid">
			{#each rivalQuestProduct.included as item (item)}
				<div class="included-item glass-card">
					<span aria-hidden="true"></span>
					<p>{item}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="split-band">
		<div class="glass-card info-panel">
			<p class="eyebrow">How It Works</p>
			<ol>
				{#each howItWorks as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
		</div>

		<div class="glass-card info-panel">
			<p class="eyebrow">Printing Info</p>
			<p>
				Files are formatted for US Letter printing. Print at home or through a local print shop.
				Colors may vary by monitor, printer, ink, and paper.
			</p>
			<p>Cardstock is recommended for signs, cards, awards, and tokens.</p>
		</div>
	</section>

	<section class="split-band">
		<div class="glass-card info-panel notice-panel">
			<p class="eyebrow">Safety Notice</p>
			<p>
				Adult supervision is required. Modify or skip any activity that is not appropriate for your
				guests, space, weather, venue, or accessibility needs. Participation should always be
				optional.
			</p>
		</div>

		<div class="glass-card info-panel">
			<p class="eyebrow">Personal Use License</p>
			<p>
				Purchase permits printing for personal use at one private event. Files may not be shared,
				resold, redistributed, or used commercially.
			</p>
		</div>
	</section>

	<section class="coming-soon glass-card">
		<p class="eyebrow">Coming Soon</p>
		<h2>Premium holographic card sets</h2>
		<p>
			A physical card version is being explored for future Holograph releases. There is no active
			preorder or physical-card checkout today.
		</p>
	</section>

	<section class="faq-band">
		<div class="section-head">
			<p class="eyebrow">FAQ</p>
			<h2>Quick answers before checkout.</h2>
		</div>
		<div class="faq-list">
			{#each faq as item (item.question)}
				<details class="glass-card">
					<summary>{item.question}</summary>
					<p>{item.answer}</p>
				</details>
			{/each}
		</div>
	</section>

	<section class="final-buy glass-card">
		<div>
			<p class="eyebrow">Instant Digital Download</p>
			<h2>Ready to start the quest?</h2>
			<p>No shipping, no physical product, no Shopify checkout.</p>
		</div>
		<form method="POST" action="/checkout">
			<input type="hidden" name="product" value={rivalQuestProduct.id} />
			<button class="button-primary buy-button" type="submit">
				Buy Digital Game - {rivalQuestProduct.priceLabel}
			</button>
		</form>
	</section>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #f8f4ee;
		text-wrap: balance;
	}

	h1 {
		font-size: clamp(2.7rem, 7vw, 6.4rem);
		line-height: 0.9;
	}

	h2 {
		font-size: clamp(2rem, 4.5vw, 3.4rem);
		line-height: 0.95;
	}

	p,
	li {
		color: rgba(238, 231, 221, 0.78);
		line-height: 1.65;
	}

	button {
		cursor: pointer;
	}

	.rival-page {
		width: var(--frame-rail);
		margin: 0 auto;
		padding: 1rem 0 2.5rem;
		display: grid;
		gap: 1.25rem;
	}

	.rival-hero {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(18rem, 0.9fr);
		gap: clamp(1rem, 4vw, 2.4rem);
		align-items: center;
		min-height: min(720px, calc(100vh - 7rem));
		padding: clamp(1rem, 3vw, 1.6rem) 0;
	}

	.hero-copy {
		display: grid;
		gap: 1rem;
		align-content: center;
	}

	.hero-lede {
		max-width: 40rem;
		font-size: clamp(1rem, 2vw, 1.2rem);
		color: rgba(246, 239, 228, 0.82);
	}

	.hero-actions,
	.final-buy {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.buy-button {
		border: 0;
		min-height: 3rem;
		font-weight: 700;
	}

	.checkout-note {
		padding: 0.75rem 0.9rem;
		border: 1px solid rgba(234, 211, 182, 0.22);
		border-radius: 0.9rem;
		background: rgba(234, 211, 182, 0.08);
		color: #f4dfc6;
	}

	.hero-facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.hero-facts span {
		padding: 0.48rem 0.72rem;
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.04);
		color: rgba(247, 243, 238, 0.82);
		font-size: 0.78rem;
	}

	.hero-preview {
		display: grid;
		grid-template-columns: 1fr 0.42fr;
		gap: 0.75rem;
		align-items: center;
	}

	.hero-preview img,
	.preview-strip img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 1.1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 26px 62px rgba(0, 0, 0, 0.34);
	}

	.preview-main {
		transform: rotate(-1.5deg);
	}

	.preview-stack {
		display: grid;
		gap: 0.75rem;
	}

	.preview-stack img:first-child {
		transform: rotate(2deg);
	}

	.preview-stack img:last-child {
		transform: rotate(-2deg);
	}

	.preview-strip {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.content-band,
	.faq-band {
		padding: 1.1rem 0;
	}

	.included-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.included-item {
		display: flex;
		gap: 0.7rem;
		padding: 1rem;
		border-radius: 1.15rem;
	}

	.included-item span {
		flex: 0 0 auto;
		width: 0.62rem;
		height: 0.62rem;
		margin-top: 0.45rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #fff2d8, #d7e6ff);
		box-shadow: 0 0 22px rgba(234, 211, 182, 0.34);
	}

	.split-band {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.9rem;
	}

	.info-panel {
		display: grid;
		gap: 0.85rem;
		padding: clamp(1rem, 2.5vw, 1.35rem);
		border-radius: 1.25rem;
	}

	.info-panel ol {
		margin: 0;
		padding-left: 1.25rem;
		display: grid;
		gap: 0.55rem;
	}

	.notice-panel {
		border-color: rgba(244, 193, 124, 0.28);
	}

	.coming-soon,
	.final-buy {
		padding: clamp(1.1rem, 3vw, 1.6rem);
		border-radius: 1.35rem;
	}

	.coming-soon {
		display: grid;
		gap: 0.7rem;
		justify-items: start;
		background:
			linear-gradient(160deg, rgba(17, 17, 17, 0.9), rgba(9, 9, 9, 0.84)),
			radial-gradient(circle at top right, rgba(217, 228, 248, 0.12), transparent 36%);
	}

	.faq-list {
		display: grid;
		gap: 0.65rem;
	}

	details {
		padding: 1rem;
		border-radius: 1rem;
	}

	summary {
		cursor: pointer;
		color: #f8f4ee;
		font-weight: 700;
	}

	details p {
		margin-top: 0.65rem;
	}

	.final-buy {
		justify-content: space-between;
	}

	.final-buy > div {
		display: grid;
		gap: 0.55rem;
	}

	@media (max-width: 860px) {
		.rival-hero,
		.split-band {
			grid-template-columns: 1fr;
		}

		.rival-hero {
			min-height: auto;
		}

		.preview-strip,
		.included-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.rival-page {
			width: min(100%, calc(100vw - 1.25rem));
			padding-top: 1.2rem;
		}

		.hero-preview {
			grid-template-columns: 1fr;
		}

		.preview-stack {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.preview-strip {
			grid-template-columns: 1fr;
		}

		.included-grid {
			grid-template-columns: 1fr;
		}

		.hero-actions,
		.final-buy,
		.hero-actions form,
		.final-buy form {
			width: 100%;
		}
	}
</style>
