<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ProductMedia from '$lib/components/products/ProductMedia.svelte';
	import CarnivalFeature from '$lib/components/home/CarnivalFeature.svelte';
	import {
		halloweenDesigns,
		halloweenPackages,
		halloweenProducts,
		type HalloweenPackage
	} from '$lib/products/halloween';

	let selectedDesignSlug = $state(halloweenDesigns[0].slug);
	let selectedPackageId = $state<HalloweenPackage['id']>('full-mural');
	let quantity = $state(1);
	let collectionTab = $state<'murals' | 'decals'>('murals');
	let personalized = $state(false);
	let decalPersonalized = $state(false);
	type CartItem =
		| {
				kind: 'mural';
				designSlug: string;
				packageId: HalloweenPackage['id'];
				variantId: string;
				quantity: number;
		  }
		| {
				kind: 'decal';
				designSlug: string;
				decalSize: string;
				personalized: boolean;
				quantity: number;
		  };
	let cartItems = $state<CartItem[]>([]);
	let cartMessage = $state('');
	let decalUseAcknowledged = $state(false);
	const cartHasDecal = $derived(cartItems.some((item) => item.kind === 'decal'));
	onMount(() => {
		try {
			cartItems = JSON.parse(
				localStorage.getItem('holographe-halloween-cart') ?? '[]'
			) as CartItem[];
		} catch {
			cartItems = [];
		}
	});
	$effect(() => {
		if (typeof window !== 'undefined')
			localStorage.setItem('holographe-halloween-cart', JSON.stringify(cartItems));
	});
	function addMuralToCart() {
		cartItems = [
			...cartItems,
			{
				kind: 'mural',
				designSlug: selectedDesign.slug,
				packageId: selectedPackage.id,
				variantId: selectedVariant.id,
				quantity
			}
		];
		cartMessage = `${selectedDesign.name} added to your bag.`;
	}
	function addDecalToCart() {
		cartItems = [
			...cartItems,
			{
				kind: 'decal',
				designSlug: selectedDesign.slug,
				decalSize,
				personalized: decalPersonalized,
				quantity: 1
			}
		];
		decalUseAcknowledged = false;
		cartMessage = `${selectedDesign.name} decal added to your bag.`;
	}
	function removeCartItem(index: number) {
		cartItems = cartItems.filter((_, i) => i !== index);
		if (!cartItems.some((item) => item.kind === 'decal')) decalUseAcknowledged = false;
	}
	function cartItemName(item: CartItem) {
		const design =
			halloweenDesigns.find((candidate) => candidate.slug === item.designSlug)?.name ??
			'Halloween design';
		if (item.kind === 'decal') return `${design} decal · ${item.decalSize}`;
		return `${design} · ${halloweenPackages.find((candidate) => candidate.id === item.packageId)?.label ?? 'Mural'}`;
	}
	function cartItemPrice(item: CartItem) {
		if (item.kind === 'decal')
			return (
				(decalOptions.find((o) => o.id === item.decalSize)?.cents ?? 0) +
				(item.personalized ? 500 : 0)
			);
		return (
			halloweenPackages
				.find((candidate) => candidate.id === item.packageId)
				?.variants.find((variant) => variant.id === item.variantId)?.priceCents ?? 0
		);
	}
	const cartTotal = $derived(
		cartItems.reduce((sum, item) => sum + cartItemPrice(item) * item.quantity, 0)
	);
	let decalSize = $state('6-inch');
	const decalOptions = [
		{ id: '4-inch', label: '4-inch', price: '$9.99', cents: 999 },
		{ id: '6-inch', label: '6-inch', price: '$14.99', cents: 1499 },
		{ id: '8-inch', label: '8-inch', price: '$19.99', cents: 1999 }
	];

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
	const selectedVariant = $derived(
		selectedPackage.variants.find((variant) =>
			variant.id.endsWith(personalized ? 'personalized' : 'standard')
		) ?? selectedPackage.variants[0]
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
			<p>Halloween magnets with a little extra personality.</p>
			<p class="hero-editorial">
				Pick the artwork you love, choose the size, and you’re ready to shop.
			</p>
			<p class="hero-note">Made by me in Texas. A little spooky, a lot of shine.</p>
		</div>
		<div class="collection-video">
			<ProductMedia media={halloweenProducts[0].media} label="Halloween magnetic decor" autoplay />
		</div>
	</section>

	<CarnivalFeature />
	<nav class="collection-tabs" aria-label="Halloween products">
		<button
			type="button"
			class:active={collectionTab === 'murals'}
			aria-pressed={collectionTab === 'murals'}
			onclick={() => (collectionTab = 'murals')}>Mural Magnets</button
		>
		<button
			type="button"
			class:active={collectionTab === 'decals'}
			aria-pressed={collectionTab === 'decals'}
			onclick={() => (collectionTab = 'decals')}>Magnetic Decals</button
		>
	</nav>

	{#if collectionTab === 'murals'}
		<section class="shop-section" aria-labelledby="design-heading">
			<div class="section-intro">
				<p class="eyebrow">First, choose your art</p>
				<h2 id="design-heading">Which one are you taking home?</h2>
				<p>
					Each design is available as one panel, a four-piece mini mural, or the full nine-piece
					Signature Mural.
				</p>
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
							<img
								class="design-artwork"
								src={design.thumbnail.src}
								alt={design.thumbnail.alt}
								loading="lazy"
							/>
						{/if}
						<div class="design-card-copy">
							<strong>{design.name}</strong>
							<span>{selectedDesign.slug === design.slug ? 'Selected' : 'Select design'}</span>
						</div>
					</button>
				{/each}
			</div>
			<p class="asset-note">
				New designs are going up as I finish them. More spooky stuff is on the way.
			</p>
		</section>

		<section class="shop-section" aria-labelledby="format-heading">
			<div class="section-intro">
				<p class="eyebrow">Then choose your set</p>
				<h2 id="format-heading">How much wall do you want to haunt?</h2>
				<p>All panels are 8×10. The mini mural is four panels; Signature is the full nine.</p>
			</div>

			<div class="package-grid" role="radiogroup" aria-label="Halloween package">
				{#each availablePackages as productPackage (productPackage.id)}
					<button
						type="button"
						class:selected={selectedPackage.id === productPackage.id}
						class:featured={productPackage.id === 'full-mural'}
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
					<div>
						<dt>Price</dt>
						<dd>${(selectedVariant.priceCents / 100).toFixed(2)}</dd>
					</div>
				</dl>
			</div>
			<label class="personalize-choice"
				><input type="checkbox" bind:checked={personalized} /> Add a name or short phrase
				<strong>+$5</strong></label
			>
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
			<button class="button-primary review-cta" type="button" onclick={addMuralToCart}
				>Add to cart · ${(selectedVariant.priceCents / 100).toFixed(2)}</button
			>
			<p class="configuration-note">
				You’ll confirm the details and pay securely at checkout. Personalized designs add $5.
			</p>
		</section>
	{:else}
		<section class="shop-section decals-section" aria-labelledby="decals-heading">
			<div class="section-intro">
				<p class="eyebrow">Made for a little road presence</p>
				<h2 id="decals-heading">Magnetic Decals</h2>
				<p>
					Take the Halloween art with you. Pick a design, choose a size, and pop it on your car or
					any magnetic surface.
				</p>
			</div>
			<div class="design-grid" role="radiogroup" aria-label="Magnetic decal artwork">
				{#each halloweenDesigns as design (design.id)}
					<button
						type="button"
						class:selected={selectedDesign.slug === design.slug}
						class="design-card"
						role="radio"
						aria-checked={selectedDesign.slug === design.slug}
						onclick={() => (selectedDesignSlug = design.slug)}
					>
						<img
							class="design-artwork"
							src={design.thumbnail?.src}
							alt={design.thumbnail?.alt}
							loading="lazy"
						/>
						<div class="design-card-copy">
							<strong>{design.name}</strong><span
								>{selectedDesign.slug === design.slug ? 'Selected' : 'Select design'}</span
							>
						</div>
					</button>
				{/each}
			</div>
			<div class="decal-size-picker" role="radiogroup" aria-label="Magnetic decal size">
				{#each decalOptions as option (option.id)}
					<button
						type="button"
						class:selected={decalSize === option.id}
						aria-pressed={decalSize === option.id}
						onclick={() => (decalSize = option.id)}
						><span>{option.label}</span><strong>{option.price}</strong></button
					>
				{/each}
			</div>
			<label class="personalize-choice"
				><input type="checkbox" bind:checked={decalPersonalized} /> Add a name or short phrase
				<strong>+$5</strong></label
			>
			<div class="decal-add-form">
				<button class="button-primary review-cta" type="button" onclick={addDecalToCart}
					>Add to cart · ${(
						((decalOptions.find((o) => o.id === decalSize)?.cents ?? 0) +
							(decalPersonalized ? 500 : 0)) /
						100
					).toFixed(2)}</button
				>
			</div>
			<p class="configuration-note">
				Personalized decal artwork is $5 more. Reach out and I’ll make it yours.
			</p>
			<aside class="outdoor-use-warning" aria-labelledby="outdoor-use-heading">
				<h3 id="outdoor-use-heading">Important — Outdoor Use</h3>
				<p>
					Holographe decorative magnets feature a protective, UV-resistant laminate. However, the
					finished products have not yet been tested or certified for outdoor or vehicle use. At
					this time, they are intended for indoor magnetic surfaces only. Vehicle use is not
					recommended until additional durability and adhesion testing is completed.
				</p>
			</aside>
		</section>
	{/if}
	{#if cartMessage}<p class="cart-message" role="status">{cartMessage}</p>{/if}
	{#if cartItems.length}
		<section class="selection-review cart-review" aria-labelledby="cart-heading">
			<div>
				<p class="eyebrow">
					Your bag · {cartItems.length}
					{cartItems.length === 1 ? 'item' : 'items'}
				</p>
				<h2 id="cart-heading">Ready when you are.</h2>
				<ul class="cart-list">
					{#each cartItems as item, index}<li>
							<span>{cartItemName(item)} × {item.quantity}</span><strong
								>${((cartItemPrice(item) * item.quantity) / 100).toFixed(2)}</strong
							><button
								type="button"
								aria-label={`Remove ${cartItemName(item)}`}
								onclick={() => removeCartItem(index)}>Remove</button
							>
						</li>{/each}
				</ul>
				<p class="cart-total">Subtotal <strong>${(cartTotal / 100).toFixed(2)}</strong></p>
			</div>
			<form method="POST" action="/checkout" class="cart-checkout-form">
				<input type="hidden" name="product" value="halloween-cart" />
				{#if cartHasDecal}
					<aside
						class="outdoor-use-warning cart-outdoor-warning"
						aria-labelledby="cart-outdoor-use-heading"
					>
						<h3 id="cart-outdoor-use-heading">Important — Outdoor Use</h3>
						<p>
							Holographe decorative magnets feature a protective, UV-resistant laminate. However,
							the finished products have not yet been tested or certified for outdoor or vehicle
							use. At this time, they are intended for indoor magnetic surfaces only. Vehicle use is
							not recommended until additional durability and adhesion testing is completed.
						</p>
					</aside>
					<label class="decal-acknowledgment">
						<input
							type="checkbox"
							name="decal_use_ack"
							value="yes"
							bind:checked={decalUseAcknowledged}
							required
						/>
						<span
							>I understand these magnets are for indoor magnetic surfaces only and are not tested
							or certified for outdoor or vehicle use. I will not use them on a vehicle.</span
						>
					</label>
				{/if}
				<input type="hidden" name="cart_json" value={JSON.stringify(cartItems)} /><button
					class="button-primary review-cta"
					type="submit"
					disabled={cartHasDecal && !decalUseAcknowledged}
					>Secure checkout · ${(cartTotal / 100).toFixed(2)}</button
				>
				<p class="configuration-note">
					Shipping and any applicable tax are calculated securely at checkout.
				</p>
			</form>
		</section>
	{/if}
</div>

<style>
	.halloween-page {
		width: min(1160px, calc(100vw - 1.1rem));
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3.5rem) 0 2.5rem;
	}
	.collection-tabs {
		display: flex;
		gap: 0.5rem;
		margin: 1.25rem 0 2rem;
		padding: 0.35rem;
		border: 1px solid rgba(236, 185, 108, 0.2);
		border-radius: 999px;
		background: #100b10;
		width: max-content;
		max-width: 100%;
	}
	.collection-tabs button {
		border: 0;
		border-radius: 999px;
		padding: 0.8rem 1.2rem;
		background: transparent;
		color: #d8c5dc;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.collection-tabs button.active {
		background: #f0bf75;
		color: #21120d;
	}
	.decal-size-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
	.decal-size-picker button {
		display: grid;
		gap: 0.35rem;
		min-width: 8rem;
		padding: 1rem;
		border: 1px solid rgba(236, 185, 108, 0.3);
		border-radius: 1rem;
		background: #100b10;
		color: #fdf6ec;
		text-align: left;
		cursor: pointer;
	}
	.decal-size-picker button.selected {
		border-color: #f0bf75;
		box-shadow: 0 0 0 2px rgba(240, 191, 117, 0.18);
	}
	.decal-size-picker strong {
		color: #f0bf75;
		font-size: 1.1rem;
	}
	.decal-add-form {
		margin-top: 1.25rem;
	}
	.outdoor-use-warning {
		max-width: 52rem;
		margin-top: 1.5rem;
		padding: 1rem 1.15rem;
		border: 1px solid rgba(240, 191, 117, 0.35);
		border-left: 3px solid #f0bf75;
		border-radius: 0.8rem;
		background: rgba(240, 191, 117, 0.07);
	}
	.outdoor-use-warning h3 {
		margin: 0 0 0.45rem;
		color: #f0bf75;
		font-size: 0.86rem;
		letter-spacing: 0.04em;
	}
	.outdoor-use-warning p {
		margin: 0;
		color: #f2e6d2;
		font-size: 0.84rem;
		line-height: 1.6;
	}
	.personalize-choice {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 1.1rem 0;
		color: #f2e6d2;
	}
	.personalize-choice strong {
		color: #f0bf75;
	}
	.cart-outdoor-warning {
		margin: 0 0 1rem;
	}
	.decal-acknowledgment {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		margin: 0.25rem 0 1rem;
		padding: 0.9rem;
		border: 1px solid rgba(240, 191, 117, 0.3);
		border-radius: 0.8rem;
		color: #f2e6d2;
		font-size: 0.86rem;
		line-height: 1.5;
	}
	.decal-acknowledgment input {
		flex: 0 0 auto;
		width: 1.15rem;
		height: 1.15rem;
		margin-top: 0.1rem;
		accent-color: #f0bf75;
	}
	.cart-message {
		margin: 1rem 0;
		color: #f0bf75;
	}
	.cart-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0;
		display: grid;
		gap: 0.75rem;
	}
	.cart-list li {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 0.8rem;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--line);
	}
	.cart-list strong,
	.cart-total strong {
		color: #f0bf75;
	}
	.cart-list button {
		color: #d8c5dc;
		border: 0;
		background: transparent;
		text-decoration: underline;
		cursor: pointer;
	}
	.cart-total {
		display: flex;
		justify-content: space-between;
		font-size: 1.1rem;
	}
	.cart-review {
		margin-top: 2rem;
	}
	.cart-checkout-form {
		display: grid;
		align-content: center;
	}
	.cart-checkout-form button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
	.collection-hero {
		--text: #fff7fb;
		--muted: #d8c5dc;
		color: var(--text);
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(15rem, 0.62fr);
		gap: clamp(1.25rem, 4vw, 3rem);
		align-items: center;
		padding: clamp(1.2rem, 3vw, 2rem);
		border: 1px solid rgba(236, 185, 108, 0.2);
		border-radius: 2rem;
		background:
			radial-gradient(circle at 76% 16%, rgba(255, 107, 0, 0.42), transparent 24%),
			radial-gradient(circle at 20% 84%, rgba(95, 57, 133, 0.2), transparent 28%),
			linear-gradient(135deg, #170711, #080609 66%, #16070d);
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
		width: min(100%, 20rem);
		justify-self: center;
		border-radius: 1.25rem;
		overflow: hidden;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.34);
	}
	.shop-section {
		padding: clamp(3.5rem, 8vw, 7rem) 0 0;
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
	.design-artwork {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 0.8rem;
	}
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

	.package-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
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
