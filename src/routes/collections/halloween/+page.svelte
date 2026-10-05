<script lang="ts">
	import { resolve } from '$app/paths';
	import ProductMedia from '$lib/components/products/ProductMedia.svelte';
	import CarnivalFeature from '$lib/components/home/CarnivalFeature.svelte';
	import {
		halloweenCollectionReferenceMedia,
		halloweenDesigns,
		halloweenPackages,
		halloweenProducts,
		type HalloweenPackage
	} from '$lib/products/halloween';

	let selectedDesignSlug = $state(halloweenDesigns[0].slug);
	let selectedPackageId = $state<HalloweenPackage['id']>('full-mural');
	let quantity = $state(1);

	const selectedDesign = $derived(
		halloweenDesigns.find((design) => design.slug === selectedDesignSlug) ?? halloweenDesigns[0]
	);
	const availablePackages = $derived(
		halloweenPackages.filter((productPackage) =>
			selectedDesign.productOptionIds.includes(productPackage.id)
		)
	);
	const selectedPackage = $derived(
		availablePackages.find((productPackage) => productPackage.id === selectedPackageId) ??
			availablePackages[0]
	);
</script>

<svelte:head>
	<title>The Holographe Halloween Collection | Holographe</title>
	<meta
		name="description"
		content="Choose an exclusive Holographe Halloween design and mural format."
	/>
	<meta property="og:title" content="The Holographe Halloween Collection" />
	<meta
		property="og:description"
		content="Limited seasonal magnetic decor designed to come alive in the light."
	/>
</svelte:head>

<div class="halloween-page">
	<section class="collection-hero">
		<div class="collection-hero-copy">
			<p class="eyebrow">Holographe Exclusive</p>
			<h1>Halloween Edition</h1>
			<p>Limited seasonal release.</p>
			<p class="hero-editorial">Holographic magnetic decor for a memorable Halloween display.</p>
			<p class="hero-note">Watch it come alive in the light.</p>
		</div>
		<div class="collection-video">
			<ProductMedia media={halloweenProducts[0].media} label="Halloween magnetic decor" autoplay />
		</div>
	</section>

	<CarnivalFeature />
	<section class="reference-section" aria-labelledby="reference-heading">
		<div class="reference-copy">
			<p class="eyebrow">The collection</p>
			<h2 id="reference-heading">Six designs. One seasonal release.</h2>
		</div>
		<figure class="collection-reference">
			<img
				src={halloweenCollectionReferenceMedia.src}
				alt={halloweenCollectionReferenceMedia.alt}
				loading="lazy"
			/>
			<figcaption>All six mural worlds, shown together.</figcaption>
		</figure>
	</section>

	<section class="shop-section" aria-labelledby="design-heading">
		<div class="section-intro">
			<p class="eyebrow">Choose your nightmare</p>
			<h2 id="design-heading">Choose your nightmare.</h2>
			<p>Choose the design that fits your night.</p>
		</div>

		<div class="design-grid" role="radiogroup" aria-label="Halloween design">
			{#each halloweenDesigns as design (design.id)}
				<button
					type="button"
					class:selected={selectedDesign.slug === design.slug}
					class="design-card"
					role="radio"
					aria-checked={selectedDesign.slug === design.slug}
					onclick={() => (selectedDesignSlug = design.slug)}
				>
					{#if design.thumbnail?.type === 'image'}
						<img class="design-artwork" src={design.thumbnail.src} alt={design.thumbnail.alt} />
					{:else}
						<div class="design-placeholder" aria-hidden="true"><strong>{design.name}</strong><small>{design.placeholderLabel}</small></div>
					{/if}
					<div class="design-card-copy">
						<strong>{design.name}</strong>
						<span>{selectedDesign.slug === design.slug ? 'Selected' : 'Select design'}</span>
					</div>
				</button>
			{/each}
		</div>
		<p class="asset-note">Additional design artwork will be added as it becomes available.</p>
	</section>

	<section class="shop-section" aria-labelledby="format-heading">
		<div class="section-intro">
			<p class="eyebrow">Make it yours</p>
			<h2 id="format-heading">Choose your edition.</h2>
			<p>Choose one panel, a 2×2 mini mural, or the full nine-piece mural.</p>
		</div>

		<div class="package-grid" role="radiogroup" aria-label="Halloween package">
			{#each availablePackages as productPackage (productPackage.id)}
				<button
					type="button"
					class:selected={selectedPackage.id === productPackage.id}
					class:featured={productPackage.id === 'full-mural'}
					class:custom={productPackage.id === 'custom-mural'}
					class="package-card"
					role="radio"
					aria-checked={selectedPackage.id === productPackage.id}
					onclick={() => (selectedPackageId = productPackage.id)}
				>
					<div class="package-topline">
						<span>{productPackage.editionName}</span>
						{#if productPackage.badge}<em>{productPackage.badge}</em>{/if}
					</div>
					<strong>{productPackage.name}</strong>
					<b>{productPackage.priceLabel}</b>
					<p>{productPackage.description}</p>
					{#if productPackage.id === 'custom-mural'}
						<p class="bespoke-note">Created specifically for your space.</p>
					{/if}
				</button>
			{/each}
		</div>
	</section>

	<section class="selection-review" aria-labelledby="review-heading">
		<div>
			<p class="eyebrow">Your edition</p>
			<h2 id="review-heading">Your edition</h2>
			<dl class="edition-summary">
				<div>
					<dt>Design</dt>
					<dd>{selectedDesign.name}</dd>
				</div>
				<div>
					<dt>Format</dt>
					<dd>{selectedPackage.editionName}</dd>
				</div>
				{#if selectedPackage.id === 'custom-mural'}
					<div>
						<dt>Customization</dt>
						<dd>Created specifically for your space.</dd>
					</div>
				{/if}
				<div>
					<dt>Price</dt>
					<dd>{selectedPackage.priceLabel}</dd>
				</div>
			</dl>
		</div>
		<div class="quantity-control">
			<label for="quantity">Quantity</label>
			<div>
				<button
					type="button"
					aria-label="Decrease quantity"
					onclick={() => (quantity = Math.max(1, quantity - 1))}>−</button
				>
				<input id="quantity" type="number" min="1" bind:value={quantity} />
				<button type="button" aria-label="Increase quantity" onclick={() => (quantity += 1)}
					>+</button
				>
			</div>
		</div>
		<a
			class="button-primary review-cta"
			href={resolve(
				`/collections/halloween/seasonal-release?design=${selectedDesign.slug}&package=${selectedPackage.id}&quantity=${quantity}`
			)}
		>
			Continue to Reserve
		</a>
		<p class="configuration-note">
			Choose your variant on the next page, then continue to secure checkout.
		</p>
	</section>
</div>

<style>
	.halloween-page {
		width: min(1160px, calc(100vw - 1.1rem));
		margin: 0 auto;
		padding: clamp(2rem, 6vw, 5.5rem) 0 4rem;
	}
	.collection-hero {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(15rem, 0.62fr);
		gap: clamp(2rem, 7vw, 7rem);
		align-items: center;
		padding: clamp(1.6rem, 5vw, 4.2rem);
		border: 1px solid rgba(236, 185, 108, 0.2);
		border-radius: 2rem;
		background:
			radial-gradient(circle at 76% 16%, rgba(231, 149, 64, 0.18), transparent 20%),
			radial-gradient(circle at 20% 84%, rgba(95, 57, 133, 0.2), transparent 28%),
			linear-gradient(135deg, #140d16, #0c0d12 66%, #100d10);
	}
	.collection-hero h1,
	.section-intro h2,
	.selection-review h2 {
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 0.94;
	}
	.collection-hero h1 {
		max-width: 40rem;
		margin: 1rem 0;
		font-size: clamp(3.1rem, 7vw, 6.5rem);
	}
	.collection-hero-copy > p:not(.eyebrow),
	.section-intro > p:not(.eyebrow) {
		max-width: 35rem;
		margin: 0;
		color: var(--muted);
		font-size: 1.05rem;
	}
	.collection-hero-copy .hero-note {
		margin-top: 1.35rem;
		color: #ebc28d;
		font-size: 0.82rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.collection-hero-copy .hero-editorial {
		max-width: 34rem;
		margin-top: 1.35rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.15rem, 2vw, 1.45rem);
		line-height: 1.35;
		color: rgba(247, 243, 238, 0.84);
	}
	.collection-video {
		width: min(100%, 23rem);
		justify-self: center;
		border-radius: 1.25rem;
		overflow: hidden;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.34);
	}
	.shop-section {
		padding: clamp(3.5rem, 8vw, 7rem) 0 0;
	}
	.reference-section {
		padding: clamp(4.5rem, 10vw, 9rem) 0 0;
	}
	.reference-copy {
		max-width: 38rem;
		margin-bottom: 1.5rem;
	}
	.reference-copy h2 {
		margin: 0.9rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2.3rem, 4.6vw, 4.3rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 0.94;
	}
	.section-intro {
		max-width: 44rem;
		margin-bottom: 2rem;
	}
	.section-intro h2 {
		margin: 0.9rem 0;
		font-size: clamp(2.4rem, 5vw, 4.6rem);
	}
	.design-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	.design-artwork { display:block; width:100%; aspect-ratio:1; object-fit:cover; border-radius:.8rem; }
	.design-card,
	.package-card {
		width: 100%;
		padding: 0;
		color: var(--text);
		text-align: left;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(12, 12, 15, 0.88);
		cursor: pointer;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}
	.design-card {
		overflow: hidden;
		border-radius: 1.1rem;
	}
	.design-card:hover,
	.package-card:hover,
	.design-card.selected,
	.package-card.selected {
		transform: translateY(-4px);
		border-color: rgba(235, 191, 124, 0.68);
		background: rgba(39, 25, 27, 0.92);
	}
	.design-placeholder {
		display: grid;
		align-content: end;
		min-height: 13rem;
		padding: 1rem;
		background:
			radial-gradient(circle at 78% 20%, rgba(233, 157, 77, 0.3), transparent 22%),
			radial-gradient(circle at 18% 75%, rgba(109, 70, 151, 0.36), transparent 32%),
			linear-gradient(135deg, #100d16, #1c1012 62%, #090a0e);
	}
	.design-placeholder small {
		font-size: 0.62rem;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: #eac18d;
	}
	.design-placeholder strong {
		margin: 0.55rem 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.35rem, 2.4vw, 2rem);
		font-weight: 500;
		line-height: 0.98;
	}
	.design-card-copy {
		display: flex;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.9rem 1rem;
	}
	.design-card-copy strong {
		font-size: 0.9rem;
		font-weight: 600;
	}
	.design-card-copy span {
		color: var(--muted);
		font-size: 0.74rem;
	}
	.design-card.selected .design-card-copy span {
		color: #f0cb98;
	}
	.asset-note,
	.configuration-note {
		margin: 1rem 0 0;
		color: var(--muted);
		font-size: 0.78rem;
	}

	.collection-reference {
		margin: 1.5rem 0 0;
		padding: 0.7rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.1rem;
		background: rgba(10, 10, 13, 0.8);
	}

	.collection-reference img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 0.7rem;
	}

	.collection-reference figcaption {
		padding: 0.7rem 0.25rem 0.1rem;
		color: var(--muted);
		font-size: 0.78rem;
	}
	.package-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.85rem;
	}
	.package-card {
		display: grid;
		gap: 0.85rem;
		min-height: 15rem;
		padding: 1.2rem;
		border-radius: 1.1rem;
	}
	.package-card.featured {
		border-color: rgba(235, 191, 124, 0.38);
		background: linear-gradient(160deg, rgba(76, 45, 35, 0.7), rgba(13, 13, 16, 0.95));
	}
	.package-card.custom {
		background: linear-gradient(160deg, rgba(54, 38, 65, 0.7), rgba(13, 13, 16, 0.95));
	}
	.package-topline {
		display: flex;
		justify-content: space-between;
		gap: 0.6rem;
		color: #eac18d;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.package-topline em {
		color: #f7e1bd;
		font-style: normal;
	}
	.package-card > strong {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.45rem;
		font-weight: 500;
		line-height: 1;
	}
	.package-card b {
		font-size: 1.05rem;
		font-weight: 600;
	}
	.package-card p {
		margin: 0;
		color: var(--muted);
		font-size: 0.85rem;
	}
	.package-card .bespoke-note {
		align-self: end;
		color: #dfc5f4;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 0.92rem;
	}
	.selection-review {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 1.5rem;
		align-items: center;
		margin-top: clamp(3.5rem, 8vw, 7rem);
		padding: clamp(1.3rem, 4vw, 2rem);
		border: 1px solid rgba(235, 191, 124, 0.3);
		border-radius: 1.35rem;
		background: linear-gradient(135deg, rgba(37, 23, 29, 0.9), rgba(13, 13, 16, 0.94));
	}
	.selection-review h2 {
		margin: 0.7rem 0 0.5rem;
		font-size: clamp(2rem, 4vw, 3.3rem);
	}
	.selection-review p {
		margin: 0;
		color: var(--muted);
	}
	.edition-summary {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.9rem 1.5rem;
		margin: 1.25rem 0 0;
	}
	.edition-summary div {
		display: grid;
		gap: 0.25rem;
	}
	.edition-summary dt {
		color: #eac18d;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.edition-summary dd {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.1rem;
		line-height: 1.15;
	}
	.quantity-control label {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--muted);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.quantity-control div {
		display: flex;
		border: 1px solid var(--line);
		border-radius: 999px;
		overflow: hidden;
	}
	.quantity-control button,
	.quantity-control input {
		width: 2.3rem;
		min-height: 2.5rem;
		border: 0;
		color: var(--text);
		background: rgba(255, 255, 255, 0.05);
		text-align: center;
	}
	.quantity-control input {
		width: 2.7rem;
		background: transparent;
	}
	.review-cta {
		white-space: nowrap;
	}
	.configuration-note {
		grid-column: 1 / -1;
	}
	@media (max-width: 880px) {
		.package-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.selection-review {
			grid-template-columns: 1fr auto;
		}
		.review-cta {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 720px) {
		.halloween-page {
			padding-top: 1.4rem;
		}
		.collection-hero {
			grid-template-columns: 1fr;
		}
		.collection-video {
			width: min(100%, 19rem);
		}
		.design-grid {
			display: flex;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			padding-bottom: 0.4rem;
		}
		.design-card {
			flex: 0 0 min(78vw, 19rem);
			scroll-snap-align: start;
		}
		.selection-review {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		.edition-summary {
			grid-template-columns: 1fr;
			gap: 0.8rem;
		}
		.review-cta {
			grid-column: auto;
		}
	}
	@media (max-width: 480px) {
		.package-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
